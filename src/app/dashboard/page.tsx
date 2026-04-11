"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  XCircle,
  Clock,
  LogOut,
  Zap,
  Trophy,
  CalendarDays,
  Target,
} from "lucide-react";

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

interface Stats {
  total: number;
  count: number;
}

interface PeriodStats {
  day: Stats;
  week: Stats;
  month: Stats;
  all: Stats;
}

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

function StatCard({ label, stats }: { label: string; stats: Stats }) {
  const isPositive = stats.total > 0;
  const isNegative = stats.total < 0;

  return (
    <div className="glass rounded-xl p-4 border border-[#1F1F1F] flex flex-col gap-2">
      <span className="text-xs text-[#6B6B6B] font-semibold uppercase tracking-widest">{label}</span>
      <div className="flex items-end gap-2">
        <span
          className={`text-2xl font-bold ${
            isPositive ? "text-emerald-400" : isNegative ? "text-red-400" : "text-[#6B6B6B]"
          }`}
        >
          {isPositive ? "+" : ""}
          {stats.total}U
        </span>
        {isPositive && <TrendingUp size={16} className="text-emerald-400 mb-1" />}
        {isNegative && <TrendingDown size={16} className="text-red-400 mb-1" />}
        {!isPositive && !isNegative && <Minus size={16} className="text-[#6B6B6B] mb-1" />}
      </div>
      <span className="text-xs text-[#444]">{stats.count} pari(s) joués</span>
    </div>
  );
}

function BetCard({ bet, onToggleFollow }: { bet: Bet; onToggleFollow: (id: string, followed: boolean) => void }) {
  const isPending = bet.status === "PENDING";
  const isWon = bet.status === "WON";
  const isLost = bet.status === "LOST";

  return (
    <div className="glass rounded-xl border border-[#1F1F1F] overflow-hidden">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-bold text-[#FF5C00] uppercase tracking-widest bg-[#FF5C00]/10 px-2 py-0.5 rounded">
                {bet.sport}
              </span>
              {isPending && (
                <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                  <Clock size={11} />
                  En attente
                </span>
              )}
              {isWon && (
                <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                  <CheckCircle2 size={11} />
                  Gagnant
                </span>
              )}
              {isLost && (
                <span className="flex items-center gap-1 text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded">
                  <XCircle size={11} />
                  Perdant
                </span>
              )}
            </div>
            <p className="text-white text-sm font-medium leading-snug">{bet.description}</p>
          </div>

          {/* Cote & Unité */}
          <div className="text-right shrink-0">
            <div className="text-lg font-bold text-white">@{bet.odds}</div>
            <div className="text-xs text-[#6B6B6B]">{bet.unit}U</div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#1F1F1F]">
          <span className="text-xs text-[#444]">
            {new Date(bet.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>

          <div className="flex items-center gap-3">
            {/* Gain/Perte affiché si résultat connu et suivi */}
            {!isPending && bet.followed && bet.gainLoss !== null && (
              <span
                className={`text-sm font-bold ${
                  bet.gainLoss > 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {bet.gainLoss > 0 ? "+" : ""}
                {bet.gainLoss}U
              </span>
            )}

            {/* Toggle suivi */}
            {isPending ? (
              <button
                onClick={() => onToggleFollow(bet.id, !bet.followed)}
                className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all ${
                  bet.followed
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                    : "bg-[#1F1F1F] text-[#6B6B6B] border border-[#2A2A2A] hover:border-[#FF5C00]/50 hover:text-white"
                }`}
              >
                {bet.followed ? (
                  <>
                    <CheckCircle2 size={12} />
                    Suivi
                  </>
                ) : (
                  <>
                    <Target size={12} />
                    Pas suivi
                  </>
                )}
              </button>
            ) : (
              <span
                className={`text-xs px-3 py-1.5 rounded-lg border ${
                  bet.followed
                    ? "border-emerald-500/20 text-emerald-400/60 bg-emerald-500/5"
                    : "border-[#1F1F1F] text-[#444]"
                }`}
              >
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
    if (!authLoading && !user) {
      router.replace("/login");
    }
    if (!authLoading && user?.role === "ADMIN") {
      router.replace("/admin");
    }
  }, [user, authLoading, router]);

  const fetchBets = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/bets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setBets(data.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchBets();
  }, [token, fetchBets]);

  async function handleToggleFollow(betId: string, followed: boolean) {
    if (!token) return;
    // Optimistic update
    setBets((prev) =>
      prev.map((b) => (b.id === betId ? { ...b, followed } : b))
    );
    try {
      const res = await fetch(`${API_URL}/api/bets/${betId}/follow`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ followed }),
      });
      if (!res.ok) {
        // Revert on error
        setBets((prev) => prev.map((b) => (b.id === betId ? { ...b, followed: !followed } : b)));
      }
    } catch {
      setBets((prev) => prev.map((b) => (b.id === betId ? { ...b, followed: !followed } : b)));
    }
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FF5C00] border-t-transparent rounded-full animate-spin" />
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
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 bg-[#FF5C00] rounded flex items-center justify-center">
                <Zap size={12} className="text-white" fill="white" />
              </div>
              <span
                className="text-lg font-display tracking-widest uppercase text-white"
                style={{ fontFamily: "'Bebas Neue',Impact,sans-serif" }}
              >
                Espace VIP
              </span>
            </div>
            <p className="text-[#6B6B6B] text-sm">
              Bonjour {user?.firstName} 👋
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-[#6B6B6B] hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-[#111]"
          >
            <LogOut size={14} />
            Déconnexion
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <StatCard label="Aujourd'hui" stats={stats.day} />
          <StatCard label="Cette semaine" stats={stats.week} />
          <StatCard label="Ce mois" stats={stats.month} />
          <div className="glass rounded-xl p-4 border border-[#FF5C00]/20 flex flex-col gap-2">
            <span className="text-xs text-[#FF5C00] font-semibold uppercase tracking-widest flex items-center gap-1">
              <Trophy size={11} />
              Total
            </span>
            <span
              className={`text-2xl font-bold ${
                stats.all.total > 0
                  ? "text-emerald-400"
                  : stats.all.total < 0
                  ? "text-red-400"
                  : "text-[#6B6B6B]"
              }`}
            >
              {stats.all.total > 0 ? "+" : ""}
              {stats.all.total}U
            </span>
            <span className="text-xs text-[#444]">{stats.all.count} pari(s)</span>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex gap-2 mb-5">
          {(["all", "pending", "settled"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-lg transition-all ${
                filter === f
                  ? "bg-[#FF5C00] text-white"
                  : "bg-[#111] text-[#6B6B6B] hover:text-white border border-[#1F1F1F]"
              }`}
            >
              {f === "all" ? "Tous" : f === "pending" ? "En attente" : "Terminés"}
            </button>
          ))}
        </div>

        {/* Liste des paris */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#FF5C00] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredBets.length === 0 ? (
          <div className="text-center py-16">
            <CalendarDays size={40} className="text-[#2A2A2A] mx-auto mb-3" />
            <p className="text-[#6B6B6B] text-sm">Aucun pari pour le moment.</p>
            <p className="text-[#444] text-xs mt-1">Les prochains pronostics apparaîtront ici.</p>
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
