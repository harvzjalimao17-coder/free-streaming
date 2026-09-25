"use client"

import { useState } from "react"
import Image from "next/image"
import { PosterArt } from "@/components/poster-art"
import { cn } from "@/lib/utils"

interface PosterImageProps {
  src: string
  alt: string
  gradient: string
  className?: string
  sizes?: string
  preload?: boolean
}

/**
 * Renders generated demo poster/backdrop art with the CSS gradient
 * placeholder underneath as a loading backdrop, and as a full fallback
 * if the image ever fails to load — so a missing/broken file never
 * produces an empty or broken-looking layout.
 */
export function PosterImage({ src, alt, gradient, className, sizes, preload }: PosterImageProps) {
  const [errored, setErrored] = useState(false)

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <PosterArt gradient={gradient} className="absolute inset-0" showLabel={false} />
      {errored ? null : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes ?? "(min-width: 640px) 176px, 144px"}
          preload={preload}
          className="object-cover"
          onError={() => setErrored(true)}
        />
      )}
    </div>
  )
}
