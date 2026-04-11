"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, UserPlus, CheckCircle, AlertCircle } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création du compte.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: "#F9FAFB" }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Image src="/images/logo.png" alt="PrognoBeast" width={56} height={56}
            className="rounded-xl mb-3" style={{ objectFit: "contain" }} />
          <h1 className="text-3xl tracking-widest text-[#111827] uppercase"
            style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}>
            Progno<span style={{ color: "#2563EB" }}>Beast</span>
          </h1>
          <p style={{ color: "#6B7280", fontSize: "14px", marginTop: "4px" }}>Accès membres VIP</p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-[#E5E7EB]"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)" }}>

          {success ? (
            <div className="text-center py-4">
              <CheckCircle size={48} className="mx-auto mb-4" style={{ color: "#16A34A" }} />
              <h2 className="text-xl font-bold text-[#111827] mb-3">Demande envoyée !</h2>
              <p className="text-[#6B7280] text-sm leading-relaxed mb-6">
                Votre compte a été créé. L&apos;administrateur va vérifier votre abonnement VIP et activer votre accès très prochainement.
              </p>
              <Link href="/login"
                className="inline-block text-white font-semibold text-sm px-6 py-3 rounded-lg"
                style={{ background: "#2563EB" }}>
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-[#111827] mb-2 flex items-center gap-2">
                <UserPlus size={20} style={{ color: "#2563EB" }} />
                Créer un compte
              </h2>

              <div className="mb-5 flex gap-2.5 p-3 rounded-lg" style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
                <AlertCircle size={16} style={{ color: "#2563EB", flexShrink: 0, marginTop: "2px" }} />
                <p className="text-xs leading-relaxed" style={{ color: "#1D4ED8" }}>
                  <strong>Important :</strong> utilisez l&apos;adresse email avec laquelle vous avez pris votre abonnement VIP. Votre accès sera activé après vérification.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626" }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[["firstName", "Prénom", "Jean"], ["lastName", "Nom", "Dupont"]].map(([field, label, placeholder]) => (
                    <div key={field}>
                      <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-2">{label}</label>
                      <input type="text" value={form[field as keyof typeof form]} onChange={set(field)}
                        placeholder={placeholder} required
                        className="w-full rounded-lg px-3 py-3 text-sm text-[#111827] placeholder-[#9CA3AF] outline-none"
                        style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}
                        onFocus={e => (e.currentTarget.style.borderColor = "#2563EB")}
                        onBlur={e => (e.currentTarget.style.borderColor = "#E5E7EB")} />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-2">Adresse email</label>
                  <input type="email" value={form.email} onChange={set("email")}
                    placeholder="vous@exemple.com" required
                    className="w-full rounded-lg px-4 py-3 text-sm text-[#111827] placeholder-[#9CA3AF] outline-none"
                    style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}
                    onFocus={e => (e.currentTarget.style.borderColor = "#2563EB")}
                    onBlur={e => (e.currentTarget.style.borderColor = "#E5E7EB")} />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-2">
                    Mot de passe <span className="text-[#9CA3AF] normal-case font-normal tracking-normal">(8 car. min.)</span>
                  </label>
                  <div className="relative">
                    <input type={showPwd ? "text" : "password"} value={form.password} onChange={set("password")}
                      placeholder="••••••••" required minLength={8}
                      className="w-full rounded-lg px-4 py-3 pr-11 text-sm text-[#111827] placeholder-[#9CA3AF] outline-none"
                      style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}
                      onFocus={e => (e.currentTarget.style.borderColor = "#2563EB")}
                      onBlur={e => (e.currentTarget.style.borderColor = "#E5E7EB")} />
                    <button type="button" onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors">
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full text-white font-semibold text-sm py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  style={{ background: loading ? "#93C5FD" : "#2563EB" }}>
                  {loading ? "Création…" : "Créer mon compte"}
                </button>
              </form>

              <p className="text-center text-sm text-[#6B7280] mt-6">
                Déjà un compte ?{" "}
                <Link href="/login" className="font-semibold" style={{ color: "#2563EB" }}>Se connecter</Link>
              </p>
            </>
          )}
        </div>

        <p className="text-center text-xs text-[#9CA3AF] mt-6">
          Retour à <Link href="/" className="text-[#6B7280] hover:text-[#111827] transition-colors">l&apos;accueil</Link>
        </p>
      </div>
    </div>
  );
}
