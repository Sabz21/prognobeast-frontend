import SectionTitle from "@/components/ui/SectionTitle";
import TestimonialCard from "@/components/ui/TestimonialCard";
import { testimonials } from "@/data/mockTestimonials";

export default function Testimonials() {
  return (
    <section className="w-full bg-[#080808] py-24">
      <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-10">
        <SectionTitle label="Communauté" title="Ils nous font confiance" accent="confiance" centered
          subtitle="Des centaines de membres actifs. Voici ce qu'ils disent de leur expérience PrognoBeast." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
          {testimonials.map(t => <TestimonialCard key={t.id} testimonial={t} />)}
        </div>
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {[{v:"500+",l:"membres VIP actifs"},{v:"4.9/5",l:"satisfaction moyenne"},{v:"94%",l:"taux de renouvellement"}].map(i => (
            <div key={i.l} className="flex items-center gap-3">
              <span className="font-display text-3xl text-[#FF5C00]" style={{fontFamily:"'Bebas Neue',Impact,sans-serif"}}>{i.v}</span>
              <span className="text-[#444] text-sm">{i.l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
