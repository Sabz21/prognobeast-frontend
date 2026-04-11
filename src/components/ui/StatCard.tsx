import { LucideIcon } from "lucide-react";
interface Props { icon?: LucideIcon; value: string; label: string; sublabel?: string; accent?: "orange"|"white"; }
export default function StatCard({ icon: Icon, value, label, sublabel, accent = "orange" }: Props) {
  const color = accent === "orange" ? "text-[#FF5C00]" : "text-white";
  return (
    <div className="group glass border border-[#1F1F1F] hover:border-[#FF5C00]/40 rounded-lg p-6 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(255,92,0,0.08)]">
      {Icon && <Icon size={20} className={`${color} opacity-80`} strokeWidth={1.5} />}
      <div>
        <p className={`font-display text-4xl leading-none ${color}`} style={{fontFamily:"'Bebas Neue',Impact,sans-serif"}}>{value}</p>
        <p className="text-white text-xs font-bold tracking-wider uppercase mt-2">{label}</p>
        {sublabel && <p className="text-[#444] text-xs mt-1">{sublabel}</p>}
      </div>
    </div>
  );
}
