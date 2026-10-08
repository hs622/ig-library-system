"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

interface AnnouncementCardProps {
  thumbnailSrc: string
  thumbnailAlt: string
  title: string
  description: string,
  link: string
}

export default function AnnouncementCard({
  thumbnailSrc,
  thumbnailAlt,
  title,
  description,
  link,
}: AnnouncementCardProps) {
  return (
    <Card className="mx-auto w-full max-w-sm overflow-hidden pt-0">
      <div className="relative h-48 w-full">
        <Image
          src={thumbnailSrc}
          alt={thumbnailAlt}
          fill
          sizes="(max-width: 640px) 100vw, 384px"
          className="object-cover"
        />
      </div>

      <CardHeader>
        <CardAction>
          <Badge variant="secondary">Featured</Badge>
        </CardAction>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="truncate ">{description}</CardDescription>
      </CardHeader>

      <CardFooter>
        <Button className="w-full" asChild>
          <Link href={link}>
            View Event
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}