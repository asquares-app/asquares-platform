"use client";

import { Brain, Building2, Lightbulb, MessageCircle, Rocket, Users } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SectionBadge } from "@/components/ui/SectionBadge";

const tags = [
  { icon: Building2, label: "AR Technology" },
  { icon: Brain, label: "AI Agents" },
  { icon: MessageCircle, label: "Social Apps" },
];

const bentoCards = [
  {
    icon: Lightbulb,
    title: "Innovation First",
    description: "Pushing boundaries with cutting-edge tech",
    className: "bg-white",
    iconBg: "bg-blue-100 text-primary",
  },
  {
    title: "2024",
    subtitle: "Founded",
    className: "bg-primary text-white",
    featured: true,
  },
  {
    icon: Users,
    title: "User Centric",
    description: "Designed for real people, real needs.",
    className: "bg-white",
    iconBg: "bg-pink-100 text-pink-600",
  },
  {
    icon: Rocket,
    title: "Fast Shipping",
    description: "From idea to launch at speed.",
    className: "bg-white",
    iconBg: "bg-blue-100 text-primary",
  },
];

export function About() {
  return (
    <div className="border-t border-slate-100 bg-white py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <ScrollReveal direction="left">
          <SectionBadge icon={<Building2 className="h-4 w-4" />} variant="blue">
            About Us
          </SectionBadge>
          <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            AsquareS is Building <span className="text-primary">Bold Ideas</span>
          </h2>
          <p className="mt-6 leading-relaxed text-muted">
            AsquareS is a product studio at the intersection of technology and human experience. We
            design, develop, and deploy innovative solutions that challenge how people interact with
            the world around them.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            Our diverse portfolio spans augmented reality, artificial intelligence, and social
            platforms — unified by a commitment to beautiful design and seamless user experience.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {tags.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm"
              >
                <Icon className="h-4 w-4 text-primary" />
                {label}
              </span>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right">
          <div className="grid grid-cols-2 gap-4">
            {bentoCards.map((card) => (
              <motion.div
                key={card.title}
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
                className={`rounded-2xl p-6 shadow-sm transition-shadow ${card.className} ${
                  card.featured ? "flex flex-col justify-center" : ""
                } ${card.featured ? "row-span-1 min-h-[140px]" : "min-h-[160px]"}`}
              >
                {card.featured ? (
                  <>
                    <p className="text-4xl font-bold">{card.title}</p>
                    <p className="mt-1 text-sm font-medium opacity-90">{card.subtitle}</p>
                  </>
                ) : (
                  <>
                    {card.icon && (
                      <div
                        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg}`}
                      >
                        <card.icon className="h-5 w-5" />
                      </div>
                    )}
                    <p className="font-bold text-slate-900">{card.title}</p>
                    <p className="mt-1 text-sm text-muted">{card.description}</p>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
