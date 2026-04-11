import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import RecentResults from "@/components/sections/RecentResults";
import WhyUs from "@/components/sections/WhyUs";
import Testimonials from "@/components/sections/Testimonials";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <RecentResults />
      <WhyUs />
      <Testimonials />
      {/* Final CTA */}
      <section className="w-full bg-[#0B0B0B] border-t border-[#1F1F1F] py-24">
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
          <span className="inline-flex items-center gap-2 text-[#FF5C00] text-xs font-bold tracking-[0.2em] uppercase mb-6">
            <span className="w-4 h-px bg-[#FF5C00]" />Passez au niveau supérieur<span className="w-4 h-px bg-[#FF5C00]" />
          </span>
          <h2 className="font-display text-6xl md:text-8xl text-white uppercase leading-none tracking-wide mb-5"
            style={{fontFamily:"'Bebas Neue',Impact,sans-serif"}}>
            Arrêtez de perdre.<br /><span className="text-orange">Commencez à performer.</span>
          </h2>
          <p className="text-[#555] text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Rejoignez des centaines de membres qui ont changé leur façon d&apos;aborder les paris sportifs.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="https://t.me/PrognoBeast" target="_blank" rel="noopener noreferrer"
              className="btn-shimmer text-white text-sm font-bold tracking-[0.15em] uppercase px-8 py-4 rounded flex items-center gap-2 hover:scale-105 transition-transform">
              Rejoindre le VIP Telegram <ArrowRight size={16} />
            </a>
            <a href="/vip"
              className="border border-[#2A2A2A] text-white text-sm font-bold tracking-[0.15em] uppercase px-8 py-4 rounded flex items-center gap-2 hover:border-[#FF5C00] hover:text-[#FF5C00] transition-all">
              Voir les offres <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
