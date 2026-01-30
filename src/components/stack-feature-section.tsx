"use client";

import Image from "next/image";
import {useRouter} from "next/navigation" ;
import { useEffect } from "react";
import { Button } from "./ui/button";
import { ArrowRight, ListStartIcon } from "lucide-react";
const iconConfigs = [
  { img: "/openai.svg" },
  { img: "/gemini.svg" },
  { img: "/anthropic.svg" },
  { img: "/telegram.png" },
  { img: "/discord.svg" },
  { img: "/slack.svg" },
  { img: "/googleform.svg" },
  { img: "/stripe.svg" },
     { img: "/telegram.png" },
  { img: "/gemini.svg" },
  { img: "/slack.svg" },
  { img: "/anthropic.svg" },
    { img: "/openai.svg" },
    { img: "/stripe.svg" },
  { img: "/telegram.png" },
  { img: "/discord.svg" },
  { img: "/slack.svg" },
  { img: "/googleform.svg" },
  { img: "/stripe.svg" },
];

export default function FeatureSection() {

 const router = useRouter();

  // 🚀 Prefetch workflows for instant navigation
  useEffect(() => {
    router.prefetch("/workflows");
  }, [router]);
  const orbitCount = 3;
  const orbitGap = 11;
  const iconsPerOrbit = Math.ceil(iconConfigs.length / orbitCount);

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Left side */}
      <div className="w-1/2 z-10 pl-10 text-left">
        <h1 className="text-5xl sm:text-6xl font-bold mb-4 text-primary">
          Integrate Apps and Tools with AI
        </h1>
        <p className="text-gray-500 dark:text-gray-300 mb-6 max-w-xl">
          Connect AI models, messaging apps, forms, and payments into a single
          intelligent workflow. Build powerful automations that think, act,
          and adapt — without writing complex code.
        </p>
         {/* CTA */}
        <Button
          size="lg"
          className="px-8"
          onClick={() => router.push("/workflows")}
        >
          Start making workflows
          <ArrowRight className="w-4 h-4" />

        </Button>
      </div>

      {/* Right side: Orbit animation */}
      <div className="relative w-1/2 h-full flex items-center justify-center overflow-hidden">
        <div className="relative w-[50rem] h-[50rem] translate-x-[50%] flex items-center justify-center">

          {/* Center App Logo */}
          <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-900 shadow-xl flex items-center justify-center">
            <Image
              src="/floww.svg"
              alt="App Logo"
              width={48}
              height={48}
            />
          </div>

          {/* Orbits */}
          {[...Array(orbitCount)].map((_, orbitIdx) => {
            const size = `${12 + orbitGap * (orbitIdx + 1)}rem`;
            const angleStep = (2 * Math.PI) / iconsPerOrbit;

            return (
              <div
                key={orbitIdx}
                className="absolute rounded-full border-2 border-dotted border-gray-300 dark:border-gray-600"
                style={{
                  width: size,
                  height: size,
                  animation: `spin ${12 + orbitIdx * 6}s linear infinite`,
                }}
              >
                {iconConfigs
                  .slice(
                    orbitIdx * iconsPerOrbit,
                    orbitIdx * iconsPerOrbit + iconsPerOrbit
                  )
                  .map((cfg, iconIdx) => {
                    const angle = iconIdx * angleStep;
                    const x = 50 + 50 * Math.cos(angle);
                    const y = 50 + 50 * Math.sin(angle);

                    return (
                      <div
                        key={iconIdx}
                        className="absolute bg-white dark:bg-gray-900 rounded-full p-2 shadow-md"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <Image
                          src={cfg.img}
                          alt="node"
                          width={28}
                          height={28}
                        />
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
}
