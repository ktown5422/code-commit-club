'use client'
import { Button } from "../styleguide/components/ui/button"
import Image from "next/image"
import Container from "@/components/Container"
import Navbar from "@/components/Navbar"
import Link from "next/link"
import { FeatureCard } from "../components/FeatureCard"
import Footer from "@/components/Footer"
import { motion } from "framer-motion"
import { BsDiscord } from "react-icons/bs"
import { FaGripfire } from "react-icons/fa"
import TestimonialCard from "@/components/testimonialsCard"
import { testimonials } from "@/lib/testimonialsData"

export default function HomePage() {
  return (
    <main>
      <section className="text-black py-10">
        <Navbar />

        <Container className="py-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="font-extrabold text-3xl md:text-4xl lg:text-5xl leading-tight">
              Code Commit Club
            </h1>
            <p className="text-lg opacity-90">
              Turning daily commits into developer habits.
            </p>

            <Link href="#ready">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="inline-flex mr-1"
              >
                <Button size="lg" variant="default">
                  <FaGripfire />
                  Get Started
                </Button>
              </motion.div>
            </Link>

            <Link
              href="https://discord.gg/aFNtEHSy76"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="inline-flex"
              >
                <Button size="lg" className=" bg-[#5865F2] hover:bg-[#4752C4] text-white px-6 py-3 rounded-lg shadow-lg">
                  <BsDiscord />
                  Join Discord
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative inline-block rounded-2xl"
          >
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 blur-lg opacity-30"></div>

            <Image
              width={550}
              height={550}
              alt="Code Commit Club Logo"
              src="/Code-Commit-Club-Logo.png"
              className="relative block rounded-2xl shadow-2xl object-cover"
            />
          </motion.div>
        </Container>
      </section >


      < section >
        <Container className="pb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Commit Daily?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              {
                title: "Accountability",
                desc1: "Join peers, track streaks, and keep each other motivated.",
                desc2: "Share your progress on Discord and never code alone.",
              },
              {
                title: "Insights",
                desc1: "Visualize your commit history and productivity trends.",
                desc2: "Weekly reports show your busiest days and your most active repos.",
              },
              {
                title: "Rewards",
                desc1: "Earn badges for streak milestones and unlock surprise perks.",
                desc2: "Celebrate consistency with custom badges and shout-outs.",
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.2 * i, duration: 0.6 }}
              >
                <FeatureCard
                  title={f.title}
                  description={f.desc1}
                  descriptionTwo={f.desc2}
                />
              </motion.div>
            ))}
          </div>
        </Container>
      </section >

      <section className="py-20 bg-gray-50">
        <Container>
          <h2 className="text-3xl font-bold text-center mb-12">
            What our members say
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
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
            className="max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">

              <div className="flex justify-center md:justify-start">
                <div className="w-48 h-48 rounded-full overflow-hidden shadow-lg border-4 border-white">
                  <Image
                    src="/IMG_5601.jpg"
                    alt="Kevin Townson"
                    width={192}
                    height={192}
                    className="object-cover"
                  />
                </div>
              </div>


              <div className="md:col-span-2 space-y-6">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  About the Founder
                </h2>

                <div className="w-16 h-1 bg-indigo-500 rounded-full"></div>

                <p className="text-lg text-gray-700 leading-relaxed">
                  <strong>Kevin Townson</strong> is a seasoned Software Engineer and the driving force behind Code Commit Club. Based in Houston, Texas, Kevin was inspired to create this platform to help developers track their consistency and build a supportive community through daily GitHub commits.
                </p>

                <p className="text-lg text-gray-700 leading-relaxed">
                  With deep expertise in React, Next.js, and modern web tooling, he’s passionate about making coding habits stick and helping developers showcase their growth, <strong>one commit at a time</strong>.
                </p>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>
      <Footer />
    </main >
  )
}
