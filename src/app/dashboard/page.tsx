"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  TrendingUp, TrendingDown, CheckCircle2, XCircle,
  Clock, LogOut, Trophy, Target, CalendarDays,
} from "lucide-react";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface Bet {
  id: string;
  sport: string;
  description: string;
  odds: number;
  unit: number;
  status: "PENDING" | "WON" | "LOST";
  createdAt: string;
  followed: boolean;
  userBetId: string | null;
  gainLoss: number | null;
}

interface Stats { total: number; count: number; }
interface PeriodStats { day: Stats; week: Stats; month: Stats; all: Stats; }

function computeStats(bets: Bet[]): PeriodStats {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay() || 7);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const calc = (from: Date) => {
    const filtered = bets.filter(b => b.followed && b.status !== "PENDING" && new Date(b.createdAt) >= from);
    const total = filtered.reduce((acc, b) => acc + (b.gainLoss ?? 0), 0);
    return { total: parseFloat(total.toFixed(2)), count: filtered.length };
  };
  return { day: calc(startOfDay), week: calc(startOfWeek), month: calc(startOfMonth), all: calc(new Date(0)) };
}

function StatCard({ label, stats, isTotal }: { label: string; stats: Stats; isTotal?: boolean }) {
  const isPos = stats.total > 0;
  const isNeg = stats.total < 0;
  const color = isPos ? "#16A34A" : isNeg ? "#DC2626" : "#6B7280";
  return (
    <div style={{
      background: isTotal ? "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)" : "white",
      borderRadius: "16px",
      padding: "20px",
      border: isTotal ? "none" : "1px solid #E5E7EB",
      boxShadow: isTotal ? "0 4px 24px rgba(37,99,235,0.25)" : "0 1px 3px rgba(0,0,0,0.06)",
      display: "flex", flexDirection: "column", gap: "8px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {isTotal && <Trophy size={13} style={{ color: "rgba(255,255,255,0.8)" }} />}
        <span style={{
          fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: isTotal ? "rgba(255,255,255,0.8)" : "#6B7280",
        }}>{label}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{
          fontSize: "26px", fontWeight: 800, lineHeight: 1,
          color: isTotal ? "white" : color,
        }}>
          {isPos ? "+" : ""}{stats.total}U
        </span>
        {!isTotal && isPos && <TrendingUp size={18} style={{ color }} />}
        {!isTotal && isNeg && <TrendingDown size={18} style={{ color }} />}
      </div>
      <span style={{ fontSize: "12px", color: isTotal ? "rgba(255,255,255,0.6)" : "#9CA3AF" }}>
        {stats.count} pari{stats.count > 1 ? "s" : ""} joué{stats.count > 1 ? "s" : ""}
      </span>
    </div>
  );
}

function BetCard({ bet, onToggleFollow }: { bet: Bet; onToggleFollow: (id: string, v: boolean) => void }) {
  const isPending = bet.status === "PENDING";
  const isWon = bet.status === "WON";
  const isLost = bet.status === "LOST";

  return (
    <div style={{
      background: "white",
      borderRadius: "16px",
      border: "1px solid #E5E7EB",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      overflow: "hidden",
    }}>
      {/* Top strip for WON/LOST */}
      {isWon && <div style={{ height: "3px", background: "linear-gradient(90deg, #16A34A, #4ADE80)" }} />}
      {isLost && <div style={{ height: "3px", background: "linear-gradient(90deg, #DC2626, #F87171)" }} />}
      {isPending && <div style={{ height: "3px", background: "linear-gradient(90deg, #2563EB, #60A5FA)" }} />}

      <div style={{ padding: "16px" }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "12px" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Badges */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
              <span style={{
                fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase", padding: "3px 10px", borderRadius: "999px",
                background: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE",
              }}>{bet.sport}</span>

              {isPending && <span style={{
                display: "flex", alignItems: "center", gap: "4px",
                fontSize: "10px", fontWeight: 600, padding: "3px 8px", borderRadius: "999px",
                background: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE",
              }}><Clock size={10} /> En attente</span>}
              {isWon && <span style={{
                display: "flex", alignItems: "center", gap: "4px",
                fontSize: "10px", fontWeight: 600, padding: "3px 8px", borderRadius: "999px",
                background: "#F0FDF4", color: "#16A34A", border: "1px solid #BBF7D0",
              }}><CheckCircle2 size={10} /> Gagnant</span>}
              {isLost && <span style={{
                display: "flex", alignItems: "center", gap: "4px",
                fontSize: "10px", fontWeight: 600, padding: "3px 8px", borderRadius: "999px",
                background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA",
              }}><XCircle size={10} /> Perdant</span>}
            </div>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#111827", lineHeight: 1.4 }}>
              {bet.description}
            </p>
          </div>

          {/* Cote + unité */}
          <div style={{
            background: "#F9FAFB", border: "1px solid #E5E7EB",
            borderRadius: "12px", padding: "8px 12px", textAlign: "center", flexShrink: 0,
          }}>
            <div style={{ fontSize: "18px", fontWeight: 800, color: "#111827", lineHeight: 1 }}>
              @{bet.odds}
            </div>
            <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "2px" }}>{bet.unit}U</div>
          </div>
        </div>

        {/* Footer row */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          paddingTop: "12px", borderTop: "1px solid #F3F4F6", flexWrap: "wrap", gap: "8px",
        }}>
          <span style={{ fontSize: "12px", color: "#9CA3AF" }}>
            {new Date(bet.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {!isPending && bet.followed && bet.gainLoss !== null && (
              <span style={{
                fontSize: "15px", fontWeight: 800,
                color: bet.gainLoss > 0 ? "#16A34A" : "#DC2626",
              }}>
                {bet.gainLoss > 0 ? "+" : ""}{bet.gainLoss}U
              </span>
            )}

            {isPending ? (
              <button onClick={() => onToggleFollow(bet.id, !bet.followed)} style={{
                display: "flex", alignItems: "center", gap: "6px",
                fontSize: "12px", fontWeight: 700, padding: "7px 14px",
                borderRadius: "999px", border: "none", cursor: "pointer",
                transition: "all 0.15s",
                background: bet.followed
                  ? "linear-gradient(135deg, #2563EB, #1D4ED8)"
                  : "#F3F4F6",
                color: bet.followed ? "white" : "#6B7280",
                boxShadow: bet.followed ? "0 2px 8px rgba(37,99,235,0.3)" : "none",
              }}>
                {bet.followed
                  ? <><CheckCircle2 size={13} /> Suivi</>
                  : <><Target size={13} /> Suivre</>
                }
              </button>
            ) : (
              <span style={{
                fontSize: "12px", fontWeight: 600, padding: "5px 12px", borderRadius: "999px",
                background: bet.followed ? "#EFF6FF" : "#F9FAFB",
                color: bet.followed ? "#2563EB" : "#9CA3AF",
                border: bet.followed ? "1px solid #BFDBFE" : "1px solid #E5E7EB",
              }}>
                {bet.followed ? "Suivi" : "Non suivi"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, token, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "settled">("all");

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
    if (!authLoading && user?.role === "ADMIN") router.replace("/admin");
  }, [user, authLoading, router]);

  const fetchBets = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/bets`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setBets(data.data);
    } catch { /* silent */ } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { if (token) fetchBets(); }, [token, fetchBets]);

  async function handleToggleFollow(betId: string, followed: boolean) {
    if (!token) return;
    setBets(prev => prev.map(b => b.id === betId ? { ...b, followed } : b));
    try {
      const res = await fetch(`${API_URL}/api/bets/${betId}/follow`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ followed }),
      });
      if (!res.ok) setBets(prev => prev.map(b => b.id === betId ? { ...b, followed: !followed } : b));
    } catch {
      setBets(prev => prev.map(b => b.id === betId ? { ...b, followed: !followed } : b));
    }
  }

  if (authLoading || (!user && !authLoading)) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F9FAFB" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid #2563EB", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
      </div>
    );
  }

  const stats = computeStats(bets);
  const filteredBets = bets.filter(b => {
    if (filter === "pending") return b.status === "PENDING";
    if (filter === "settled") return b.status !== "PENDING";
    return true;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB" }}>
      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid #E5E7EB", padding: "0 0 0 0" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "20px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Image src="/images/logo.png" alt="PrognoBeast" width={40} height={40}
                style={{ borderRadius: "10px", objectFit: "contain" }} />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <h1 style={{
                    fontFamily: "'Bebas Neue', Impact, sans-serif",
                    fontSize: "22px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#111827",
                  }}>Espace <span style={{
                    background: "linear-gradient(135deg, #2563EB, #60A5FA)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  }}>VIP</span></h1>
                  <span style={{
                    fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                    background: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE",
                    padding: "2px 8px", borderRadius: "999px",
                  }}>Membre</span>
                </div>
                <p style={{ fontSize: "13px", color: "#6B7280", marginTop: "1px" }}>
                  Bonjour {user?.firstName} 👋
                </p>
              </div>
            </div>
            <button onClick={() => { logout(); router.push("/"); }} style={{
              display: "flex", alignItems: "center", gap: "6px",
              fontSize: "13px", fontWeight: 500, color: "#6B7280",
              background: "none", border: "1px solid #E5E7EB", borderRadius: "10px",
              padding: "8px 14px", cursor: "pointer",
            }}>
              <LogOut size={14} /> <span style={{ display: "none" }} className="sm-show">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "24px 16px" }}>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", marginBottom: "24px" }}>
          <StatCard label="Aujourd'hui" stats={stats.day} />
          <StatCard label="Cette semaine" stats={stats.week} />
          <StatCard label="Ce mois" stats={stats.month} />
          <StatCard label="Total" stats={stats.all} isTotal />
        </div>

        {/* Filtres */}
        <div style={{
          display: "flex", gap: "8px", marginBottom: "20px",
          background: "white", borderRadius: "12px", padding: "6px",
          border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}>
          {([
            { key: "all", label: "Tous" },
            { key: "pending", label: "En attente" },
            { key: "settled", label: "Terminés" },
          ] as const).map(({ key, label }) => (
            <button key={key} onClick={() => setFilter(key)} style={{
              flex: 1, padding: "8px 4px", borderRadius: "8px", border: "none",
              fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
              background: filter === key ? "#2563EB" : "transparent",
              color: filter === key ? "white" : "#6B7280",
              boxShadow: filter === key ? "0 2px 8px rgba(37,99,235,0.3)" : "none",
            }}>{label}</button>
          ))}
        </div>

        {/* Liste paris */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", border: "3px solid #2563EB", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
          </div>
        ) : filteredBets.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "60px 20px",
            background: "white", borderRadius: "16px", border: "1px solid #E5E7EB",
          }}>
            <CalendarDays size={44} style={{ color: "#D1D5DB", margin: "0 auto 12px" }} />
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>
              Aucun pari pour le moment
            </p>
            <p style={{ fontSize: "13px", color: "#9CA3AF" }}>
              Les prochains pronostics apparaîtront ici.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filteredBets.map(bet => (
              <BetCard key={bet.id} bet={bet} onToggleFollow={handleToggleFollow} />
            ))}
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
