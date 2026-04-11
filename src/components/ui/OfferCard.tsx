// components/ui/OfferCard.tsx
import { Check, Star } from "lucide-react";
import { Offer } from "@/data/mockOffers";

interface OfferCardProps {
  offer: Offer;
}

export default function OfferCard({ offer }: OfferCardProps) {
  return (
    <div
      className={`
        relative flex flex-col rounded-sm border transition-all duration-300
        hover:-translate-y-1 overflow-hidden
        ${
          offer.popular
            ? "border-[#C41E3A]/60 bg-[#161616] shadow-[0_0_60px_rgba(196,30,58,0.12)]"
            : "border-[#222] bg-[#111] hover:border-[#333]"
        }
      `}
    >
      {/* Badge populaire */}
      {offer.popular && (
        <div className="absolute top-0 left-0 right-0 bg-[#C41E3A] py-2 text-center">
          <span className="flex items-center justify-center gap-1.5 text-xs font-bold tracking-widest uppercase text-white">
            <Star size={11} fill="white" />
            Le plus populaire
            <Star size={11} fill="white" />
          </span>
        </div>
      )}

      <div className={`p-8 flex flex-col flex-1 ${offer.popular ? "pt-14" : ""}`}>
        {/* Header */}
        <div className="mb-6">
          <span className="text-[#888] text-xs font-semibold tracking-[0.2em] uppercase">
            {offer.label}
          </span>
          <div className="mt-3 flex items-end gap-2">
            <span
              className="font-display text-6xl text-white leading-none"
              style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', Impact, sans-serif)" }}
            >
              {offer.price}€
            </span>
            <span className="text-[#555] text-sm mb-2">/ {offer.duration}</span>
          </div>
          <p className="text-[#C9A84C] text-sm mt-1 font-medium">
            ≈ {offer.pricePerMonth.toFixed(0)}€/mois
            {offer.savings && (
              <span className="ml-2 text-[#888] line-through-none text-xs">
                — {offer.savings}
              </span>
            )}
          </p>
        </div>

        {/* Features */}
        <ul className="flex flex-col gap-3 mb-8 flex-1">
          {offer.features.map((f, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-[#ccc]">
              <Check
                size={15}
                className={`mt-0.5 shrink-0 ${offer.popular ? "text-[#C41E3A]" : "text-[#C9A84C]"}`}
                strokeWidth={2.5}
              />
              {f}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href={offer.ctaLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`
            w-full text-center py-4 text-sm font-bold tracking-widest uppercase
            transition-all duration-200 rounded-sm
            ${
              offer.popular
                ? "bg-[#C41E3A] text-white hover:bg-[#E8274A]"
                : "bg-transparent border border-[#333] text-white hover:border-[#555] hover:bg-white/5"
            }
          `}
        >
          {offer.ctaLabel}
        </a>
      </div>
    </div>
  );
}
