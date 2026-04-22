# CodeStreak

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss)
![NextAuth](https://img.shields.io/badge/Auth-GitHub-181717?style=for-the-badge&logo=github)
![Octokit](https://img.shields.io/badge/API-Octokit-6E40C9?style=for-the-badge&logo=github)

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
- `Chart.js` with `react-chartjs-2`
- `Framer Motion`

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
