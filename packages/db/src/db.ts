import { PrismaClient } from "@prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import { Pool, neonConfig } from "@neondatabase/serverless"

if (!("WebSocket" in globalThis)) {
  const ws = require("ws")
  neonConfig.webSocketConstructor = ws
}

neonConfig.useSecureWebSocket = true

neonConfig.poolQueryViaFetch = true

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL
  const pool = new Pool({ connectionString })
  const adapter = new PrismaNeon(pool)

  return new PrismaClient({
    adapter,
    log: ["error", "warn"],
  })
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined
}

export * from "@prisma/client"

export const db = globalForPrisma.prisma ?? createPrismaClient()
