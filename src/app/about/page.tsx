import type { Metadata } from "next";
import SectionTitle from "@/components/ui/SectionTitle";
import CTAButton from "@/components/ui/CTAButton";
import { Target, TrendingUp, BookOpen, Award } from "lucide-react";
export const metadata: Metadata = { title: "À propos" };

const values = [
  { icon: Target,    n:"01", title: "Discipline",             text: "Pas de paris émotionnels, pas de chasse aux pertes. Chaque mise est réfléchie, calibrée, et justifiée par les données." },
  { icon: TrendingUp,n:"02", title: "Performance longue durée",text: "On ne cherche pas le jackpot. On cherche un ROI constant, mois après mois, grâce à une edge réelle sur le marché." },
  { icon: BookOpen,  n:"03", title: "Transparence absolue",   text: "Wins, losses, séries difficiles — tout est publié. Pas de filtre. Pas de manipulation du bilan. Juste les faits." },
  { icon: Award,     n:"04", title: "Qualité sur quantité",   text: "Un bon tip vaut dix mauvais. On préfère publier 4 analyses solides par semaine que 15 paris hasardeux." },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative w-full pt-36 pb-24 bg-[#080808] border-b border-[#1F1F1F] overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF5C00] opacity-[0.03] rounded-full blur-[140px] pointer-events-none" />
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-10">
          <span className="inline-flex items-center gap-2 text-[#FF5C00] text-xs font-bold tracking-[0.2em] uppercase mb-6">
            <span className="w-4 h-px bg-[#FF5C00]" />Notre histoire<span className="w-4 h-px bg-[#FF5C00]" />
          </span>
          <h1 className="font-display text-6xl md:text-[9rem] text-white uppercase leading-none tracking-wide mb-6"
            style={{fontFamily:"'Bebas Neue',Impact,sans-serif"}}>
            Qui est<br /><span className="text-orange">PrognoBeast</span> ?
          </h1>
          <p className="text-[#555] text-xl leading-relaxed max-w-2xl">
            Une marque née de la frustration face aux faux tipsters, construite sur la conviction
            qu&apos;il est possible de gagner structurellement aux paris sportifs — à condition de
            traiter ça comme une vraie discipline.
          </p>
        </div>
      </section>

      {/* Story + Timeline */}
      <section className="w-full bg-[#0B0B0B] border-b border-[#1F1F1F] py-20">
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <SectionTitle label="L'origine" title="Notre histoire" accent="histoire" />
              <div className="flex flex-col gap-5 text-[#666] text-base leading-relaxed">
                <p>PrognoBeast est né d&apos;un constat simple : le monde des pronostics sportifs est saturé d&apos;escrocs. Des captures d&apos;écran retouchées, des bilans inventés, des tips publiés <em className="text-[#888]">après</em> les matchs. La confiance des parieurs est bafouée en permanence.</p>
                <p>On a voulu construire l&apos;inverse. Un espace où chaque tip est publié en temps réel, analysé avec rigueur, et suivi avec une transparence totale — quelle que soit l&apos;issue du match.</p>
                <p>Après plus de trois ans d&apos;analyse des marchés de paris, PrognoBeast a été lancé avec une conviction forte : <span className="text-white font-semibold">la méthode prime sur le flair.</span></p>
              </div>
            </div>

            {/* Timeline */}
            <div className="flex flex-col gap-0">
              {[
                { year:"2022", label:"3 ans d'analyse des marchés",   text:"Étude approfondie des modèles de value betting, des marchés européens et de la gestion de bankroll professionnelle." },
                { year:"2023", label:"Développement de la méthode",   text:"Construction et test du système de sélection de tips, du modèle de mise par unités et des critères d'analyse pré-match." },
                { year:"2024", label:"Lancement de PrognoBeast",      text:"Ouverture publique avec publication de tous les tips en temps réel et suivi transparent depuis le premier jour." },
                { year:"2025", label:"Communauté VIP en croissance",  text:"Plus de 500 membres actifs, +94 unités au bilan et un ROI moyen de +11.2% sur 14 mois consécutifs." },
              ].map((item, i, arr) => (
                <div key={i} className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-[#FF5C00]/8 border border-[#FF5C00]/25 rounded flex items-center justify-center shrink-0">
                      <span className="text-[#FF5C00] text-xs font-bold">{item.year}</span>
                    </div>
                    {i < arr.length - 1 && <div className="w-px flex-1 bg-gradient-to-b from-[#FF5C00]/20 to-transparent my-2" style={{minHeight:"32px"}} />}
                  </div>
                  <div className={`${i < arr.length - 1 ? "pb-8" : ""}`}>
                    <p className="text-white font-bold text-sm mb-1.5 mt-3">{item.label}</p>
                    <p className="text-[#444] text-sm leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="w-full bg-[#080808] border-b border-[#1F1F1F] py-20">
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-10">
          <SectionTitle label="Nos valeurs" title="Ce qui nous définit" accent="définit" centered
            subtitle="Quatre principes non négociables qui guident chaque décision chez PrognoBeast." />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
            {values.map(v => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="group relative glass border border-[#1F1F1F] hover:border-[#FF5C00]/30 rounded-lg p-8 transition-all duration-300 overflow-hidden">
                  <span className="absolute top-4 right-5 font-display text-7xl text-[#FF5C00]/4 group-hover:text-[#FF5C00]/7 transition-colors leading-none select-none" style={{fontFamily:"'Bebas Neue',Impact,sans-serif"}}>{v.n}</span>
                  <div className="w-10 h-10 bg-[#FF5C00]/8 border border-[#FF5C00]/15 rounded flex items-center justify-center mb-5">
                    <Icon size={18} className="text-[#FF5C00]" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-white font-bold text-base mb-2">{v.title}</h3>
                  <p className="text-[#555] text-sm leading-relaxed">{v.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="w-full bg-[#0B0B0B] py-20">
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-10">
          <SectionTitle label="Notre philosophie" title="Pari impulsif vs méthode" accent="méthode" centered />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10 max-w-4xl mx-auto">
            <div className="bg-[#FF5C00]/4 border border-[#FF5C00]/10 rounded-lg p-8">
              <p className="text-[#FF5C00] text-xs font-bold tracking-widest uppercase mb-5">Le parieur impulsif</p>
              <ul className="flex flex-col gap-3 text-[#555] text-sm">
                {["Mise sur son équipe favorite","Augmente les mises après une perte","N'a pas de bankroll définie","Ignore les cotes et la value","Cherche le coup de la semaine","Abandonne après une mauvaise série"].map(t => (
                  <li key={t} className="flex items-start gap-2.5"><span className="text-[#FF5C00] shrink-0 mt-0.5">—</span>{t}</li>
                ))}
              </ul>
            </div>
            <div className="bg-emerald-500/4 border border-emerald-500/10 rounded-lg p-8">
              <p className="text-emerald-400 text-xs font-bold tracking-widest uppercase mb-5">Le parieur structuré</p>
              <ul className="flex flex-col gap-3 text-[#999] text-sm">
                {["Analyse les cotes et identifie la value","Mise un % fixe de sa bankroll","A un plan et s'y tient","Suit ses résultats sur la durée","Accepte les pertes comme normales","Pense en centaines de paris"].map(t => (
                  <li key={t} className="flex items-start gap-2.5"><span className="text-emerald-400 shrink-0 mt-0.5">✓</span>{t}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-12 text-center">
            <CTAButton href="/vip" label="Rejoindre la méthode" variant="primary" size="lg" />
          </div>
        </div>
      </section>
    </>
  );
}
