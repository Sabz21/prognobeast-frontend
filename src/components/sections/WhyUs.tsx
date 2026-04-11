import SectionTitle from "@/components/ui/SectionTitle";
import CTAButton from "@/components/ui/CTAButton";
import { X, Check } from "lucide-react";

const comparison = [
  { bad: "Tips random sans analyse",          good: "Chaque tip justifié et documenté" },
  { bad: "10+ paris par jour sans sélection", good: "3 à 6 tips par semaine, sélectifs" },
  { bad: "Résultats cachés ou manipulés",     good: "100% des résultats publiés publiquement" },
  { bad: "Mise unique sans gestion de risque",good: "Système d'unités et bankroll structuré" },
  { bad: "Performance non vérifiable",        good: "Bilan transparent depuis le 1er jour" },
  { bad: "Support inexistant",                good: "Communauté active et support réactif" },
];

export default function WhyUs() {
  return (
    <section className="w-full bg-[#0B0B0B] border-y border-[#1F1F1F] py-24">
      <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <SectionTitle label="Pourquoi PrognoBeast" title="La différence" accent="différence" subtitle="Le marché des pronostics est pollué par des imposteurs. PrognoBeast a été construit sur un seul principe : la rigueur." />
            <div className="flex flex-col gap-2.5">
              {comparison.map((item, i) => (
                <div key={i} className="grid grid-cols-2 gap-2">
                  <div className="flex items-start gap-2.5 bg-[#FF5C00]/4 border border-[#FF5C00]/8 rounded px-4 py-3">
                    <X size={12} className="text-[#FF5C00] shrink-0 mt-0.5" strokeWidth={2.5} />
                    <p className="text-[#555] text-xs leading-relaxed">{item.bad}</p>
                  </div>
                  <div className="flex items-start gap-2.5 bg-emerald-500/4 border border-emerald-500/8 rounded px-4 py-3">
                    <Check size={12} className="text-emerald-400 shrink-0 mt-0.5" strokeWidth={2.5} />
                    <p className="text-[#999] text-xs leading-relaxed">{item.good}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <CTAButton href="/about" label="Notre philosophie" variant="secondary" />
            </div>
          </div>

          {/* Right big card */}
          <div className="relative">
            <div className="absolute inset-0 bg-[#FF5C00] opacity-[0.04] blur-[80px] rounded-full" />
            <div className="relative glass border border-[#FF5C00]/20 rounded-lg p-10 glow-orange">
              <span className="text-[#FF5C00] text-xs font-bold tracking-[0.2em] uppercase block mb-6">Notre engagement</span>
              <blockquote className="font-display text-5xl md:text-6xl text-white uppercase leading-tight mb-8"
                style={{fontFamily:"'Bebas Neue',Impact,sans-serif"}}>
                &ldquo;Pas un seul tip publié sans <span className="text-orange">conviction</span> réelle.&rdquo;
              </blockquote>
              <p className="text-[#555] text-sm leading-relaxed mb-8">
                On ne publie pas pour remplir un quota. On ne publie pas pour paraître actif. Si l&apos;analyse ne valide pas la value, il n&apos;y a pas de tip.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[#1F1F1F]">
                {[{v:"247",l:"Tips publiés"},{v:"14",l:"Mois de suivi"},{v:"0",l:"Résultats cachés"}].map(s => (
                  <div key={s.l} className="text-center">
                    <p className="font-display text-3xl text-[#FF5C00]" style={{fontFamily:"'Bebas Neue',Impact,sans-serif"}}>{s.v}</p>
                    <p className="text-[#444] text-xs mt-1">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
