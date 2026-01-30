"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, LogInIcon, MoveRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

function Hero() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [titleNumber, setTitleNumber] = useState(0);

  const titles = useMemo(
    () => ["AI-powered", "event-driven", "automated", "scalable", "developer-first"],
    []
  );

  useEffect(() => {
    router.prefetch("/login");
    router.prefetch("/workflows");
    router.prefetch("/docs");
  }, [router]);

  const handleNavigate = (path: string) => {
    if (isNavigating) return;
    setIsNavigating(true);
    router.push(path);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTitleNumber((prev) =>
        prev === titles.length - 1 ? 0 : prev + 1
      );
    }, 2000);

    return () => clearTimeout(timeout);
  }, [titles.length]);

  return (
    <div className="w-full">
      <div className="container mx-auto">

        {/* TOP BAR */}
        <div className="flex items-center justify-between py-6 mx-10">
          {/* LOGO */}
          <div className="flex flex-row gap-2 items-center">
            <Image
              src="/floww.svg"
              alt="Flowyn Logo"
              width={64}
              height={64}
              className="h-10 w-auto opacity-90"
            />
            <span className="text-3xl font-semibold tracking-tight leading-none">
              Flowyn
            </span>
          </div>

          {/* DOCS BUTTON */}
        <Button
  variant="ghost"
  className="gap-2"
  onClick={() => {
    document
      .getElementById("documentation")
      ?.scrollIntoView({ behavior: "smooth" });
  }}
>
  <BookOpen className="w-4 h-4" />
  Documentation
</Button>
        </div>

        {/* HERO CONTENT */}
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">

          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center">
              <span>This is where modern workflows are built</span>

              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold text-primary"
                    initial={{ opacity: 0, y: "-100" }}
                    animate={
                      titleNumber === index
                        ? { y: 0, opacity: 1 }
                        : { y: titleNumber > index ? -150 : 150, opacity: 0 }
                    }
                    transition={{ type: "spring", stiffness: 50 }}
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground text-center max-w-2xl">
              Design, run, and monitor powerful workflows that connect AI,
              APIs, and messaging platforms — all in one visual canvas.
            </p>
          </div>

          {/* CTA BUTTONS */}
          <div className="flex gap-3">
            <Button
              size="lg"
              variant="outline"
              disabled={isNavigating}
              onClick={() => handleNavigate("/login")}
              className="gap-3"
            >
              {isNavigating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogInIcon className="w-4 h-4" />
              )}
              Sign In
            </Button>

            <Button
              size="lg"
              disabled={isNavigating}
              onClick={() => handleNavigate("/workflows")}
              className="gap-3"
            >
              {isNavigating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <MoveRight className="w-4 h-4" />
              )}
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
