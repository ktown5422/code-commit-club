"use client"

import Image from "next/image"
import { Card, CardContent } from "../styleguide/components/ui/card"

export interface Testimonial {
  quote: string
  name: string
  role?: string
  avatar: string
}

export default function TestimonialCard({
  quote,
  name,
  role,
  avatar,
}: Testimonial) {
  return (
    <Card className="h-full p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
      <CardContent className="flex flex-col h-full">
        <blockquote className="grow text-gray-700 italic">“{quote}”</blockquote>
        <div className="mt-6 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <Image
              src={avatar}
              alt={`${name} avatar`}
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-semibold">{name}</p>
            {role && <p className="text-sm text-gray-500">{role}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
