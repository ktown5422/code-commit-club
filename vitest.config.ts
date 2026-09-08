import { resolve } from "node:path"
import { config as loadEnv } from "dotenv"
import { defineConfig } from "vitest/config"

// The store tests talk to a real Postgres, so DATABASE_URL has to be present.
// CI sets it directly; locally it comes from .env.local.
loadEnv({ path: ".env.local", quiet: true })

export default defineConfig({
    resolve: {
        alias: {
            "@": resolve(__dirname, "./"),
        },
    },
    test: {
        environment: "node",
        include: ["lib/**/*.test.ts"],
    },
})
