# Code Commit Club

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss)
![NextAuth](https://img.shields.io/badge/Auth-GitHub-181717?style=for-the-badge&logo=github)
![Octokit](https://img.shields.io/badge/API-Octokit-6E40C9?style=for-the-badge&logo=github)

Code Commit Club is a modern GitHub habit tracker built with Next.js. It helps developers stay consistent by turning daily commits into visible progress, streaks, profile insights, contributor data, and leaderboard momentum.

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
```

For local development, your GitHub OAuth app callback URL should be:

```text
http://localhost:3000/api/auth/callback/github
```

An example file is included here:

```text
.env.example
```

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
- leaderboard aggregation

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
