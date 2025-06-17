
'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Card className="max-w-md w-full p-6 shadow-lg">
        <CardContent className="flex flex-col items-center space-y-4">
          <Image
            src="/Code-Commit-Club-Logo.png"
            alt="Code Commit Club Logo"
            width={100}
            height={100}
            className="mb-4"
          />
          <h1 className="text-3xl font-bold">Code Commit Club</h1>
          <p className="text-center text-gray-600">
            Turning daily commits into developer habits.
          </p>
          <Button variant="default" size="lg" onClick={() => {/* link to join */ }}>
            Join the Club
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
