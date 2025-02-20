import { headers } from "next/headers"

export const runtime = "edge"

export async function GET(req: Request) {
  const headersList = headers()

  const response = new Response(
    new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder()

        const send = (data: string) => {
          controller.enqueue(encoder.encode(`data: ${data}\n\n`))
        }

        globalThis.generateProgress = send
      },
    }),
    {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    }
  )

  return response
}
