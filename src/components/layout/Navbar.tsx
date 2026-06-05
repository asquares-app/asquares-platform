"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { LogoTransition } from "@/components/ui/LogoTransition";
import { useActiveSection } from "@/hooks/useActiveSection";
import { navLinks } from "@/lib/content";
import { scrollToSection } from "@/lib/scroll";

export function Navbar() {
  const activeSection = useActiveSection();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    scrollToSection(href);
    setMobileOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-100 bg-white/90 shadow-sm backdrop-blur-lg"
          : "border-b border-transparent bg-white/70 backdrop-blur-md"
      }`}
    >
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <button
          type="button"
          aria-label="AsquareS home"
          onClick={() => handleNavClick("#home")}
          className="relative z-10 flex shrink-0 items-center transition-opacity hover:opacity-80"
        >
          <LogoTransition priority />
        </button>

        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const id = link.href.replace("#", "");
            const isActive = activeSection === id;
            return (
              <li key={link.href}>
                <button
                  type="button"
                  onClick={() => handleNavClick(link.href)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-100 text-primary"
                      : "text-slate-600 hover:bg-blue-50 hover:text-primary"
                  }`}
                >
                  {link.label}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="relative z-10 hidden shrink-0 md:block">
          <Button href="#contact" variant="primary">
            Get Started
          </Button>
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="relative z-10 shrink-0 rounded-lg p-2 text-slate-700 md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-blue-100/60 bg-white/95 px-6 py-4 backdrop-blur-lg md:hidden">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const id = link.href.replace("#", "");
              const isActive = activeSection === id;
              return (
                <li key={link.href}>
                  <button
                    type="button"
                    onClick={() => handleNavClick(link.href)}
                    className={`w-full rounded-lg px-4 py-3 text-left text-sm font-medium ${
                      isActive ? "bg-blue-100 text-primary" : "text-slate-600"
                    }`}
                  >
                    {link.label}
                  </button>
                </li>
              );
            })}
            <li className="pt-2">
              <Button href="#contact" variant="primary" className="w-full">
                Get Started
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
