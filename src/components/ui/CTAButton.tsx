import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

interface Props {
  href: string;
  label: string;
  variant?: "primary" | "secondary" | "ghost";
  external?: boolean;
  size?: "sm" | "md" | "lg";
  icon?: boolean;
  className?: string;
}
export default function CTAButton({ href, label, variant = "primary", external = false, size = "md", icon = true, className = "" }: Props) {
  const sizes = { sm: "px-5 py-2.5 text-xs", md: "px-6 py-3 text-xs", lg: "px-8 py-4 text-sm" };
  const variants = {
    primary: "btn-shimmer text-white hover:scale-105",
    secondary: "bg-transparent border border-[#2A2A2A] text-white hover:border-[#FF5C00] hover:text-[#FF5C00]",
    ghost: "bg-transparent text-[#6B6B6B] hover:text-white",
  };
  const cls = `inline-flex items-center gap-2 font-bold tracking-[0.15em] uppercase rounded transition-all duration-200 active:scale-95 ${sizes[size]} ${variants[variant]} ${className}`;
  const content = <>{label}{icon && (external ? <ExternalLink size={13} /> : <ArrowRight size={13} />)}</>;
  if (external) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{content}</a>;
  return <Link href={href} className={cls}>{content}</Link>;
}
