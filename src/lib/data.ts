export const brand = {
  name: "LimeForge",
  tagline: "AI copilot for Roblox Studio. Prompt → Luau → sync.",
};

export const navLinks = [
  { label: "Product", href: "#product" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Changelog", href: "/changelog" },
];

export const stats = {
  creators: "18,000+",
  generations: "2.4M+",
  models: "5",
};

export const socialBrands = ["Roblox", "Discord", "GitHub", "Studio", "DevForum"];

export const features = [
  {
    icon: "Zap",
    title: "Multi-model AI",
    description:
      "Sonnet, Opus, GPT-4o, Gemini, or local Ollama — switch per task without leaving the editor.",
  },
  {
    icon: "Shield",
    title: "Studio sync",
    description:
      "Generated Luau pushes to your open Roblox place in real time via the LimeForge plugin.",
  },
  {
    icon: "Users",
    title: "Version history",
    description:
      "Every generation is saved with diffs. Roll back a script like Figma, ship like Linear.",
  },
];

export const steps = [
  {
    title: "Describe the feature",
    description: '"Add a daily reward system with DataStore persistence."',
  },
  {
    title: "Pick your model",
    description: "Fast Sonnet for iteration, Opus for complex game systems.",
  },
  {
    title: "Sync to Studio",
    description: "One click — script lands in the right folder in Roblox Studio.",
  },
];

export const testimonials = [
  {
    quote: "Shipped our obby shop UI in one afternoon. Studio sync is magic.",
    name: "Luca M.",
    role: "Roblox dev · 2M visits",
    rating: 5,
  },
  {
    quote: "Version history saved me when Opus overwrote my combat module.",
    name: "Sofia R.",
    role: "Scripter",
    rating: 5,
  },
  {
    quote: "Finally AI that speaks Luau, not generic JS snippets.",
    name: "Jay T.",
    role: "Studio creator",
    rating: 5,
  },
  {
    quote: "Model switcher is exactly what Lemonade does — but for Roblox.",
    name: "Emma K.",
    role: "Indie studio",
    rating: 5,
  },
  {
    quote: "Free tier is enough for hobby projects. Pro pays for itself.",
    name: "Noah P.",
    role: "Game designer",
    rating: 5,
  },
  {
    quote: "Our team shares projects and templates. Huge for jam weekends.",
    name: "Diego A.",
    role: "Team lead",
    rating: 5,
  },
];

export const plans = [
  {
    name: "Free",
    price: 0,
    description: "For hobby creators testing ideas.",
    features: ["50 requests / month", "Claude Sonnet only", "5 projects", "No versioning"],
    cta: "Start free",
    popular: false,
  },
  {
    name: "Pro",
    price: 12,
    description: "For builders shipping every week.",
    features: [
      "Unlimited requests",
      "All AI models + Ollama",
      "Unlimited projects",
      "30-day version history",
      "Studio sync priority",
    ],
    cta: "Get Pro",
    popular: true,
  },
  {
    name: "Team",
    price: 29,
    description: "For studios and collab jams.",
    features: [
      "Everything in Pro",
      "Shared workspace",
      "Unlimited versioning",
      "Admin + invites",
      "API keys",
    ],
    cta: "Get Team",
    popular: false,
  },
];

export const changelog = [
  {
    date: "2026-06-16",
    title: "LimeForge v0.1 — local workspace",
    items: ["3-column app UI", "Model switcher", "Streaming mock AI", "Version timeline"],
  },
  {
    date: "2026-06-10",
    title: "Studio plugin alpha",
    items: ["Push Luau to open place", "File tree mapping", "Sync status indicator"],
  },
];