"use server"

import { createOpenAI } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  compatibility: "strict",
})

const contextSchema = z.object({
  content: z.string(),
})

export async function addContext(
  prompt: string,
  context: string | undefined,
  personality: string
) {
  const personalityPrompts = {
    default: "Respond in a neutral and informative tone.",
    genz: "Respond in a friendly and upbeat manner, casually sprinkling in Gen Z slang like 'bussin', 'fr fr', and 'no cap' to keep it fun and relatable.",
    scholar:
      "Respond in a professional and formal tone with deep, well-researched explanations, using precise academic language and clear analogies.",
    mentor: `Respond in a supportive and conversational manner, offering practical advice and encouragement as if you are a trusted mentor.`,
    enthusiastic:
      "Respond with high energy and vibrant enthusiasm, using dynamic language that motivates and excites.",
  }

  const personalityPrefix =
    personalityPrompts[personality as keyof typeof personalityPrompts]

  const fullPrompt = `${personalityPrefix}${context ? `Context: ${context}\n` : ""}${prompt}`

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: contextSchema,
    prompt: fullPrompt,
  })

  if (!object) {
    throw new Error("Failed to generate context")
  }

  return { object }
}
