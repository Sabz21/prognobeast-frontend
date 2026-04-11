// components/ui/TestimonialCard.tsx
import { Star } from "lucide-react";
import { Testimonial } from "@/data/mockTestimonials";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="glass-card border border-[#1e1e1e] hover:border-[#2a2a2a] rounded-sm p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-0.5">
      {/* Stars */}
      <div className="flex gap-0.5">
        {Array.from({ length: testimonial.stars }).map((_, i) => (
          <Star key={i} size={13} className="text-[#C9A84C]" fill="#C9A84C" />
        ))}
      </div>

      {/* Quote */}
      <p className="text-[#bbb] text-sm leading-relaxed flex-1">
        &ldquo;{testimonial.text}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-2 border-t border-[#1e1e1e]">
        {/* Avatar initiales */}
        <div className="w-9 h-9 rounded-full bg-[#C41E3A]/15 border border-[#C41E3A]/30 flex items-center justify-center shrink-0">
          <span className="text-[#C41E3A] text-xs font-bold tracking-wide">
            {testimonial.avatar}
          </span>
        </div>
        <div>
          <p className="text-white text-sm font-semibold">{testimonial.name}</p>
          <p className="text-[#555] text-xs">{testimonial.since}</p>
        </div>
      </div>
    </div>
  );
}
