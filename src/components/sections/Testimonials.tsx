// components/sections/Testimonials.tsx
import SectionTitle from "@/components/ui/SectionTitle";
import TestimonialCard from "@/components/ui/TestimonialCard";
import { testimonials } from "@/data/mockTestimonials";

export default function Testimonials() {
  return (
    <section
      className="bg-[#0A0A0A]"
      style={{ paddingTop: "6rem", paddingBottom: "6rem" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionTitle
          label="Communauté"
          title="Ils nous font"
          accent="confiance"
          subtitle="Des centaines de membres actifs. Voici ce qu'ils disent de leur expérience PrognoBeast."
          centered
        />

        {/* Grid témoignages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>

        {/* Social proof bar */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {[
            { value: "500+", label: "membres VIP actifs" },
            { value: "4.9/5", label: "satisfaction moyenne" },
            { value: "94%", label: "taux de renouvellement" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span
                className="font-display text-3xl text-[#C41E3A]"
                style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', Impact, sans-serif)" }}
              >
                {item.value}
              </span>
              <span className="text-[#555] text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
