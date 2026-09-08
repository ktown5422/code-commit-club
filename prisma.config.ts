import { config as loadEnv } from "dotenv"
import { defineConfig, env } from "prisma/config"

// Next.js reads .env.local on its own, but the Prisma CLI does not, so migrate
// and studio need it loaded here to find DATABASE_URL.
loadEnv({ path: ".env.local", quiet: true })
loadEnv({ quiet: true })

export default defineConfig({
    schema: "prisma/schema.prisma",
    datasource: {
        url: env("DATABASE_URL"),
    },
})
