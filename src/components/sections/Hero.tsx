import { TrendingUp, Shield, Target, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center overflow-hidden bg-[#080808] grain">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[700px] h-[700px] bg-[#FF5C00] opacity-[0.04] rounded-full blur-[160px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#FF5C00] opacity-[0.025] rounded-full blur-[100px]" />
        {/* Vertical grid lines */}
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "100px 100px"
        }} />
      </div>

      {/* Ticker tape */}
      <div className="absolute top-20 left-0 right-0 border-y border-[#1F1F1F] bg-[#0C0C0C] py-2.5 overflow-hidden z-10">
        <div className="animate-ticker inline-flex gap-12 text-xs font-bold tracking-[0.2em] uppercase text-[#2A2A2A] whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, j) => (
            <span key={j} className="inline-flex gap-12">
              {["Value Bets", "⚡ Win Rate 68.4%", "Bankroll Management", "⚡ +94 Unités", "Discipline", "⚡ 247 Pronostics", "Transparence totale", "⚡ ROI +11.2%", "Football Premium"].map(t => (
                <span key={t}>{t}</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 lg:px-10 pt-36 pb-20">
        <div className="max-w-5xl">
          {/* Badge */}
          <div className="animate-fade-up flex items-center gap-3 mb-8">
            <div className="relative flex items-center gap-2 bg-[#FF5C00]/8 border border-[#FF5C00]/20 text-[#FF5C00] text-xs font-bold tracking-[0.2em] uppercase px-4 py-2 rounded">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5C00] opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF5C00]" />
              </span>
              Saison 2024/25 — Canal VIP Actif
            </div>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up delay-100 font-display uppercase leading-[0.88] text-white mb-8"
            style={{fontFamily:"'Bebas Neue',Impact,sans-serif", fontSize:"clamp(5rem, 12vw, 11rem)"}}>
            La méthode<br />
            qui <span className="text-orange">performe</span><br />
            sur la durée
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-up delay-200 text-[#6B6B6B] text-xl leading-relaxed max-w-xl mb-10">
            Value bets, gestion de bankroll et discipline. PrognoBeast, c&apos;est le seul système de pronostics conçu pour{" "}
            <span className="text-white font-semibold">gagner sur le long terme.</span>
          </p>

          {/* CTAs */}
          <div className="animate-fade-up delay-300 flex flex-wrap gap-4 mb-16">
            <a href="https://t.me/PrognoBeast" target="_blank" rel="noopener noreferrer"
              className="btn-shimmer text-white text-sm font-bold tracking-[0.15em] uppercase px-8 py-4 rounded flex items-center gap-2.5 hover:scale-105 transition-transform active:scale-95">
              Rejoindre le VIP <ArrowRight size={16} />
            </a>
            <a href="/results"
              className="border border-[#2A2A2A] text-white text-sm font-bold tracking-[0.15em] uppercase px-8 py-4 rounded flex items-center gap-2.5 hover:border-[#FF5C00] hover:text-[#FF5C00] transition-all">
              Voir les résultats <ArrowRight size={16} />
            </a>
          </div>

          {/* Trust metrics */}
          <div className="animate-fade-up delay-400 flex flex-wrap gap-8 pt-8 border-t border-[#1F1F1F]">
            {[
              { icon: TrendingUp, label: "+94 unités gagnées", sub: "depuis le lancement" },
              { icon: Target,     label: "68.4% win rate",    sub: "sur 247 pronostics" },
              { icon: Shield,     label: "Transparence totale", sub: "tous résultats publiés" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#FF5C00]/10 border border-[#FF5C00]/20 rounded flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-[#FF5C00]" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{label}</p>
                  <p className="text-[#444] text-xs">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#FF5C00]/40 to-transparent" />
    </section>
  );
}
