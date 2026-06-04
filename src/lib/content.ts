export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Products", href: "#products" },
  { label: "Contact Us", href: "#contact" },
] as const;

export const sectionIds = ["home", "about", "products", "contact"] as const;

export type SectionId = (typeof sectionIds)[number];

export const stats = [
  { value: 3, suffix: "", label: "Products" },
  { value: 10, suffix: "K+", label: "Users" },
  { value: 99, suffix: "%", label: "Uptime" },
] as const;

export const faqItems = [
  {
    question: "How long does it take to get set up with AR 3D Menu?",
    answer:
      "Most restaurants are live within 48 hours. We handle 3D model creation, menu integration, and staff onboarding so you can start seeing results fast.",
  },
  {
    question: "Can I try the AI Real Estate Agent before committing?",
    answer:
      "Yes. We offer a 14-day free trial with full dashboard access. Our team helps you configure call flows and CRM integration at no extra cost.",
  },
  {
    question: "Is Spill the Tea available on iOS and Android?",
    answer:
      "Spill the Tea is available on both iOS and Android, with a unified experience across platforms. Beta invites roll out weekly.",
  },
  {
    question: "Do you offer custom enterprise plans?",
    answer:
      "Absolutely. We tailor pricing, SLAs, and feature sets for enterprise clients across all three products. Reach out and we'll build a plan that fits.",
  },
  {
    question: "How quickly does your team respond to inquiries?",
    answer:
      "We respond to all inquiries within 24 hours on business days. Priority support is available for active customers and enterprise partners.",
  },
] as const;

export const testimonials = [
  {
    quote:
      "The AR Menu completely changed how our customers order. We saw a 40% increase in upsells in the first month alone. Absolutely game-changing.",
    name: "Marco Rossi",
    title: "Owner, La Bella Cucina",
    avatar: "/images/avatar-marco.jpg",
  },
  {
    quote:
      "The AI call agent handles 80% of our inbound leads automatically. Our agents now focus only on hot prospects. ROI was positive in week two.",
    name: "Sarah Mitchell",
    title: "Director, Apex Realty",
    avatar: "/images/avatar-sarah.jpg",
  },
  {
    quote:
      "Spill the Tea is literally my favorite app right now. It's like Twitter but actually fun and real. The community vibes are unmatched 🍵",
    name: "Aisha Patel",
    title: "Early User, Beta Tester",
    avatar: "/images/avatar-aisha.jpg",
  },
] as const;

export const footerNav = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Products", href: "#products" },
  { label: "Contact Us", href: "#contact" },
] as const;

export const footerProducts = [
  { label: "AR 3D Menu", href: "#products" },
  { label: "Real Estate Agent", href: "#products" },
  { label: "Spill the Tea", href: "#products" },
] as const;

export const founders = [
  "/images/founder-1.jpg",
  "/images/founder-2.jpg",
  "/images/founder-3.jpg",
  "/images/founder-4.jpg",
] as const;
