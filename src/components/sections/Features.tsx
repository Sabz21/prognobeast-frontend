// components/sections/Features.tsx
import SectionTitle from "@/components/ui/SectionTitle";
import { BarChart2, Brain, Shield, Clock } from "lucide-react";

const features = [
  {
    icon: BarChart2,
    title: "Value Bets Identifiés",
    description:
      "Nous ne parions pas sur des intuitions. Chaque pronostic repose sur une analyse de la cote du marché et d'une edge quantifiable. Seules les vraies value bets passent.",
    accent: "red" as const,
  },
  {
    icon: Brain,
    title: "Analyses Approfondies",
    description:
      "Forme récente, statistiques avancées, composition d'équipe, contexte de match, cotes de marché — chaque tip est documenté et justifié avant publication.",
    accent: "red" as const,
  },
  {
    icon: Shield,
    title: "Gestion de Bankroll",
    description:
      "La clé de la rentabilité sur le long terme. Chaque tip est accompagné d'un nombre d'unités recommandées selon notre système de mise structuré.",
    accent: "gold" as const,
  },
  {
    icon: Clock,
    title: "Suivi de Performance",
    description:
      "Tous nos résultats sont publiés publiquement, en temps réel. Win ou loss, tout est tracké. La transparence est notre engagement numéro un.",
    accent: "gold" as const,
  },
];

export default function Features() {
  return (
    <section className="section-padding bg-[#0A0A0A] border-y border-[#1a1a1a]" style={{ paddingTop: "6rem", paddingBottom: "6rem" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionTitle
          label="Notre approche"
          title="Pas de bla-bla."
          accent="bla-bla."
          subtitle="PrognoBeast repose sur quatre piliers qui font toute la différence entre perdre ses mises et construire un capital."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          {features.map((f, i) => {
            const Icon = f.icon;
            const borderColor = f.accent === "red"
              ? "border-[#C41E3A]/15 hover:border-[#C41E3A]/40"
              : "border-[#C9A84C]/15 hover:border-[#C9A84C]/40";
            const iconColor = f.accent === "red" ? "text-[#C41E3A]" : "text-[#C9A84C]";
            const bgColor = f.accent === "red" ? "bg-[#C41E3A]/8" : "bg-[#C9A84C]/8";

            return (
              <div
                key={f.title}
                className={`
                  glass-card rounded-sm p-7 border ${borderColor}
                  flex flex-col gap-5 transition-all duration-300 hover:-translate-y-1
                `}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`w-11 h-11 ${bgColor} rounded-sm flex items-center justify-center`}>
                  <Icon size={20} className={iconColor} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base mb-2">{f.title}</h3>
                  <p className="text-[#666] text-sm leading-relaxed">{f.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
