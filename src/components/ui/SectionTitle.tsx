interface Props {
  label?: string;
  title: string;
  accent?: string;
  subtitle?: string;
  centered?: boolean;
}
export default function SectionTitle({ label, title, accent, subtitle, centered = false }: Props) {
  const renderTitle = () => {
    if (!accent) return title;
    const parts = title.split(accent);
    return <>{parts[0]}<span className="text-orange">{accent}</span>{parts[1]}</>;
  };
  return (
    <div className={`mb-12 ${centered ? "text-center" : ""}`}>
      {label && (
        <span className="inline-flex items-center gap-2 text-[#FF5C00] text-xs font-bold tracking-[0.2em] uppercase mb-4">
          <span className="w-4 h-px bg-[#FF5C00]" />
          {label}
          <span className="w-4 h-px bg-[#FF5C00]" />
        </span>
      )}
      <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-white uppercase leading-none tracking-wide"
        style={{fontFamily:"'Bebas Neue',Impact,sans-serif"}}>
        {renderTitle()}
      </h2>
      {subtitle && (
        <p className={`text-[#6B6B6B] text-base md:text-lg leading-relaxed mt-4 max-w-2xl ${centered ? "mx-auto" : ""}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
