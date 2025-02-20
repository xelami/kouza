"use server"

import { auth } from "@/auth"
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

export async function newCourse(prompt: string) {
  const session = await auth()
  const userId = session?.user?.id

  try {
    const courseResult = await generateObject({
      model: openai("gpt-4o-mini", { structuredOutputs: true }),
      schemaName: "course",
      schema: courseSchema,
      prompt: `Create a concise course outline based on: ${prompt}. Include as many modules as possible. Slug should be shortened version of title in lowercase. Module slugs should be shortened version of module title in lowercase.`,
    })

    if (!courseResult?.object) {
      throw new Error("Failed to generate course structure")
    }

    const course = courseResult.object

    const newCourse = await db.course.create({
      data: {
        prompt,
        title: course.title,
        slug: course.slug + "-" + userId,
        description: course.description,
        generatedBy: userId ? parseInt(userId) : null,
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
              prompt: `Create as many lessons as possible for the module "${courseModule.title}". Keep descriptions brief. Slug should be shortened version of lesson title in lowercase.`,
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
                prompt: `Create rich and detailed content for lesson "${lesson?.title}". Minimum of 2000 words for content (not including quiz questions). Do not include any quiz questions in the content. After that, include many quiz questions with 4 options each in the quiz section.`,
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
