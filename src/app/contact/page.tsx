"use client";
// app/contact/page.tsx
import { useState, FormEvent } from "react";
import { sendContactForm } from "@/lib/api";
import { Send, Mail, MessageSquare } from "lucide-react";

const subjects = [
  "Rejoindre le VIP",
  "Question sur les abonnements",
  "Partenariat / Collaboration",
  "Problème technique",
  "Autre",
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: subjects[0],
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      await sendContactForm(form);
      setStatus("success");
      setForm({ name: "", email: "", subject: subjects[0], message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Une erreur est survenue.");
    }
  };

  const inputClass =
    "w-full bg-[#111] border border-[#222] hover:border-[#333] focus:border-[#C41E3A] text-white text-sm px-4 py-3.5 rounded-sm outline-none transition-colors placeholder:text-[#444]";

  return (
    <>
      {/* Header */}
      <section className="relative pt-36 pb-16 bg-[#0A0A0A] border-b border-[#1a1a1a] overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#C41E3A] opacity-[0.03] rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <span className="inline-block text-[#C9A84C] text-xs font-semibold tracking-[0.2em] uppercase border border-[#C9A84C]/30 px-3 py-1 rounded-sm mb-6">
            Nous contacter
          </span>
          <h1
            className="font-display text-6xl md:text-8xl text-white uppercase leading-none tracking-wide mb-4"
            style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', Impact, sans-serif)" }}
          >
            On est là<span className="text-gradient-red">.</span>
          </h1>
          <p className="text-[#666] text-lg max-w-xl leading-relaxed">
            Une question sur les offres, un partenariat à proposer, ou simplement besoin d&apos;informations ?
            Contactez-nous via le formulaire ou directement sur Telegram.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-[#0A0A0A]" style={{ paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left: info */}
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-white font-bold text-base mb-2">Réponse rapide garantie</p>
                <p className="text-[#555] text-sm leading-relaxed">
                  On répond généralement dans les 24h. Pour une réponse encore plus rapide,
                  Telegram est le meilleur moyen de nous joindre.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {/* Telegram */}
                <a
                  href="https://t.me/prognobeastfree"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 glass-card border border-[#1a1a1a] hover:border-[#C41E3A]/30 rounded-sm p-5 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 bg-[#C41E3A]/10 border border-[#C41E3A]/20 rounded-sm flex items-center justify-center shrink-0 group-hover:bg-[#C41E3A]/20 transition-colors">
                    <Send size={16} className="text-[#C41E3A]" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Telegram</p>
                    <p className="text-[#444] text-xs">@PrognoBeast</p>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:contact@prognobeast.com"
                  className="flex items-center gap-4 glass-card border border-[#1a1a1a] hover:border-[#C41E3A]/30 rounded-sm p-5 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 bg-[#C41E3A]/10 border border-[#C41E3A]/20 rounded-sm flex items-center justify-center shrink-0 group-hover:bg-[#C41E3A]/20 transition-colors">
                    <Mail size={16} className="text-[#C41E3A]" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Email</p>
                    <p className="text-[#444] text-xs">contact@prognobeast.com</p>
                  </div>
                </a>

                {/* TikTok */}
                <a
                  href="https://tiktok.com/@PrognoBeast"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 glass-card border border-[#1a1a1a] hover:border-[#C41E3A]/30 rounded-sm p-5 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 bg-[#C41E3A]/10 border border-[#C41E3A]/20 rounded-sm flex items-center justify-center shrink-0 group-hover:bg-[#C41E3A]/20 transition-colors">
                    <MessageSquare size={16} className="text-[#C41E3A]" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">TikTok</p>
                    <p className="text-[#444] text-xs">@PrognoBeast</p>
                  </div>
                </a>
              </div>

              <div className="glass-card border border-[#C9A84C]/20 rounded-sm p-5 mt-2">
                <p className="text-[#C9A84C] text-xs font-bold tracking-widest uppercase mb-2">
                  Vous voulez rejoindre le VIP ?
                </p>
                <p className="text-[#555] text-sm mb-4">
                  La façon la plus rapide est de nous contacter directement sur Telegram.
                  On vous répond et on vous guide en quelques minutes.
                </p>
                <a
                  href="https://t.me/prognobeastfree"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#C41E3A] text-white text-xs font-bold tracking-widest uppercase px-5 py-2.5 rounded-sm hover:bg-[#E8274A] transition-colors"
                >
                  <Send size={12} />
                  Telegram VIP
                </a>
              </div>
            </div>

            {/* Right: form */}
            <div className="lg:col-span-2">
              <div className="glass-card border border-[#1a1a1a] rounded-sm p-8">
                <h2 className="text-white font-bold text-lg mb-1">Envoyer un message</h2>
                <p className="text-[#444] text-sm mb-8">
                  Remplissez le formulaire, on vous revient rapidement.
                </p>

                {/* Success state */}
                {status === "success" && (
                  <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 rounded-sm p-5 text-center">
                    <p className="text-emerald-400 font-semibold">Message envoyé ✓</p>
                    <p className="text-[#555] text-sm mt-1">On vous répond dans les meilleurs délais.</p>
                  </div>
                )}

                {/* Error state */}
                {status === "error" && (
                  <div className="mb-6 bg-[#C41E3A]/10 border border-[#C41E3A]/20 rounded-sm p-4">
                    <p className="text-[#C41E3A] text-sm">{errorMsg}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#555] text-xs font-semibold tracking-wider uppercase block mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Votre nom"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="text-[#555] text-xs font-semibold tracking-wider uppercase block mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="votre@email.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[#555] text-xs font-semibold tracking-wider uppercase block mb-2">
                      Sujet
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className={`${inputClass} appearance-none cursor-pointer`}
                    >
                      {subjects.map((s) => (
                        <option key={s} value={s} className="bg-[#111]">
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[#555] text-xs font-semibold tracking-wider uppercase block mb-2">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Votre message..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="flex items-center justify-center gap-2.5 bg-[#C41E3A] text-white text-sm font-bold tracking-widest uppercase px-8 py-4 rounded-sm hover:bg-[#E8274A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  >
                    {status === "loading" ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        Envoyer le message
                      </>
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
