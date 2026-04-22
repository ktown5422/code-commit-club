'use client'

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { BsDiscord } from "react-icons/bs"
import { FaGripfire } from "react-icons/fa"
import { ArrowRight, CalendarDays, GitCommitHorizontal, Trophy, Users } from "lucide-react"

import { Button } from "../styleguide/components/ui/button"
import Container from "@/components/Container"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import TestimonialCard from "@/components/testimonialsCard"
import { testimonials } from "@/lib/testimonialsData"

const highlights = [
  {
    title: "Daily accountability",
    body: "Show up, ship a commit, and keep your momentum visible inside the club.",
    icon: CalendarDays,
  },
  {
    title: "Clear progress",
    body: "Track your streaks, commit rhythm, and the days you do your best work.",
    icon: GitCommitHorizontal,
  },
  {
    title: "Shared wins",
    body: "Celebrate milestones with other developers who care about consistency too.",
    icon: Trophy,
  },
]

const stats = [
  { label: "Daily check-ins", value: "7 days" },
  { label: "Best commit window", value: "9 PM" },
  { label: "Community energy", value: "Always on" },
]

export default function HomePage() {
  return (
    <main className="bg-white text-black">
      <section className="border-b border-black/5 bg-[#f8fafc] text-black">
        <Navbar />

        <Container className="pt-28 pb-16 md:pt-32 md:pb-20">
          <div className="grid items-end gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 rounded-md border border-indigo-200 bg-white px-3 py-1 text-sm font-medium text-indigo-700">
                <FaGripfire className="h-4 w-4" />
                Build the habit one commit at a time
              </div>

              <div className="space-y-5">
                <h1 className="max-w-3xl text-4xl font-extrabold leading-tight md:text-5xl lg:text-7xl">
                  Code every day with a community that keeps you moving.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-gray-600">
                  CodeStreak helps developers stay consistent, protect their streaks,
                  and turn small daily commits into a lasting practice.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="#ready" className="inline-flex">
                  <Button size="lg" className="w-full sm:w-auto">
                    <FaGripfire />
                    Get Started
                  </Button>
                </Link>

                <Link href="https://discord.gg/aFNtEHSy76" className="inline-flex">
                  <Button
                    size="lg"
                    className="w-full bg-[#5865F2] px-6 py-3 text-white shadow-lg hover:bg-[#4752C4] sm:w-auto"
                  >
                    <BsDiscord />
                    Join Discord
                  </Button>
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-lg border border-gray-200 bg-white px-4 py-4 shadow-sm">
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="mt-2 text-2xl font-bold">{stat.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="grid gap-4"
            >
              <div className="relative min-h-[380px] overflow-hidden rounded-lg bg-[#111827] p-6 text-white shadow-2xl">
                <div className="absolute inset-0">
                  <Image
                    src="/CodeStreak-Logo.png"
                    alt="CodeStreak Logo"
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover opacity-20"
                    priority
                  />
                </div>

                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-wide text-gray-300">Daily rhythm</p>
                      <p className="mt-2 text-3xl font-bold">Keep the streak alive</p>
                    </div>
                    <div className="rounded-md bg-white/10 px-3 py-2 text-sm font-medium text-white">
                      Dashboard ready
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                      <p className="text-sm text-gray-300">Focus</p>
                      <p className="mt-2 text-xl font-semibold">Small commits compound fast.</p>
                    </div>
                    <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                      <p className="text-sm text-gray-300">Community</p>
                      <p className="mt-2 text-xl font-semibold">Show your work and keep rolling.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-indigo-600" />
                    <p className="font-semibold">Developer-first community</p>
                  </div>
                  <p className="mt-3 text-gray-600">
                    Stay close to people building the same habit in public.
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <ArrowRight className="h-5 w-5 text-indigo-600" />
                    <p className="font-semibold">Fast next step</p>
                  </div>
                  <p className="mt-3 text-gray-600">
                    Sign in, join the Discord, and make today&apos;s commit count.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
                Why developers stay
              </p>
              <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
                A better system for staying consistent.
              </h2>
            </div>
            <p className="max-w-xl text-lg leading-8 text-gray-600">
              The goal is not perfection. It&apos;s momentum you can feel, measure, and keep.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {highlights.map((item, index) => {
              const Icon = item.icon

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.12, duration: 0.5 }}
                  className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-4 text-lg leading-8 text-gray-600">{item.body}</p>
                </motion.div>
              )
            })}
          </div>
        </Container>
      </section>

      <section className="border-y border-black/5 bg-gray-50 py-20">
        <Container>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
                Member voices
              </p>
              <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
                Real momentum, not just motivation.
              </h2>
            </div>
            <p className="max-w-xl text-lg leading-8 text-gray-600">
              Developers stick around because steady progress feels better with other people in it.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.14, duration: 0.5 }}
              >
                <TestimonialCard {...t} />
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="grid gap-10 lg:grid-cols-[280px_1fr] lg:items-center"
          >
            <div className="mx-auto w-full max-w-[280px] overflow-hidden rounded-lg bg-gray-100 shadow-lg">
              <Image
                src="/IMG_5601.jpg"
                alt="Kevin Townson"
                width={560}
                height={720}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
                  Founder
                </p>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
                  Built by a developer who wanted consistency to feel social.
                </h2>
              </div>

              <p className="text-lg leading-8 text-gray-700">
                <strong>Kevin Townson</strong> created CodeStreak to help developers build
                stronger habits through visible daily progress, shared momentum, and a community that
                makes it easier to keep going.
              </p>

              <p className="text-lg leading-8 text-gray-700">
                With deep experience in React, Next.js, and modern tooling, he built the club around
                one simple idea: meaningful growth comes from showing up often enough for the work to
                become part of your rhythm.
              </p>
            </div>
          </motion.div>
        </Container>
      </section>

      <Footer />
    </main>
  )
}
