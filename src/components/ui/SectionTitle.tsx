// components/ui/SectionTitle.tsx
interface SectionTitleProps {
  label?: string; // petite étiquette au-dessus
  title: string;
  accent?: string; // mot(s) à colorier en rouge
  subtitle?: string;
  centered?: boolean;
  light?: boolean; // variante titre clair
}

export default function SectionTitle({
  label,
  title,
  accent,
  subtitle,
  centered = false,
  light = false,
}: SectionTitleProps) {
  // Remplace le mot accent dans le titre par une version colorée
  const renderTitle = () => {
    if (!accent) return title;
    const parts = title.split(accent);
    return (
      <>
        {parts[0]}
        <span className="text-gradient-red">{accent}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <div className={`mb-12 ${centered ? "text-center" : ""}`}>
      {label && (
        <span
          className="inline-block text-[#C9A84C] text-xs font-semibold tracking-[0.2em] uppercase mb-4
            border border-[#C9A84C]/30 px-3 py-1 rounded-sm"
        >
          {label}
        </span>
      )}
      <h2
        className={`font-display text-5xl md:text-6xl lg:text-7xl leading-none tracking-wide uppercase mb-4
          ${light ? "text-white" : "text-white"}`}
        style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', Impact, sans-serif)" }}
      >
        {renderTitle()}
      </h2>
      {subtitle && (
        <p
          className={`text-base md:text-lg max-w-2xl leading-relaxed
            ${centered ? "mx-auto" : ""}
            ${light ? "text-[#888]" : "text-[#888]"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
