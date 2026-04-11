"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (user) {
    router.replace(user.role === "ADMIN" ? "/admin" : "/dashboard");
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
      const token = localStorage.getItem("pb_token");
      if (token) {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        router.push(data.data?.role === "ADMIN" ? "/admin" : "/dashboard");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur de connexion.");
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
          <p style={{ color: "#6B7280", fontSize: "14px", marginTop: "4px" }}>Espace membres VIP</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8 border border-[#E5E7EB]" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)" }}>
          <h2 className="text-xl font-bold text-[#111827] mb-6 flex items-center gap-2">
            <LogIn size={20} style={{ color: "#2563EB" }} />
            Connexion
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-2">
                Adresse email
              </label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com" required
                className="w-full rounded-lg px-4 py-3 text-sm text-[#111827] placeholder-[#9CA3AF] outline-none transition-colors"
                style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}
                onFocus={e => (e.currentTarget.style.borderColor = "#2563EB")}
                onBlur={e => (e.currentTarget.style.borderColor = "#E5E7EB")} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input type={showPwd ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  className="w-full rounded-lg px-4 py-3 pr-11 text-sm text-[#111827] placeholder-[#9CA3AF] outline-none transition-colors"
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
              {loading ? "Connexion…" : "Se connecter"}
            </button>
          </form>

          <p className="text-center text-sm text-[#6B7280] mt-6">
            Pas encore de compte ?{" "}
            <Link href="/register" className="font-semibold" style={{ color: "#2563EB" }}>
              Créer un compte
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-[#9CA3AF] mt-6">
          Retour à{" "}
          <Link href="/" className="text-[#6B7280] hover:text-[#111827] transition-colors">
            l&apos;accueil
          </Link>
        </p>
      </div>
    </div>
  );
}
