// app/about/page.tsx
import type { Metadata } from "next";
import SectionTitle from "@/components/ui/SectionTitle";
import CTAButton from "@/components/ui/CTAButton";
import { Target, TrendingUp, BookOpen, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "À propos",
  description: "Découvrez la philosophie PrognoBeast : méthode, vision long terme et différence entre pari impulsif et approche structurée.",
};

const values = [
  { icon: Target, title: "Discipline", text: "Pas de paris émotionnels, pas de chasse aux pertes. Chaque mise est réfléchie, calibrée, et justifiée par les données." },
  { icon: TrendingUp, title: "Performance longue durée", text: "On ne cherche pas le jackpot. On cherche un ROI constant, mois après mois, grâce à une edge réelle sur le marché." },
  { icon: BookOpen, title: "Transparence absolue", text: "Wins, losses, séries difficiles — tout est publié. Pas de filtre. Pas de manipulation du bilan. Juste les faits." },
  { icon: Award, title: "Qualité sur quantité", text: "Un bon tip vaut dix mauvais. On préfère publier 4 analyses solides par semaine que 15 paris hasardeux." },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-24 bg-[#0A0A0A] overflow-hidden border-b border-[#1a1a1a]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C41E3A] opacity-[0.03] rounded-full blur-[120px]" />
        </div>
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <span className="inline-block text-[#C9A84C] text-xs font-semibold tracking-[0.2em] uppercase border border-[#C9A84C]/30 px-3 py-1 rounded-sm mb-6">
            Notre histoire
          </span>
          <h1
            className="font-display text-6xl md:text-8xl text-white uppercase leading-none tracking-wide mb-6"
            style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', Impact, sans-serif)" }}
          >
            Qui est{" "}
            <span className="text-gradient-red">PrognoBeast</span> ?
          </h1>
          <p className="text-[#777] text-xl leading-relaxed max-w-2xl">
            Une marque née de la frustration face aux faux tipsters, et construite sur la conviction
            qu&apos;il est possible de gagner structurellement aux paris sportifs — à condition de
            traiter ça comme une vraie discipline.
          </p>
        </div>
      </section>

      {/* Story + Timeline */}
      <section className="bg-[#0c0c0c] border-b border-[#1a1a1a]" style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <SectionTitle label="L'origine" title="Notre histoire" accent="histoire" />
              <div className="flex flex-col gap-5 text-[#777] text-base leading-relaxed">
                <p>
                  PrognoBeast est né d&apos;un constat simple : le monde des pronostics sportifs est
                  saturé d&apos;escrocs. Des captures d&apos;écran retouchées, des bilans inventés,
                  des tips publiés <em>après</em> les matchs. La confiance des parieurs est bafouée
                  en permanence.
                </p>
                <p>
                  On a voulu construire l&apos;inverse. Un espace où chaque tip est publié en temps réel,
                  analysé avec rigueur, et suivi avec une transparence totale — quelle que soit
                  l&apos;issue du match.
                </p>
                <p>
                  Après plus de trois ans d&apos;analyse des marchés de paris, d&apos;étude des modèles
                  de value betting et de test de différentes approches de bankroll, PrognoBeast a été lancé
                  avec une conviction forte :{" "}
                  <span className="text-white font-medium">la méthode prime sur le flair.</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { year: "2022", label: "3 ans d'analyse des marchés", text: "Étude approfondie des modèles de value betting, des marchés européens et de la gestion de bankroll professionnelle." },
                { year: "2023", label: "Développement de la méthode", text: "Construction et test du système de sélection de tips, du modèle de mise par unités et des critères d'analyse pré-match." },
                { year: "2024", label: "Lancement de PrognoBeast", text: "Ouverture publique avec publication de tous les tips en temps réel et suivi transparent depuis le premier jour." },
                { year: "2025", label: "Communauté VIP en croissance", text: "Plus de 500 membres actifs, +94 unités au bilan et un ROI moyen de +11.2% sur 14 mois consécutifs." },
              ].map((item, i, arr) => (
                <div key={i} className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-[#C41E3A]/10 border border-[#C41E3A]/30 rounded-sm flex items-center justify-center shrink-0">
                      <span className="text-[#C41E3A] text-xs font-bold">{item.year}</span>
                    </div>
                    {i < arr.length - 1 && <div className="w-px flex-1 bg-[#1a1a1a] mt-2" />}
                  </div>
                  <div className="pb-6">
                    <p className="text-white font-semibold text-sm mb-1">{item.label}</p>
                    <p className="text-[#555] text-sm leading-relaxed">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#0A0A0A] border-b border-[#1a1a1a]" style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionTitle
            label="Nos valeurs"
            title="Ce qui nous définit"
            accent="définit"
            centered
            subtitle="Quatre principes non négociables qui guident chaque décision chez PrognoBeast."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="glass-card border border-[#1a1a1a] hover:border-[#C41E3A]/25 rounded-sm p-8 transition-all duration-300">
                  <div className="w-10 h-10 bg-[#C41E3A]/10 rounded-sm flex items-center justify-center mb-5">
                    <Icon size={18} className="text-[#C41E3A]" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-white font-bold text-base mb-3">{v.title}</h3>
                  <p className="text-[#666] text-sm leading-relaxed">{v.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Philosophy comparison */}
      <section className="bg-[#0c0c0c]" style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <SectionTitle
            label="Notre philosophie"
            title="Pari impulsif vs méthode"
            accent="méthode"
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 text-left">
            <div className="bg-[#C41E3A]/5 border border-[#C41E3A]/15 rounded-sm p-7">
              <p className="text-[#C41E3A] text-xs font-bold tracking-widest uppercase mb-4">Le parieur impulsif</p>
              <ul className="flex flex-col gap-3 text-[#666] text-sm">
                {[
                  "Mise sur son équipe favorite",
                  "Augmente les mises après une perte",
                  "N'a pas de bankroll définie",
                  "Ignore les cotes et la value",
                  "Cherche le coup de la semaine",
                  "Abandonne après une mauvaise série",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <span className="text-[#C41E3A] mt-0.5 shrink-0">—</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-sm p-7">
              <p className="text-emerald-400 text-xs font-bold tracking-widest uppercase mb-4">Le parieur structuré</p>
              <ul className="flex flex-col gap-3 text-[#aaa] text-sm">
                {[
                  "Analyse les cotes et identifie la value",
                  "Mise un % fixe de sa bankroll",
                  "A un plan et s'y tient",
                  "Suit ses résultats sur la durée",
                  "Accepte les pertes comme normales",
                  "Pense en centaines de paris",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-12">
            <CTAButton href="/vip" label="Rejoindre la méthode" variant="primary" size="lg" />
          </div>
        </div>
      </section>
    </>
  );
}
