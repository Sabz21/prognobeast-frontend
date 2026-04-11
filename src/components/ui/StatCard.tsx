// components/ui/StatCard.tsx
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon?: LucideIcon;
  value: string;
  label: string;
  sublabel?: string;
  accent?: "red" | "gold" | "white";
  large?: boolean;
}

export default function StatCard({
  icon: Icon,
  value,
  label,
  sublabel,
  accent = "red",
  large = false,
}: StatCardProps) {
  const accentColor = {
    red: "text-[#C41E3A]",
    gold: "text-[#C9A84C]",
    white: "text-white",
  };

  const borderColor = {
    red: "border-[#C41E3A]/20 hover:border-[#C41E3A]/50",
    gold: "border-[#C9A84C]/20 hover:border-[#C9A84C]/50",
    white: "border-white/10 hover:border-white/30",
  };

  return (
    <div
      className={`
        glass-card rounded-sm p-6 flex flex-col gap-3
        border ${borderColor[accent]}
        transition-all duration-300 hover:-translate-y-1
        ${large ? "p-8" : ""}
      `}
    >
      {Icon && (
        <div className={`${accentColor[accent]} mb-1`}>
          <Icon size={large ? 28 : 22} strokeWidth={1.5} />
        </div>
      )}
      <div>
        <p
          className={`
            font-display leading-none tracking-wide
            ${accentColor[accent]}
            ${large ? "text-6xl" : "text-4xl"}
          `}
          style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', Impact, sans-serif)" }}
        >
          {value}
        </p>
        <p className="text-white font-semibold text-sm mt-2 tracking-wide uppercase">
          {label}
        </p>
        {sublabel && (
          <p className="text-[#666] text-xs mt-1">{sublabel}</p>
        )}
      </div>
    </div>
  );
}
