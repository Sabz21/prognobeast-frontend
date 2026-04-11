import { Star } from "lucide-react";
import { Testimonial } from "@/data/mockTestimonials";
export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="glass border border-[#1F1F1F] hover:border-[#FF5C00]/30 rounded-lg p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex gap-0.5">
        {Array.from({ length: testimonial.stars }).map((_, i) => (
          <Star key={i} size={12} className="text-[#FF5C00]" fill="#FF5C00" />
        ))}
      </div>
      <p className="text-[#888] text-sm leading-relaxed flex-1">&ldquo;{testimonial.text}&rdquo;</p>
      <div className="flex items-center gap-3 pt-3 border-t border-[#1F1F1F]">
        <div className="w-9 h-9 rounded-full bg-[#FF5C00]/10 border border-[#FF5C00]/20 flex items-center justify-center shrink-0">
          <span className="text-[#FF5C00] text-xs font-bold">{testimonial.avatar}</span>
        </div>
        <div>
          <p className="text-white text-sm font-semibold">{testimonial.name}</p>
          <p className="text-[#444] text-xs">{testimonial.since}</p>
        </div>
      </div>
    </div>
  );
}
