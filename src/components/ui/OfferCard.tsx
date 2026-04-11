import { Check, Star } from "lucide-react";
import { Offer } from "@/data/mockOffers";
export default function OfferCard({ offer }: { offer: Offer }) {
  return (
    <div className={`relative flex flex-col rounded-lg border transition-all duration-300 hover:-translate-y-1 overflow-hidden
      ${offer.popular
        ? "border-[#FF5C00]/60 bg-[#111] shadow-[0_0_60px_rgba(255,92,0,0.1)]"
        : "border-[#1F1F1F] bg-[#0E0E0E] hover:border-[#2A2A2A]"}`}>
      {offer.popular && (
        <div className="btn-shimmer py-2 text-center">
          <span className="flex items-center justify-center gap-1.5 text-xs font-bold tracking-widest uppercase text-white">
            <Star size={10} fill="white" /> Le plus populaire <Star size={10} fill="white" />
          </span>
        </div>
      )}
      <div className={`p-7 flex flex-col flex-1 ${offer.popular ? "pt-6" : ""}`}>
        <span className="text-[#444] text-xs font-bold tracking-[0.2em] uppercase">{offer.label}</span>
        <div className="mt-3 flex items-end gap-2">
          <span className="font-display text-6xl text-white leading-none" style={{fontFamily:"'Bebas Neue',Impact,sans-serif"}}>{offer.price}€</span>
          <span className="text-[#444] text-sm mb-2">/ {offer.duration}</span>
        </div>
        <p className="text-[#FF5C00] text-sm mt-1 font-medium">
          ≈ {offer.pricePerMonth.toFixed(0)}€/mois
          {offer.savings && <span className="text-[#444] text-xs ml-2">— {offer.savings}</span>}
        </p>
        <ul className="flex flex-col gap-2.5 my-6 flex-1">
          {offer.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-[#888]">
              <Check size={14} className="text-[#FF5C00] shrink-0 mt-0.5" strokeWidth={2.5} />{f}
            </li>
          ))}
        </ul>
        <a href={offer.ctaLink} target="_blank" rel="noopener noreferrer"
          className={`w-full text-center py-3.5 text-xs font-bold tracking-widest uppercase rounded transition-all duration-200
            ${offer.popular ? "btn-shimmer text-white hover:scale-105" : "border border-[#2A2A2A] text-white hover:border-[#FF5C00] hover:text-[#FF5C00]"}`}>
          {offer.ctaLabel}
        </a>
      </div>
    </div>
  );
}
