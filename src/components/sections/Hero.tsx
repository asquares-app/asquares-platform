"use client";

import { Info, Play } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { SectionBadge } from "@/components/ui/SectionBadge";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { stats } from "@/lib/content";

export function Hero() {
  return (
    <section id="home" className="relative grid-bg pt-28 pb-16 lg:pt-32 lg:pb-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{ backgroundPosition: ["0px 0px", "56px 56px"] }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,23,42,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.03) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 text-center lg:px-8">
        <ScrollReveal>
          <SectionBadge icon={<Info className="h-4 w-4" />} variant="blue" className="mb-6">
            Innovative Products for the Modern World
          </SectionBadge>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h1 className="mx-auto max-w-3xl text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            We Build Products{" "}
            <span className="text-primary">That Shape Tomorrow</span>
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            From augmented reality dining experiences to AI-powered real estate agents and viral social
            apps — AsquareS is crafting the next generation of digital products.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="#products" variant="primary" showArrow>
              Explore Products
            </Button>
            <Button href="#products" variant="secondary" icon={<Play className="h-4 w-4" />}>
              Watch Demo
            </Button>
          </div>
        </ScrollReveal>

        <StaggerContainer className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <motion.div
                whileHover={{ y: -4, boxShadow: "0 16px 32px rgba(15,23,42,0.08)" }}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
              >
                <p className="text-2xl font-bold text-slate-900">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-sm text-muted">{stat.label}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
