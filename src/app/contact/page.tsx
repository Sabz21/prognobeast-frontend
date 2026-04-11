"use client";
import { useState, FormEvent } from "react";
import { sendContactForm } from "@/lib/api";
import { Send, Mail, MessageSquare, ArrowRight } from "lucide-react";

const subjects = ["Rejoindre le VIP","Question sur les abonnements","Partenariat / Collaboration","Problème technique","Autre"];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: subjects[0], message: "" });
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await sendContactForm(form);
      setStatus("success");
      setForm({ name: "", email: "", subject: subjects[0], message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Une erreur est survenue.");
    }
  };

  const inputCls = "w-full bg-[#0E0E0E] border border-[#1F1F1F] hover:border-[#2A2A2A] focus:border-[#FF5C00] text-white text-sm px-4 py-3.5 rounded outline-none transition-colors placeholder:text-[#2A2A2A]";

  return (
    <>
      <section className="relative w-full pt-36 pb-16 bg-[#080808] border-b border-[#1F1F1F] overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF5C00] opacity-[0.03] rounded-full blur-[120px] pointer-events-none" />
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-10">
          <span className="inline-flex items-center gap-2 text-[#FF5C00] text-xs font-bold tracking-[0.2em] uppercase mb-6">
            <span className="w-4 h-px bg-[#FF5C00]" />Nous contacter<span className="w-4 h-px bg-[#FF5C00]" />
          </span>
          <h1 className="font-display text-6xl md:text-[9rem] text-white uppercase leading-none tracking-wide mb-4" style={{fontFamily:"'Bebas Neue',Impact,sans-serif"}}>
            On est là<span className="text-orange">.</span>
          </h1>
          <p className="text-[#555] text-lg max-w-xl leading-relaxed">Une question sur les offres, un partenariat à proposer ? Contactez-nous via le formulaire ou directement sur Telegram.</p>
        </div>
      </section>

      <section className="w-full bg-[#080808] py-20">
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left */}
            <div className="flex flex-col gap-5">
              <div className="mb-2">
                <p className="text-white font-bold mb-1">Réponse rapide garantie</p>
                <p className="text-[#444] text-sm leading-relaxed">On répond généralement dans les 24h. Pour une réponse encore plus rapide, Telegram est le meilleur moyen.</p>
              </div>

              {[
                { href:"https://t.me/PrognoBeast", icon: Send,         label:"Telegram",    sub:"@PrognoBeast",           external: true },
                { href:"mailto:contact@prognobeast.com", icon: Mail,   label:"Email",       sub:"contact@prognobeast.com", external: false },
                { href:"https://tiktok.com/@PrognoBeast", icon: MessageSquare, label:"TikTok", sub:"@PrognoBeast",        external: true },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <a key={item.label} href={item.href} target={item.external?"_blank":undefined} rel={item.external?"noopener noreferrer":undefined}
                    className="flex items-center gap-4 glass border border-[#1F1F1F] hover:border-[#FF5C00]/30 rounded-lg p-5 transition-all duration-200 group">
                    <div className="w-10 h-10 bg-[#FF5C00]/8 border border-[#FF5C00]/15 rounded flex items-center justify-center shrink-0 group-hover:bg-[#FF5C00]/15 transition-colors">
                      <Icon size={16} className="text-[#FF5C00]" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{item.label}</p>
                      <p className="text-[#333] text-xs">{item.sub}</p>
                    </div>
                  </a>
                );
              })}

              <div className="glass border border-[#FF5C00]/15 rounded-lg p-6 mt-2">
                <p className="text-[#FF5C00] text-xs font-bold tracking-widest uppercase mb-2">Vous voulez rejoindre le VIP ?</p>
                <p className="text-[#444] text-sm mb-4 leading-relaxed">La façon la plus rapide est de nous contacter directement sur Telegram.</p>
                <a href="https://t.me/PrognoBeast" target="_blank" rel="noopener noreferrer"
                  className="btn-shimmer text-white text-xs font-bold tracking-widest uppercase px-5 py-2.5 rounded inline-flex items-center gap-2 hover:scale-105 transition-transform">
                  <Send size={12} />Telegram VIP
                </a>
              </div>
            </div>

            {/* Right: form */}
            <div className="lg:col-span-2">
              <div className="glass border border-[#1F1F1F] rounded-lg p-8">
                <h2 className="text-white font-bold text-lg mb-1">Envoyer un message</h2>
                <p className="text-[#333] text-sm mb-8">Remplissez le formulaire, on vous revient rapidement.</p>

                {status === "success" && (
                  <div className="mb-6 bg-emerald-500/8 border border-emerald-500/15 rounded p-5 text-center">
                    <p className="text-emerald-400 font-bold">Message envoyé ✓</p>
                    <p className="text-[#444] text-sm mt-1">On vous répond dans les meilleurs délais.</p>
                  </div>
                )}
                {status === "error" && (
                  <div className="mb-6 bg-[#FF5C00]/8 border border-[#FF5C00]/15 rounded p-4">
                    <p className="text-[#FF5C00] text-sm">{errorMsg}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#333] text-xs font-bold tracking-wider uppercase block mb-2">Nom *</label>
                      <input type="text" required placeholder="Votre nom" value={form.name} onChange={e => setForm({...form, name:e.target.value})} className={inputCls} />
                    </div>
                    <div>
                      <label className="text-[#333] text-xs font-bold tracking-wider uppercase block mb-2">Email *</label>
                      <input type="email" required placeholder="votre@email.com" value={form.email} onChange={e => setForm({...form, email:e.target.value})} className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[#333] text-xs font-bold tracking-wider uppercase block mb-2">Sujet</label>
                    <select value={form.subject} onChange={e => setForm({...form, subject:e.target.value})} className={`${inputCls} appearance-none cursor-pointer`}>
                      {subjects.map(s => <option key={s} value={s} className="bg-[#0E0E0E]">{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[#333] text-xs font-bold tracking-wider uppercase block mb-2">Message *</label>
                    <textarea required rows={5} placeholder="Votre message..." value={form.message} onChange={e => setForm({...form, message:e.target.value})} className={`${inputCls} resize-none`} />
                  </div>
                  <button type="submit" disabled={status==="loading"}
                    className="flex items-center justify-center gap-2.5 btn-shimmer text-white text-sm font-bold tracking-widest uppercase px-8 py-4 rounded hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed mt-2">
                    {status === "loading" ? (
                      <><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />Envoi en cours...</>
                    ) : (
                      <>Envoyer le message <ArrowRight size={15} /></>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
