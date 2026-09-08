import { PrismaPg } from "@prisma/adapter-pg"

import { PrismaClient } from "@/generated/prisma/client"

// Next.js hot reload would otherwise open a new pool on every edit and exhaust
// Postgres connections, so the client is cached on globalThis in development.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function createPrismaClient() {
    const connectionString = process.env.DATABASE_URL

    if (!connectionString) {
        throw new Error("DATABASE_URL is not set. See .env.example.")
    }

    return new PrismaClient({ adapter: new PrismaPg({ connectionString }) })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma
}
