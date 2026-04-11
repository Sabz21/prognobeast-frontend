import SectionTitle from "@/components/ui/SectionTitle";
import { BarChart2, Brain, Shield, Clock } from "lucide-react";

const features = [
  { icon: BarChart2, title: "Value Bets Identifiés", text: "Chaque pronostic repose sur une analyse de la cote du marché et d'une edge quantifiable. Seules les vraies value bets passent.", n: "01" },
  { icon: Brain,     title: "Analyses Approfondies", text: "Forme récente, stats avancées, composition d'équipe, contexte de match — chaque tip est documenté et justifié avant publication.", n: "02" },
  { icon: Shield,    title: "Gestion de Bankroll", text: "La clé de la rentabilité sur le long terme. Chaque tip est accompagné d'un nombre d'unités selon notre système de mise structuré.", n: "03" },
  { icon: Clock,     title: "Suivi de Performance", text: "Tous nos résultats sont publiés publiquement, en temps réel. Win ou loss, tout est tracké. La transparence est notre engagement n°1.", n: "04" },
];

export default function Features() {
  return (
    <section className="w-full bg-[#080808] border-y border-[#1F1F1F] py-24">
      <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-10">
        <SectionTitle label="Notre approche" title="Pas de bla-bla." accent="bla-bla." subtitle="PrognoBeast repose sur quatre piliers qui font toute la différence entre perdre ses mises et construire un capital." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="group relative glass border border-[#1F1F1F] hover:border-[#FF5C00]/40 rounded-lg p-7 flex flex-col gap-5 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                {/* Big number bg */}
                <span className="absolute top-4 right-4 font-display text-6xl text-[#FF5C00]/5 leading-none select-none group-hover:text-[#FF5C00]/8 transition-colors" style={{fontFamily:"'Bebas Neue',Impact,sans-serif"}}>{f.n}</span>
                <div className="w-10 h-10 bg-[#FF5C00]/8 border border-[#FF5C00]/15 rounded flex items-center justify-center">
                  <Icon size={18} className="text-[#FF5C00]" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm mb-2">{f.title}</h3>
                  <p className="text-[#555] text-sm leading-relaxed">{f.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
