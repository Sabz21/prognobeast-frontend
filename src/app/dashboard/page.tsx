"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  TrendingUp, TrendingDown, Minus, CheckCircle2, XCircle,
  Clock, LogOut, Trophy, CalendarDays, Target,
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
    const filtered = bets.filter(
      (b) => b.followed && b.status !== "PENDING" && new Date(b.createdAt) >= from
    );
    const total = filtered.reduce((acc, b) => acc + (b.gainLoss ?? 0), 0);
    return { total: parseFloat(total.toFixed(2)), count: filtered.length };
  };

  return {
    day: calc(startOfDay),
    week: calc(startOfWeek),
    month: calc(startOfMonth),
    all: calc(new Date(0)),
  };
}

function StatCard({ label, stats, highlight }: { label: string; stats: Stats; highlight?: boolean }) {
  const isPos = stats.total > 0;
  const isNeg = stats.total < 0;
  return (
    <div className="bg-white rounded-xl p-4 border flex flex-col gap-2"
      style={{ borderColor: highlight ? "#BFDBFE" : "#E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <span className="text-xs font-semibold uppercase tracking-widest flex items-center gap-1"
        style={{ color: highlight ? "#2563EB" : "#6B7280" }}>
        {highlight && <Trophy size={11} />}{label}
      </span>
      <div className="flex items-end gap-1.5">
        <span className="text-2xl font-bold" style={{ color: isPos ? "#16A34A" : isNeg ? "#DC2626" : "#9CA3AF" }}>
          {isPos ? "+" : ""}{stats.total}U
        </span>
        {isPos && <TrendingUp size={16} style={{ color: "#16A34A", marginBottom: "4px" }} />}
        {isNeg && <TrendingDown size={16} style={{ color: "#DC2626", marginBottom: "4px" }} />}
        {!isPos && !isNeg && <Minus size={16} style={{ color: "#9CA3AF", marginBottom: "4px" }} />}
      </div>
      <span className="text-xs" style={{ color: "#9CA3AF" }}>{stats.count} pari(s) joués</span>
    </div>
  );
}

function BetCard({ bet, onToggleFollow }: { bet: Bet; onToggleFollow: (id: string, followed: boolean) => void }) {
  const isPending = bet.status === "PENDING";
  const isWon = bet.status === "WON";
  const isLost = bet.status === "LOST";

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded"
                style={{ color: "#2563EB", background: "#EFF6FF" }}>
                {bet.sport}
              </span>
              {isPending && (
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded"
                  style={{ color: "#D97706", background: "#FFFBEB" }}>
                  <Clock size={11} /> En attente
                </span>
              )}
              {isWon && (
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded"
                  style={{ color: "#16A34A", background: "#F0FDF4" }}>
                  <CheckCircle2 size={11} /> Gagnant
                </span>
              )}
              {isLost && (
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded"
                  style={{ color: "#DC2626", background: "#FEF2F2" }}>
                  <XCircle size={11} /> Perdant
                </span>
              )}
            </div>
            <p className="text-[#111827] text-sm font-medium leading-snug">{bet.description}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-lg font-bold text-[#111827]">@{bet.odds}</div>
            <div className="text-xs text-[#9CA3AF]">{bet.unit}U</div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#F3F4F6]">
          <span className="text-xs text-[#9CA3AF]">
            {new Date(bet.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
          </span>
          <div className="flex items-center gap-3">
            {!isPending && bet.followed && bet.gainLoss !== null && (
              <span className="text-sm font-bold" style={{ color: bet.gainLoss > 0 ? "#16A34A" : "#DC2626" }}>
                {bet.gainLoss > 0 ? "+" : ""}{bet.gainLoss}U
              </span>
            )}
            {isPending ? (
              <button onClick={() => onToggleFollow(bet.id, !bet.followed)}
                className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-lg transition-colors"
                style={bet.followed
                  ? { background: "#F0FDF4", color: "#16A34A", border: "1px solid #BBF7D0" }
                  : { background: "#F9FAFB", color: "#6B7280", border: "1px solid #E5E7EB" }}>
                {bet.followed ? <><CheckCircle2 size={12} /> Suivi</> : <><Target size={12} /> Pas suivi</>}
              </button>
            ) : (
              <span className="text-xs px-3 py-1.5 rounded-lg"
                style={bet.followed
                  ? { color: "#16A34A", background: "#F0FDF4", border: "1px solid #BBF7D0" }
                  : { color: "#9CA3AF", border: "1px solid #E5E7EB" }}>
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
    setBets((prev) => prev.map((b) => (b.id === betId ? { ...b, followed } : b)));
    try {
      const res = await fetch(`${API_URL}/api/bets/${betId}/follow`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ followed }),
      });
      if (!res.ok) setBets((prev) => prev.map((b) => (b.id === betId ? { ...b, followed: !followed } : b)));
    } catch {
      setBets((prev) => prev.map((b) => (b.id === betId ? { ...b, followed: !followed } : b)));
    }
  }

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F9FAFB" }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#2563EB", borderTopColor: "transparent" }} />
      </div>
    );
  }

  const stats = computeStats(bets);
  const filteredBets = bets.filter((b) => {
    if (filter === "pending") return b.status === "PENDING";
    if (filter === "settled") return b.status !== "PENDING";
    return true;
  });

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: "#F9FAFB" }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="PrognoBeast" width={36} height={36}
              className="rounded-lg" style={{ objectFit: "contain" }} />
            <div>
              <h1 className="text-lg font-bold text-[#111827]">Espace VIP</h1>
              <p className="text-sm" style={{ color: "#6B7280" }}>Bonjour {user?.firstName} 👋</p>
            </div>
          </div>
          <button onClick={() => { logout(); router.push("/"); }}
            className="flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#111827] transition-colors px-3 py-2 rounded-lg hover:bg-white">
            <LogOut size={14} /> Déconnexion
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <StatCard label="Aujourd'hui" stats={stats.day} />
          <StatCard label="Cette semaine" stats={stats.week} />
          <StatCard label="Ce mois" stats={stats.month} />
          <StatCard label="Total" stats={stats.all} highlight />
        </div>

        {/* Filtres */}
        <div className="flex gap-2 mb-5">
          {(["all", "pending", "settled"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className="text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-lg transition-colors"
              style={filter === f
                ? { background: "#2563EB", color: "white" }
                : { background: "white", color: "#6B7280", border: "1px solid #E5E7EB" }}>
              {f === "all" ? "Tous" : f === "pending" ? "En attente" : "Terminés"}
            </button>
          ))}
        </div>

        {/* Paris */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: "#2563EB", borderTopColor: "transparent" }} />
          </div>
        ) : filteredBets.length === 0 ? (
          <div className="text-center py-16">
            <CalendarDays size={40} className="mx-auto mb-3" style={{ color: "#D1D5DB" }} />
            <p className="text-[#6B7280] text-sm">Aucun pari pour le moment.</p>
            <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>Les prochains pronostics apparaîtront ici.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBets.map((bet) => (
              <BetCard key={bet.id} bet={bet} onToggleFollow={handleToggleFollow} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
