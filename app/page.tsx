'use client'
import { Button } from "../styleguide/components/ui/button";
import Image from "next/image";
import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { FeatureCard } from "../components/FeatureCard"
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <section className="text-black py-10">
        <Navbar />
        <Container className="py-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-nowrap text-black font-extrabold text-3xl md:text-4xl lg:text-5xl leading-tight">
              Code Commit Club
            </h1>
            <p className="text-lg text-black opacity-90">
              Turning daily commits into developer habits.
            </p>
            <div className="flex space-x-4">
              <Link href="/signup">
                <Button size="lg" variant="default">
                  Get Started
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
          <div>
            <Image
              width={550}
              height={550}
              alt="Code Commit Club Logo"
              src="/Code-Commit-Club-Logo.png"
              className="rounded-xl"
            />
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Commit Daily?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            <FeatureCard
              title="Accountability"
              description="Join peers, track streaks, and keep each other motivated."
              descriptionTwo="Share your progress on Discord and never code alone."
            />
            <FeatureCard
              title="Insights"
              description="Visualize your commit history and productivity trends."
              descriptionTwo="Weekly reports show your busiest days and your most active repos."
            />
            <FeatureCard
              title="Rewards"
              description="Earn badges for streak milestones and unlock surprise perks."
              descriptionTwo="Celebrate consistency with custom badges and shout-outs."
            />
          </div>
        </Container>
      </section>
      <Footer />
    </main>
  );
}

