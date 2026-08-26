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
  { value: 1, suffix: "", label: "Live demo" },
  { value: 24, suffix: "/7", label: "Lead capture" },
] as const;

export const faqItems = [
  {
    question: "How long does it take to get set up with AR 3D Menu?",
    answer:
      "Most restaurants can go live within a few days once menu photos and branding are ready. We help with onboarding so your team is not blocked.",
  },
  {
    question: "Can I try REagent before committing?",
    answer:
      "Yes. We run a live demo for dealers — a Web Call, lead score, and dashboard walkthrough — before any paid pilot. WhatsApp alerts and dedicated phone numbers come after you sign.",
  },
  {
    question: "Is Spill the Tea available on iOS and Android?",
    answer:
      "Spill the Tea is designed for both iOS and Android. Availability and invite waves depend on the current beta stage.",
  },
  {
    question: "Do you offer custom enterprise plans?",
    answer:
      "Yes. For teams that need custom workflows, SLAs, or multi-location setups, we tailor a plan after the pilot conversation.",
  },
  {
    question: "How quickly does your team respond to inquiries?",
    answer:
      "We aim to respond within one business day. For active demos and pilots, we stay available on the shared contact channel.",
  },
] as const;

export const testimonials = [
  {
    quote:
      "Dealers miss buyer calls all day. REagent’s pitch is simple: catch the enquiry, score it, and call back the hot ones first.",
    name: "REagent",
    title: "Product focus · AsquareS",
    avatar: "/images/avatar-sarah.jpg",
  },
  {
    quote:
      "AR menus help diners decide faster. Our focus is practical restaurant onboarding — not vanity metrics.",
    name: "AR 3D Menu",
    title: "Product focus · AsquareS",
    avatar: "/images/avatar-marco.jpg",
  },
  {
    quote:
      "Spill the Tea is our social bet: real conversations, safer spaces, and communities built around shared interests.",
    name: "Spill the Tea",
    title: "Product focus · AsquareS",
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
  { label: "REagent", href: "/apps" },
  { label: "Spill the Tea", href: "#products" },
] as const;

export const founders = [
  "/images/founder-1.jpg",
  "/images/founder-2.jpg",
  "/images/founder-3.jpg",
  "/images/founder-4.jpg",
] as const;
