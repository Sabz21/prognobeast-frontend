"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirection si déjà connecté
  if (user) {
    if (user.role === "ADMIN") router.replace("/admin");
    else router.replace("/dashboard");
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
      // Après login, redirection selon le rôle
      const stored = localStorage.getItem("pb_token");
      if (stored) {
        // On laisse le context updater et on redirige
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/auth/me`,
          { headers: { Authorization: `Bearer ${stored}` } }
        );
        const data = await res.json();
        if (data.data?.role === "ADMIN") router.push("/admin");
        else router.push("/dashboard");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      {/* Glow de fond */}
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
          <p className="text-[#6B6B6B] text-sm mt-1 tracking-wide">Espace membres VIP</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 border border-[#1F1F1F]">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <LogIn size={20} className="text-[#FF5C00]" />
            Connexion
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest mb-2">
                Adresse email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                required
                className="w-full bg-[#111111] border border-[#2A2A2A] rounded-lg px-4 py-3 text-white placeholder-[#444] text-sm focus:outline-none focus:border-[#FF5C00] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
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
              {loading ? "Connexion…" : "Se connecter"}
            </button>
          </form>

          <p className="text-center text-sm text-[#6B6B6B] mt-6">
            Pas encore de compte ?{" "}
            <Link href="/register" className="text-[#FF5C00] hover:text-[#FF7A2E] font-semibold transition-colors">
              Créer un compte
            </Link>
          </p>
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
