"use client"
import { motion } from "framer-motion"

import { Hero } from "@/components/ui/animated-hero"
import { BGPattern } from "@/components/bg-pattern"
import FeatureSection from "@/components/stack-feature-section"
import { Features } from "@/components/features-2"
import { LogoCloud } from "@/components/logo-cloud-3"
import { HeroScroll } from "@/components/hero-scroll"
import { cn } from "@/lib/utils"
import { Footer } from "@/components/footer-section"

const logos = [
  { src: "https://svgl.app/library/nvidia-wordmark-light.svg", alt: "Nvidia Logo" },
  { src: "https://svgl.app/library/supabase_wordmark_light.svg", alt: "Supabase Logo" },
  { src: "https://svgl.app/library/openai_wordmark_light.svg", alt: "OpenAI Logo" },
  { src: "https://svgl.app/library/turso-wordmark-light.svg", alt: "Turso Logo" },
  { src: "https://svgl.app/library/vercel_wordmark.svg", alt: "Vercel Logo" },
  { src: "https://svgl.app/library/github_wordmark_light.svg", alt: "GitHub Logo" },
  { src: "https://svgl.app/library/claude-ai-wordmark-icon_light.svg", alt: "Claude AI Logo" },
  { src: "https://svgl.app/library/clerk-wordmark-light.svg", alt: "Clerk Logo" },
]

const Page = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <BGPattern
        variant="grid"
        mask="fade-edges"
        fill="rgba(255,255,255,0.06)"
        size={32}
      />

      {/* Main hero */}
      <Hero />
<div id="documentation">

      {/* Scroll animation hero */}
      <HeroScroll />

      {/* Orbit / stack feature */}
      <FeatureSection />

      {/* Feature cards */}
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{
    duration: 0.6,
    ease: "easeOut",
  }}
  viewport={{ once: true, amount: 0.2 }}
>
  <Features />
</motion.div>

      {/* Logo cloud section */}
      <div className="min-h-screen w-full place-content-center -mt-60">
        <div
          aria-hidden="true"
          className={cn(
            "-z-10 -top-1/2 -translate-x-1/2 pointer-events-none absolute left-1/2 h-[120vmin] w-[120vmin] rounded-b-full",
            "bg-[radial-gradient(ellipse_at_center,--theme(--color-foreground/.1),transparent_50%)]",
            "blur-[30px]"
          )}
        />

        <section className="relative mx-auto max-w-7xl">
          <h2 className="mb-5 text-center font-medium text-foreground text-xl tracking-tight md:text-5xl">
            <span className="text-muted-foreground">Trusted by experts.</span>
            <br />
            <span className="font-semibold">Used by the leaders.</span>
          </h2>

          <div className="mx-auto my-5 h-px max-w-sm bg-border [mask-image:linear-gradient(to_right,transparent,black,transparent)]" />

          <LogoCloud logos={logos} />

          <div className="mt-5 h-px bg-border [mask-image:linear-gradient(to_right,transparent,black,transparent)]" />
        </section>
      </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  )
}

export default Page
