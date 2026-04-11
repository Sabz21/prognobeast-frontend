import type { Metadata } from "next";
import SectionTitle from "@/components/ui/SectionTitle";
import OfferCard from "@/components/ui/OfferCard";
import { offers, faq } from "@/data/mockOffers";
import { Check, ChevronDown } from "lucide-react";
export const metadata: Metadata = { title: "VIP — Offres & Abonnements" };

const vipIncludes = [
  "Accès au canal Telegram VIP privé",
  "Tous les pronostics premium en temps réel",
  "Analyses pré-match complètes et détaillées",
  "Système de mise par unités (bankroll structurée)",
  "Suivi de performance mensuel",
  "Récapitulatifs et bilans exclusifs",
  "Support et communauté réactive",
  "Accès aux analyses de matchs spéciaux",
];

export default function VipPage() {
  return (
    <>
      <section className="relative w-full pt-36 pb-20 bg-[#080808] border-b border-[#1F1F1F] overflow-hidden">
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-[#FF5C00] opacity-[0.03] rounded-full blur-[120px] pointer-events-none" />
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
          <span className="inline-flex items-center gap-2 text-[#FF5C00] text-xs font-bold tracking-[0.2em] uppercase mb-6">
            <span className="w-4 h-px bg-[#FF5C00]" />Accès VIP<span className="w-4 h-px bg-[#FF5C00]" />
          </span>
          <h1 className="font-display text-6xl md:text-8xl text-white uppercase leading-none tracking-wide mb-5" style={{fontFamily:"'Bebas Neue',Impact,sans-serif"}}>
            Rejoignez le <span className="text-orange">niveau supérieur</span>
          </h1>
          <p className="text-[#555] text-lg leading-relaxed max-w-2xl mx-auto">Accès aux pronostics premium, analyses détaillées et accompagnement bankroll dans un canal Telegram dédié.</p>
        </div>
      </section>

      <section className="w-full bg-[#0B0B0B] border-b border-[#1F1F1F] py-16">
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionTitle label="Ce qui est inclus" title="Tout ce que vous obtenez" accent="obtenez" />
              <ul className="flex flex-col gap-3">
                {vipIncludes.map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-[#888]">
                    <div className="w-5 h-5 bg-[#FF5C00]/10 border border-[#FF5C00]/20 rounded flex items-center justify-center shrink-0">
                      <Check size={11} className="text-[#FF5C00]" strokeWidth={2.5} />
                    </div>{item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass border border-[#FF5C00]/20 rounded-lg p-10 glow-orange">
              <p className="text-[#FF5C00] text-xs font-bold tracking-[0.2em] uppercase mb-6">Pourquoi rejoindre maintenant</p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[{v:"+94u",l:"Unités gagnées"},{v:"68.4%",l:"Win rate"},{v:"+11.2%",l:"ROI moyen"},{v:"500+",l:"Membres actifs"}].map(s => (
                  <div key={s.l} className="bg-[#0E0E0E] border border-[#1F1F1F] rounded p-4 text-center">
                    <p className="font-display text-3xl text-[#FF5C00]" style={{fontFamily:"'Bebas Neue',Impact,sans-serif"}}>{s.v}</p>
                    <p className="text-[#444] text-xs mt-1">{s.l}</p>
                  </div>
                ))}
              </div>
              <p className="text-[#444] text-xs leading-relaxed">Ces chiffres sont publics et vérifiables. Ils représentent notre bilan sur 14 mois depuis le lancement.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-[#080808] border-b border-[#1F1F1F] py-20">
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-10">
          <SectionTitle label="Tarifs" title="Choisissez votre formule" accent="formule" centered subtitle="Plus vous vous engagez sur la durée, plus vous économisez." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            {offers.map(o => <OfferCard key={o.id} offer={o} />)}
          </div>
          <p className="text-center text-[#222] text-xs mt-8">Paiement sécurisé · Accès immédiat · Pas de renouvellement automatique</p>
        </div>
      </section>

      <section className="w-full bg-[#0B0B0B] py-20">
        <div className="w-full max-w-3xl mx-auto px-6 lg:px-10">
          <SectionTitle label="Questions fréquentes" title="FAQ" centered subtitle="Tout ce que vous devez savoir avant de rejoindre." />
          <div className="flex flex-col gap-2.5 mt-10">
            {faq.map((item, i) => (
              <details key={i} className="group glass border border-[#1F1F1F] hover:border-[#2A2A2A] rounded-lg overflow-hidden">
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none select-none">
                  <span className="text-white font-semibold text-sm pr-4">{item.question}</span>
                  <ChevronDown size={15} className="text-[#444] shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="px-6 pb-5 text-[#555] text-sm leading-relaxed border-t border-[#1F1F1F] pt-4">{item.answer}</p>
              </details>
            ))}
          </div>
          <div className="mt-10 text-center glass border border-[#1F1F1F] rounded-lg p-8">
            <p className="text-white font-semibold mb-1">D&apos;autres questions ?</p>
            <p className="text-[#444] text-sm mb-5">Notre équipe répond rapidement.</p>
            <a href="https://t.me/PrognoBeast" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 btn-shimmer text-white text-xs font-bold tracking-widest uppercase px-6 py-3 rounded hover:scale-105 transition-transform">
              Contacter sur Telegram
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
