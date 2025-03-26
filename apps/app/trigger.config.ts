import { defineConfig } from "@trigger.dev/sdk/v3"
import { prismaExtension } from "@trigger.dev/build/extensions/prisma"

export default defineConfig({
  project: "proj_nxdfyjloydulgxrcpfsz",
  runtime: "node",
  logLevel: "log",
  maxDuration: 500,
  build: {
    extensions: [
      prismaExtension({
        schema: "../../packages/db/prisma/schema.prisma",
      }),
    ],
  },
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 8,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  dirs: ["./src/trigger"],
})
