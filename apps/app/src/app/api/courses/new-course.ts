"use server"

import { auth } from "@/auth"
import { isUserSubscribed } from "@/hooks/is-subscribed"
import { CourseModule, Lesson } from "@/types/types"
import { createOpenAI } from "@ai-sdk/openai"
import { db } from "@kouza/db"
import { generateObject } from "ai"
import { z } from "zod"

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  compatibility: "strict",
})

const courseSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  modules: z.array(
    z.object({
      title: z.string(),
      slug: z.string(),
      description: z.string(),
      order: z.number(),
    })
  ),
})

const moduleLessonsSchema = z.object({
  lessons: z.array(
    z.object({
      title: z.string(),
      slug: z.string(),
      description: z.string(),
      order: z.number(),
    })
  ),
})

const lessonContentSchema = z.object({
  content: z.string(),
  media: z.array(
    z.object({
      type: z.string(),
      url: z.string(),
      caption: z.string(),
    })
  ),
  quiz: z.object({
    questions: z.array(
      z.object({
        question: z.string(),
        options: z.array(z.string()),
        correctAnswer: z.number(),
      })
    ),
  }),
})

type PrismaError = {
  code: string
  message: string
}

const freePrompt = (prompt: string) =>
  `Create a concise course outline based on: ${prompt}. Include up to 5 modules. Slug should be shortened version of title in lowercase. Module slugs should be shortened version of module title in lowercase.`
const subscribedPrompt = (prompt: string) =>
  `Create a concise course outline based on: ${prompt}. Include as many modules as possible. Slug should be shortened version of title in lowercase. Module slugs should be shortened version of module title in lowercase.`

const freeModulePrompt = (moduleTitle: string) =>
  `Create strictly up to 3 lessons for the module "${moduleTitle}". Keep descriptions brief. Slug should be shortened version of lesson title in lowercase.`
const subscribedModulePrompt = (moduleTitle: string) =>
  `Create as many lessons as possible for the module "${moduleTitle}". Keep descriptions brief. Slug should be shortened version of lesson title in lowercase.`

export async function newCourse(prompt: string, userId: string) {
  if (!userId) {
    throw new Error("User not found")
  }

  try {
    const userSubscribed = await isUserSubscribed(Number(userId))

    const subscription = await db.subscription.findFirst({
      where: {
        userId: Number(userId),
        OR: [
          {
            status: "ACTIVE",
            currentPeriodEnd: {
              gt: new Date(),
            },
          },
          {
            status: "CANCELED",
            currentPeriodEnd: {
              gt: new Date(),
            },
          },
        ],
      },
      orderBy: {
        currentPeriodStart: "desc",
      },
    })

    if (!userSubscribed) {
      const courses = await db.course.findMany({
        where: {
          generatedBy: Number(userId),
        },
      })

      if (courses.length >= 3) {
        throw new Error(
          "You have reached the maximum number of free courses. Subscribe to generate up to 10 full length courses per month!"
        )
      }
    } else {
      const coursesThisMonth = await db.course.findMany({
        where: {
          generatedBy: Number(userId),
          type: "FULL",
          createdAt: {
            gte:
              subscription?.currentPeriodStart ??
              new Date(new Date().setMonth(new Date().getMonth() - 1)),
          },
        },
      })

      if (coursesThisMonth.length >= 10) {
        throw new Error(
          "You have reached the maximum number of courses available this month."
        )
      }
    }

    const courseResult = await generateObject({
      model: openai("gpt-4o-mini", { structuredOutputs: true }),
      schemaName: "course",
      schema: courseSchema,
      prompt: userSubscribed ? subscribedPrompt(prompt) : freePrompt(prompt),
    })

    if (!courseResult?.object) {
      throw new Error("Failed to generate course structure")
    }

    const course = courseResult.object

    const newCourse = await db.course.create({
      data: {
        prompt,
        type: userSubscribed ? "FULL" : "FREE",
        title: course.title,
        slug: course.slug + "-" + userId,
        description: course.description,
        generatedBy: Number(userId),
      },
    })

    await db.module.createMany({
      data: course.modules.map((module, index) => ({
        courseId: newCourse.id,
        title: module.title,
        slug: `${module.slug}-${userId}-${index}`,
        description: module.description,
        order: index,
      })),
    })

    const courseModules = await db.module.findMany({
      where: { courseId: newCourse.id },
      orderBy: { order: "asc" },
    })

    const modulesWithLessons = await Promise.all(
      courseModules.map(
        async (courseModule: CourseModule, moduleIndex: number) => {
          try {
            const lessonsResult = await generateObject({
              model: openai("gpt-4o-mini", { structuredOutputs: true }),
              schemaName: "moduleLessons",
              schema: moduleLessonsSchema,
              prompt: userSubscribed
                ? subscribedModulePrompt(courseModule.title)
                : freeModulePrompt(courseModule.title),
            })

            if (!lessonsResult?.object?.lessons) {
              throw new Error(
                `Failed to generate lessons for module ${moduleIndex + 1}`
              )
            }

            const dbLessons = []
            for (
              let lessonIndex = 0;
              lessonIndex < lessonsResult.object.lessons.length;
              lessonIndex++
            ) {
              const lesson = lessonsResult.object.lessons[lessonIndex]

              let baseSlug = lesson?.slug + "-" + userId
              let uniqueSlug = baseSlug
              let counter = 1
              while (
                await db.lesson.findUnique({ where: { slug: uniqueSlug } })
              ) {
                uniqueSlug = `${lesson?.slug}-${userId}-${counter}`
                counter++
              }

              const contentResult = await generateObject({
                model: openai("gpt-4o-mini", { structuredOutputs: true }),
                schemaName: "lessonContent",
                schema: lessonContentSchema,
                prompt: `Create detailed educational content for lesson "${lesson?.title}". 
                The content should be at least 2000 words and focus purely on teaching the material.
                DO NOT include any quiz questions, exercises, or test material in the content section.
                The quiz section will be handled separately in the quiz object.
                After generating the main content, create a separate comprehensive quiz with multiple questions to test understanding.
                Each quiz question must have exactly 4 options.`,
              })

              try {
                const courseLesson = await db.lesson.create({
                  data: {
                    moduleId: courseModule.id,
                    title: lesson?.title || "",
                    slug: uniqueSlug,
                    content:
                      contentResult?.object?.content ||
                      "Content generation failed",
                    media: contentResult?.object?.media || [],
                    order: lessonIndex,
                    quiz: contentResult?.object?.quiz || { questions: [] },
                  },
                })
                dbLessons.push(courseLesson)
              } catch (error) {
                if ((error as PrismaError).code === "P2002") {
                  console.error(
                    `Unique constraint failed for slug: ${uniqueSlug}. Retrying...`
                  )
                }
                console.error(
                  `Error creating lesson "${lesson?.title}":`,
                  (error as Error).message
                )
              }
            }

            await db.module.update({
              where: { id: courseModule.id },
              data: {
                lessons: {
                  connect: dbLessons.map((lesson: Lesson) => ({
                    id: lesson.id,
                  })),
                },
              },
            })

            return { ...courseModule, lessons: dbLessons }
          } catch (error) {
            console.error(
              `Error generating module content for module "${courseModule.title}":`,
              error
            )
            return { ...courseModule, lessons: [] }
          }
        }
      )
    )

    return {
      prompt,
      title: course.title,
      description: course.description,
      modules: modulesWithLessons,
      message: "Course created",
    }
  } catch (error) {
    throw new Error(`Failed to generate course: ${(error as Error).message}`)
  }
}

// ;("use server")

// import { auth } from "@/auth"
// import { isUserSubscribed } from "@/hooks/is-subscribed"
// import { createOpenAI } from "@ai-sdk/openai"
// import { db } from "@kouza/db"
// import { generateObject } from "ai"
// import { z } from "zod"

// const openai = createOpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
//   compatibility: "strict",
// })

// const courseSchema = z.object({
//   title: z.string(),
//   slug: z.string(),
//   description: z.string(),
//   modules: z.array(
//     z.object({
//       title: z.string(),
//       slug: z.string(),
//       description: z.string(),
//       order: z.number(),
//     })
//   ),
// })

// const freePrompt = (prompt: string) =>
//   `Create a concise course outline based on: ${prompt}. Include up to 5 modules. Slug should be shortened version of title in lowercase. Module slugs should be shortened version of module title in lowercase.`
// const subscribedPrompt = (prompt: string) =>
//   `Create a concise course outline based on: ${prompt}. Include as many modules as possible. Slug should be shortened version of title in lowercase. Module slugs should be shortened version of module title in lowercase.`

// export async function newCourse(prompt: string) {
//   const session = await auth()
//   const userId = session?.user?.id

//   if (!userId) {
//     throw new Error("User not found")
//   }

//   try {
//     const userSubscribed = await isUserSubscribed(Number(userId))

//     const courseResult = await generateObject({
//       model: openai("gpt-4o-mini", { structuredOutputs: true }),
//       schemaName: "course",
//       schema: courseSchema,
//       prompt: userSubscribed ? subscribedPrompt(prompt) : freePrompt(prompt),
//     })

//     if (!courseResult?.object) {
//       throw new Error("Failed to generate course structure")
//     }

//     const course = courseResult.object

//     const newCourse = await db.course.create({
//       data: {
//         prompt,
//         type: userSubscribed ? "FULL" : "FREE",
//         title: course.title,
//         slug: course.slug + "-" + userId,
//         description: course.description,
//         generatedBy: Number(userId),
//       },
//     })

//     await db.module.createMany({
//       data: course.modules.map((module, index) => ({
//         courseId: newCourse.id,
//         title: module.title,
//         slug: `${module.slug}-${userId}-${index}`,
//         description: module.description,
//         order: index,
//       })),
//     })

//     const courseModules = await db.module.findMany({
//       where: { courseId: newCourse.id },
//       orderBy: { order: "asc" },
//     })

//     // const modulesWithLessons = await Promise.all(
//     //   courseModules.map(
//     //     async (courseModule: CourseModule, moduleIndex: number) => {
//     //       try {
//     //         const lessonsResult = await generateObject({
//     //           model: openai("gpt-4o-mini", { structuredOutputs: true }),
//     //           schemaName: "moduleLessons",
//     //           schema: moduleLessonsSchema,
//     //           prompt: userSubscribed
//     //             ? subscribedModulePrompt(courseModule.title)
//     //             : freeModulePrompt(courseModule.title),
//     //         })

//     //         if (!lessonsResult?.object?.lessons) {
//     //           throw new Error(
//     //             `Failed to generate lessons for module ${moduleIndex + 1}`
//     //           )
//     //         }

//     //         const dbLessons = []
//     //         for (
//     //           let lessonIndex = 0;
//     //           lessonIndex < lessonsResult.object.lessons.length;
//     //           lessonIndex++
//     //         ) {
//     //           const lesson = lessonsResult.object.lessons[lessonIndex]

//     //           let randomString = Math.random().toString(36).substring(2, 5)
//     //           let uniqueSlug = `${lesson?.slug}-${userId}-${randomString}`

//     //           const contentResult = await generateObject({
//     //             model: openai("gpt-4o-mini", { structuredOutputs: true }),
//     //             schemaName: "lessonContent",
//     //             schema: lessonContentSchema,
//     //             prompt: `Create detailed educational content for lesson "${lesson?.title}".
//     //               The content should be at least 2000 words and focus purely on teaching the material.
//     //               DO NOT include any quiz questions, exercises, or test material in the content section.
//     //               The quiz section will be handled separately in the quiz object.
//     //               After generating the main content, create a separate comprehensive quiz with multiple questions to test understanding.
//     //               Each quiz question must have exactly 4 options.`,
//     //           })

//     //           try {
//     //             const courseLesson = await db.lesson.create({
//     //               data: {
//     //                 moduleId: courseModule.id,
//     //                 title: lesson?.title || "",
//     //                 slug: uniqueSlug,
//     //                 content:
//     //                   contentResult?.object?.content ||
//     //                   "Content generation failed",
//     //                 media: contentResult?.object?.media || [],
//     //                 order: lessonIndex,
//     //                 quiz: contentResult?.object?.quiz || { questions: [] },
//     //               },
//     //             })
//     //             dbLessons.push(courseLesson)
//     //           } catch (error: any) {
//     //             console.error(
//     //               `Error creating lesson "${lesson?.title}":`,
//     //               error.message
//     //             )
//     //           }
//     //         }

//     //         await db.module.update({
//     //           where: { id: courseModule.id },
//     //           data: {
//     //             lessons: {
//     //               connect: dbLessons.map((lesson: Lesson) => ({
//     //                 id: lesson.id,
//     //               })),
//     //             },
//     //           },
//     //         })

//     //         return { ...courseModule, lessons: dbLessons }
//     //       } catch (error) {
//     //         console.error(
//     //           `Error generating module content for module "${courseModule.title}":`,
//     //           error
//     //         )
//     //         return { ...courseModule, lessons: [] }
//     //       }
//     //     }
//     //   )
//     // )

//     return {
//       courseId: newCourse.id,
//       modules: courseModules,
//       // prompt,
//       // title: course.title,
//       // description: course.description,
//       // modules: modulesWithLessons,
//       // message: "Course created",
//     }
//   } catch (error) {
//     throw new Error(`Failed to generate course: ${(error as Error).message}`)
//   }
// }
