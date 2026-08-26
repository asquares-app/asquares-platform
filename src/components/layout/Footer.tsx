import { Logo } from "@/components/ui/Logo";
import { footerNav, footerProducts } from "@/lib/content";

export function Footer() {
  return (
    <footer className="bg-footer-bg text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <Logo variant="light" className="h-8 w-auto" />
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Building the next generation of digital products — from AR dining to AI real estate
              agents and social platforms.
            </p>
            <p className="mt-2 text-sm text-slate-500">AsquareS.app</p>
            <a
              href="mailto:hello@asquares.app"
              className="mt-6 inline-flex text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              hello@asquares.app
            </a>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Navigation</h3>
            <ul className="space-y-3">
              {footerNav.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-slate-400 transition-colors hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Products</h3>
            <ul className="space-y-3">
              {footerProducts.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-slate-400 transition-colors hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-slate-500 sm:flex-row">
          <p>© 2026 AsquareS. All rights reserved. · AsquareS.app</p>
          <a href="mailto:hello@asquares.app" className="transition-colors hover:text-white">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
