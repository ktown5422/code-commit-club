# CodeStreak

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss)
![NextAuth](https://img.shields.io/badge/Auth-GitHub-181717?style=for-the-badge&logo=github)
![Octokit](https://img.shields.io/badge/API-Octokit-6E40C9?style=for-the-badge&logo=github)

[![CI](https://github.com/ktown5422/code-commit-club/actions/workflows/ci.yml/badge.svg)](https://github.com/ktown5422/code-commit-club/actions/workflows/ci.yml)

**[→ Try the live app](https://codestreakapp.vercel.app)** · Sign in with GitHub to see your own streak data.

CodeStreak is a modern GitHub habit tracker built with Next.js. It helps developers stay consistent by turning daily commits into visible progress, streaks, profile insights, contributor data, and leaderboard momentum.

## Overview

The app currently includes:

- GitHub sign-in with NextAuth
- a modern landing page and dashboard experience
- GitHub profile stats powered by Octokit
- repository lookup and contributor aggregation
- commit activity tracking
- streak and leaderboard views

## Tech Stack

- `Next.js 15`
- `React 19`
- `TypeScript`
- `Tailwind CSS 4`
- `NextAuth v5 beta`
- `Octokit`
- `PostgreSQL` with `Prisma`
- `Chart.js` with `react-chartjs-2`
- `Framer Motion`
- `Vitest` for unit and database tests

## Features

- GitHub OAuth sign-in
- profile card with avatar, username, email, and bio
- recent commit activity chart
- contributor leaderboard
- repository-aware GitHub stats
- responsive landing page, navbar, dashboard, and footer
- daily checklist, repository focus mode, and customizable goals
- best commit time insight
- Discord progress and leaderboard sharing

## Getting Started

Install dependencies:

```bash
npm install
```

Create the database and apply migrations:

```bash
createdb codestreak_dev && npm run db:migrate
```

Start the development server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env.local` file in the project root and add:

```env
AUTH_SECRET="your-random-secret"
AUTH_GITHUB_ID="your-github-oauth-app-client-id"
AUTH_GITHUB_SECRET="your-github-oauth-app-client-secret"
DISCORD_BOT_TOKEN="your-discord-bot-token"
DISCORD_GUILD_ID="your-discord-server-id"
DISCORD_CHANNEL_ID="your-discord-channel-id"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
DATABASE_URL="postgresql://localhost:5432/codestreak_dev"
```

For local development, your GitHub OAuth app callback URL should be:

```text
http://localhost:3000/api/auth/callback/github
```

An example file is included here:

```text
.env.example
```

The Discord variables are optional. When they are present, the dashboard filters the top contributors leaderboard to members of that Discord server. The Discord bot needs access to list guild members, including the Server Members Intent for larger/member-gated servers. Discord members are matched against GitHub contributors by comparing the contributor username to the member username, global display name, server nickname, or an `@github-handle` inside the display name or nickname.

When Discord is configured, the dashboard also shows a CodeStreak Bot status card with the bot connection state, server name, and visible member count. The bot token is only used on the server and is never sent to the browser.

Add `DISCORD_CHANNEL_ID` to enable the dashboard's Discord sharing actions. The bot needs `View Channel`, `Send Messages`, and `Embed Links` permissions in that channel. Shared progress and leaderboard posts link back to `NEXT_PUBLIC_APP_URL`.

The dashboard also shows recent public push activity from people the signed-in GitHub user follows. This is based on public GitHub events, so private commits and hidden contribution activity are not included.

## Available Scripts

```bash
npm run dev
```

Runs the app in development mode.

```bash
npm run build
```

Builds the app for production.

```bash
npm run start
```

Starts the production server.

```bash
npm run lint
```

Runs linting checks.

```bash
npm run test
```

Runs the unit test suite once. Use `npm run test:watch` while developing.

```bash
npm run typecheck
```

Runs TypeScript with no emit.

## Testing

The habit logic is written as pure functions so it can be tested without touching the
GitHub or Discord APIs. `vitest` covers the parts where the edge cases actually live:

- `calculateStreaks` — an empty *today* pauses a streak rather than breaking it, gaps
  end it, and future-dated calendar days are ignored
- `buildCommitTimeInsight` — commit-hour bucketing and window boundaries
- `normalizeHandle` / `collectMemberAliases` — matching Discord members to GitHub
  contributors by username, global name, nickname, or an `@handle` inside a nickname
- `getWeekKey` / `seededShuffle` — deterministic weekly accountability pairings

`lib/member-store.test.ts` covers the database layer against a real Postgres,
since the behaviour worth testing there — upserts, the composite unique key,
server-side clamping, and cascading deletes — is exactly what a mock would hide.

Every push and pull request runs migrations against a Postgres service
container, then typecheck, lint, tests, and a production build in CI.

## Database

Member state — commit targets, the weekly challenge goal, the focus repository,
and each day's checklist — is stored in Postgres through Prisma, so it follows a
member across devices instead of living in one browser.

Three tables, defined in `prisma/schema.prisma`:

- `users` — one row per GitHub account, keyed by a unique `githubLogin` and
  created lazily on first dashboard load
- `user_settings` — one row per user (`1:1`), holding the targets they picked
- `checklist_days` — one row per user per calendar day, with a composite unique
  key on `(userId, day)` so the daily save is a safe upsert

Both child tables cascade on delete, and every numeric target is clamped
server-side in `lib/member-store.ts` rather than trusting the client that posted
it. Writes go through Next.js server actions in `app/dashboard/actions.ts`, each
of which re-derives the caller from the session instead of accepting a user id.

Useful commands:

```bash
npm run db:migrate
```

Creates and applies a migration in development.

```bash
npm run db:deploy
```

Applies existing migrations — this is what CI and production run.

```bash
npm run db:studio
```

Opens Prisma Studio to browse the data.

For production, point `DATABASE_URL` at any hosted Postgres (Neon, Supabase, and
Vercel Postgres all work), then run `npm run db:deploy` once against it.

## GitHub Data Layer

The dashboard uses Octokit to power GitHub-aware views, including:

- authenticated user profile data
- repository fetches
- contributor lists
- commit counts
- commit activity summaries
- best commit time analysis
- leaderboard aggregation
- public push activity from people the signed-in user follows
- optional Discord community filtering for the contributor leaderboard

The main GitHub service lives in:

```text
lib/github.ts
```

## Node Runtime Note

This project currently uses a small workaround in the npm scripts:

```bash
NODE_OPTIONS=--no-experimental-webstorage
```

That is there to avoid a server-side `localStorage` issue seen in newer Node releases.

For the smoothest experience, use `Node 22 LTS` when possible.


## Deployment

You can deploy this app with any platform that supports Next.js.

Vercel is the simplest path for most projects:

- connect the repository
- add the environment variables
- deploy
