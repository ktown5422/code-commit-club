'use client'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../styleguide/components/ui/card";
import { Button } from "../styleguide/components/ui/button";
import Image from "next/image";
import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section className="text-black py-20">
        <Navbar />
        <Container className="py-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl text-black font-extrabold leading-tight">
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
            />
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container className="py-20 text-center">
          <h2 className="text-3xl font-bold">Why Commit Daily?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Accountability</CardTitle>
                <CardDescription>
                  Join peers, track streaks, and keep each other motivated.
                </CardDescription>
              </CardHeader>
              <CardContent>
                Share your progress on Discord and never code alone.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Insights</CardTitle>
                <CardDescription>
                  Visualize your commit history and productivity trends.
                </CardDescription>
              </CardHeader>
              <CardContent>
                Weekly reports show your busiest days and your most active repos.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Rewards</CardTitle>
                <CardDescription>
                  Earn badges for streak milestones and unlock surprise perks.
                </CardDescription>
              </CardHeader>
              <CardContent>
                Celebrate consistency with custom badges and shout-outs.
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      <section className="bg-gray-100 py-20">
        <Container className="py-20 text-center">
          <h3 className="text-2xl font-semibold">
            Ready to build the habit?
          </h3>
          <Button size="lg" variant="default">
            Login
          </Button>
        </Container>
      </section>
    </main>
  );
}

