let connections = new Set<ReadableStreamController<any>>()

export const runtime = "edge"

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      connections.add(controller)
      const encoder = new TextEncoder()
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ message: "Connected" })}\n\n`)
      )
    },
    cancel(controller) {
      connections.delete(controller)
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Content-Encoding": "none",
      Connection: "keep-alive",
    },
  })
}

export function sendProgressToAll(message: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(`data: ${JSON.stringify({ message })}\n\n`)
  connections.forEach((controller) => controller.enqueue(data))
}
