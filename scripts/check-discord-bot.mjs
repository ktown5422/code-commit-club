import { readFileSync } from "node:fs"
import { resolve } from "node:path"

const envPath = resolve(process.cwd(), ".env.local")

function loadLocalEnv() {
    let file

    try {
        file = readFileSync(envPath, "utf8")
    } catch {
        console.error("Missing .env.local. Add DISCORD_BOT_TOKEN and DISCORD_GUILD_ID first.")
        process.exit(1)
    }

    for (const line of file.split("\n")) {
        const trimmed = line.trim()

        if (!trimmed || trimmed.startsWith("#")) {
            continue
        }

        const separatorIndex = trimmed.indexOf("=")

        if (separatorIndex === -1) {
            continue
        }

        const key = trimmed.slice(0, separatorIndex)
        const value = trimmed
            .slice(separatorIndex + 1)
            .trim()
            .replace(/^["']|["']$/g, "")

        process.env[key] = value
    }
}

async function discordRequest(path) {
    const response = await fetch(`https://discord.com/api/v10${path}`, {
        headers: {
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
    })

    const body = await response.text()
    let data = null

    try {
        data = body ? JSON.parse(body) : null
    } catch {
        data = body
    }

    return { data, response }
}

loadLocalEnv()

const botToken = process.env.DISCORD_BOT_TOKEN
const guildId = process.env.DISCORD_GUILD_ID

if (!botToken || !guildId) {
    console.error("Missing DISCORD_BOT_TOKEN or DISCORD_GUILD_ID in .env.local.")
    process.exit(1)
}

console.log("Checking Discord bot token...")

const currentUser = await discordRequest("/users/@me")

if (!currentUser.response.ok) {
    console.error(`Bot token check failed: ${currentUser.response.status}`)
    console.error(currentUser.data?.message ?? currentUser.data)
    process.exit(1)
}

console.log(`Bot authenticated as ${currentUser.data.username}#${currentUser.data.discriminator}.`)
console.log("Checking guild access...")

const guild = await discordRequest(`/guilds/${guildId}`)

if (!guild.response.ok) {
    console.error(`Guild access check failed: ${guild.response.status}`)
    console.error(guild.data?.message ?? guild.data)
    console.error("Make sure the bot was invited to this server and DISCORD_GUILD_ID is correct.")
    process.exit(1)
}

console.log(`Bot can access guild: ${guild.data.name}.`)
console.log("Checking member list access...")

const members = await discordRequest(`/guilds/${guildId}/members?limit=10`)

if (!members.response.ok) {
    console.error(`Member list check failed: ${members.response.status}`)
    console.error(members.data?.message ?? members.data)
    console.error("Enable Server Members Intent in the Discord Developer Portal, then restart the app.")
    process.exit(1)
}

console.log(`Bot can list members. Sample returned: ${members.data.length}.`)
console.log("Discord bot check passed.")
