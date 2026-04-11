"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { Zap, Eye, EyeOff, UserPlus, CheckCircle, AlertCircle } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 pb-10">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF5C00]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#FF5C00] rounded-xl flex items-center justify-center mb-4">
            <Zap size={22} className="text-white" fill="white" />
          </div>
          <h1
            className="text-4xl font-display text-white tracking-widest uppercase"
            style={{ fontFamily: "'Bebas Neue',Impact,sans-serif" }}
          >
            Progno<span className="text-[#FF5C00]">Beast</span>
          </h1>
          <p className="text-[#6B6B6B] text-sm mt-1 tracking-wide">Accès membres VIP</p>
        </div>

        <div className="glass rounded-2xl p-8 border border-[#1F1F1F]">
          {success ? (
            <div className="text-center py-4">
              <CheckCircle size={48} className="text-emerald-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-3">Demande envoyée !</h2>
              <p className="text-[#6B6B6B] text-sm leading-relaxed mb-6">
                Votre compte a été créé. L&apos;administrateur va vérifier votre abonnement VIP et activer votre accès très prochainement.
              </p>
              <Link
                href="/login"
                className="inline-block btn-shimmer text-white font-bold tracking-[0.1em] uppercase text-sm px-6 py-3 rounded-lg"
              >
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <UserPlus size={20} className="text-[#FF5C00]" />
                Créer un compte
              </h2>

              {/* Message important */}
              <div className="mb-5 flex gap-2.5 p-3 rounded-lg bg-[#FF5C00]/10 border border-[#FF5C00]/20">
                <AlertCircle size={16} className="text-[#FF5C00] shrink-0 mt-0.5" />
                <p className="text-xs text-[#FF7A2E] leading-relaxed">
                  <strong>Important :</strong> utilisez l&apos;adresse email avec laquelle vous avez pris votre abonnement VIP. Votre accès sera activé après vérification.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={set("firstName")}
                      placeholder="Jean"
                      required
                      className="w-full bg-[#111111] border border-[#2A2A2A] rounded-lg px-3 py-3 text-white placeholder-[#444] text-sm focus:outline-none focus:border-[#FF5C00] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={set("lastName")}
                      placeholder="Dupont"
                      required
                      className="w-full bg-[#111111] border border-[#2A2A2A] rounded-lg px-3 py-3 text-white placeholder-[#444] text-sm focus:outline-none focus:border-[#FF5C00] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest mb-2">
                    Adresse email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="vous@exemple.com"
                    required
                    className="w-full bg-[#111111] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white placeholder-[#444] text-sm focus:outline-none focus:border-[#FF5C00] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest mb-2">
                    Mot de passe
                    <span className="ml-2 text-[#444] normal-case font-normal tracking-normal">
                      (8 caractères min.)
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPwd ? "text" : "password"}
                      value={form.password}
                      onChange={set("password")}
                      placeholder="••••••••"
                      required
                      minLength={8}
                      className="w-full bg-[#111111] border border-[#2A2A2A] rounded-lg px-4 py-3 pr-11 text-white placeholder-[#444] text-sm focus:outline-none focus:border-[#FF5C00] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-white transition-colors"
                    >
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-shimmer text-white font-bold tracking-[0.1em] uppercase text-sm py-3.5 rounded-lg transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
                >
                  {loading ? "Création…" : "Créer mon compte"}
                </button>
              </form>

              <p className="text-center text-sm text-[#6B6B6B] mt-6">
                Déjà un compte ?{" "}
                <Link href="/login" className="text-[#FF5C00] hover:text-[#FF7A2E] font-semibold transition-colors">
                  Se connecter
                </Link>
              </p>
            </>
          )}
        </div>

        <p className="text-center text-xs text-[#444] mt-6">
          Retour à{" "}
          <Link href="/" className="text-[#6B6B6B] hover:text-white transition-colors">
            l&apos;accueil
          </Link>
        </p>
      </div>
    </div>
  );
}
