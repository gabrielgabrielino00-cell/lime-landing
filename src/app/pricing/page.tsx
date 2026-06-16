import Link from "next/link";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

export default function PricingPage() {
  return (
    <>
      <header className="border-b border-bg-elevated px-4 py-4 md:px-8">
        <Link href="/" className="font-display text-lg font-bold text-accent">
          LimeForge
        </Link>
      </header>
      <main>
        <Pricing />
      </main>
      <Footer />
    </>
  );
}