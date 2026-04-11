// components/ui/CTAButton.tsx
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

interface CTAButtonProps {
  href: string;
  label: string;
  variant?: "primary" | "secondary" | "ghost" | "gold";
  external?: boolean;
  size?: "sm" | "md" | "lg";
  icon?: boolean;
  className?: string;
}

export default function CTAButton({
  href,
  label,
  variant = "primary",
  external = false,
  size = "md",
  icon = true,
  className = "",
}: CTAButtonProps) {
  const sizeClasses = {
    sm: "px-5 py-2.5 text-sm",
    md: "px-7 py-3.5 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const variantClasses = {
    primary: `
      bg-[#C41E3A] text-white border border-[#C41E3A]
      hover:bg-[#E8274A] hover:border-[#E8274A]
      active:bg-[#8B0000]
    `,
    secondary: `
      bg-transparent text-white border border-white/20
      hover:border-white/60 hover:bg-white/5
    `,
    ghost: `
      bg-transparent text-[#888] border border-[#222]
      hover:text-white hover:border-[#444]
    `,
    gold: `
      bg-transparent text-[#C9A84C] border border-[#C9A84C]/40
      hover:bg-[#C9A84C]/10 hover:border-[#C9A84C]
    `,
  };

  const classes = `
    inline-flex items-center gap-2.5 font-semibold tracking-wide uppercase
    transition-all duration-200 rounded-sm cursor-pointer select-none
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `;

  const content = (
    <>
      {label}
      {icon && (external ? <ExternalLink size={14} /> : <ArrowRight size={14} />)}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
