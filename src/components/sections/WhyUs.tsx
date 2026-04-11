// components/sections/WhyUs.tsx
import SectionTitle from "@/components/ui/SectionTitle";
import CTAButton from "@/components/ui/CTAButton";
import { X, Check } from "lucide-react";

const comparison = [
  {
    bad: "Tips random sans analyse",
    good: "Chaque tip justifié et documenté",
  },
  {
    bad: "10+ paris par jour, volume > qualité",
    good: "3 à 6 tips par semaine, sélectifs",
  },
  {
    bad: "Résultats cachés ou manipulés",
    good: "100% des résultats publiés publiquement",
  },
  {
    bad: "Mise unique sans gestion de risque",
    good: "Système d'unités et bankroll structuré",
  },
  {
    bad: "Résultats \"miraculeux\" non vérifiables",
    good: "Bilan transparent depuis le 1er jour",
  },
  {
    bad: "Support inexistant",
    good: "Communauté active et support réactif",
  },
];

export default function WhyUs() {
  return (
    <section
      className="bg-[#0c0c0c] border-y border-[#1a1a1a]"
      style={{ paddingTop: "6rem", paddingBottom: "6rem" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            <SectionTitle
              label="Pourquoi PrognoBeast"
              title="La différence"
              accent="différence"
              subtitle="Le marché des pronostics est pollué par des imposteurs. PrognoBeast a été construit sur un seul principe : la rigueur."
            />

            <div className="flex flex-col gap-3 mt-8">
              {comparison.map((item, i) => (
                <div
                  key={i}
                  className="grid grid-cols-2 gap-3"
                >
                  {/* Bad */}
                  <div className="flex items-start gap-2.5 bg-[#C41E3A]/5 border border-[#C41E3A]/10 rounded-sm px-4 py-3">
                    <X size={13} className="text-[#C41E3A] shrink-0 mt-0.5" strokeWidth={2.5} />
                    <p className="text-[#666] text-xs leading-relaxed">{item.bad}</p>
                  </div>
                  {/* Good */}
                  <div className="flex items-start gap-2.5 bg-emerald-500/5 border border-emerald-500/10 rounded-sm px-4 py-3">
                    <Check size={13} className="text-emerald-400 shrink-0 mt-0.5" strokeWidth={2.5} />
                    <p className="text-[#aaa] text-xs leading-relaxed">{item.good}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <CTAButton
                href="/about"
                label="Notre philosophie"
                variant="secondary"
                size="md"
              />
            </div>
          </div>

          {/* Right: big statement card */}
          <div className="relative">
            <div className="absolute inset-0 bg-[#C41E3A] opacity-5 blur-[80px] rounded-full" />
            <div className="relative glass-card border border-[#C41E3A]/20 rounded-sm p-10 red-glow">
              <div className="mb-8">
                <span className="text-[#C9A84C] text-xs font-bold tracking-[0.2em] uppercase">
                  Notre engagement
                </span>
              </div>

              <blockquote
                className="font-display text-5xl md:text-6xl text-white uppercase leading-tight mb-8"
                style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', Impact, sans-serif)" }}
              >
                &ldquo;Pas un seul tip publié sans <span className="text-gradient-red">conviction</span> réelle.&rdquo;
              </blockquote>

              <p className="text-[#666] text-sm leading-relaxed mb-8">
                On ne publie pas pour remplir un quota. On ne publie pas pour paraître actif.
                Si l&apos;analyse ne valide pas la value, il n&apos;y a pas de tip.
                C&apos;est aussi simple que ça.
              </p>

              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[#1a1a1a]">
                {[
                  { value: "247", label: "Tips publiés" },
                  { value: "14", label: "Mois de suivi" },
                  { value: "0", label: "Résultats cachés" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p
                      className="font-display text-3xl text-[#C41E3A]"
                      style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', Impact, sans-serif)" }}
                    >
                      {stat.value}
                    </p>
                    <p className="text-[#555] text-xs mt-1">{stat.label}</p>
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
