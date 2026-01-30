"use client"

import React from "react"
import { ContainerScroll } from "@/components/ui/container-scroll-animation"
import Image from "next/image"

export function HeroScroll() {
  return (
    <div className="flex flex-col overflow-hidden -py-60">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-foreground">
              Build powerful workflows with
              <br />
              <span className="mt-2 block text-4xl md:text-[5rem] font-bold leading-none">
                AI & Automation
              </span>
            </h1>
          </>
        }
      >
        <Image
          src="/chatgpt.png" // ← ideally your app UI
          alt="Workflow builder preview"
          height={720}
          width={1400}
          className="mx-auto h-full rounded-2xl object-cover"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  )
}
