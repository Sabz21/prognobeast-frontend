"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  TrendingUp, TrendingDown, CheckCircle2, XCircle,
  Clock, LogOut, Trophy, Target, CalendarDays, ChevronLeft, ChevronRight,
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

function toDateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function computeStats(bets: Bet[]): PeriodStats {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfDay.getDate() - (startOfDay.getDay() || 7) + 1);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const calc = (from: Date, to?: Date) => {
    const filtered = bets.filter(b => {
      const d = new Date(b.createdAt);
      return b.followed && b.status !== "PENDING" && d >= from && (to ? d < to : true);
    });
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

// Gain/perte pour un jour donné (key = "YYYY-MM-DD")
function dayStats(bets: Bet[], key: string): { total: number; hasBets: boolean; hasPending: boolean } {
  const dayBets = bets.filter(b => toDateKey(new Date(b.createdAt)) === key);
  const hasBets = dayBets.length > 0;
  const hasPending = dayBets.some(b => b.status === "PENDING");
  const settled = dayBets.filter(b => b.followed && b.status !== "PENDING");
  const total = parseFloat(settled.reduce((acc, b) => acc + (b.gainLoss ?? 0), 0).toFixed(2));
  return { total, hasBets, hasPending };
}

function StatCard({ label, stats, isTotal }: { label: string; stats: Stats; isTotal?: boolean }) {
  const isPos = stats.total > 0;
  const isNeg = stats.total < 0;
  const color = isPos ? "#16A34A" : isNeg ? "#DC2626" : "#6B7280";
  return (
    <div style={{
      background: isTotal ? "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)" : "white",
      borderRadius: "16px", padding: "20px",
      border: isTotal ? "none" : "1px solid #E5E7EB",
      boxShadow: isTotal ? "0 4px 24px rgba(37,99,235,0.25)" : "0 1px 3px rgba(0,0,0,0.06)",
      display: "flex", flexDirection: "column", gap: "8px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {isTotal && <Trophy size={13} style={{ color: "rgba(255,255,255,0.8)" }} />}
        <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: isTotal ? "rgba(255,255,255,0.8)" : "#6B7280" }}>{label}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ fontSize: "26px", fontWeight: 800, lineHeight: 1, color: isTotal ? "white" : color }}>
          {isPos ? "+" : ""}{stats.total}U
        </span>
        {!isTotal && isPos && <TrendingUp size={18} style={{ color }} />}
        {!isTotal && isNeg && <TrendingDown size={18} style={{ color }} />}
      </div>
      <span style={{ fontSize: "12px", color: isTotal ? "rgba(255,255,255,0.6)" : "#9CA3AF" }}>
        {stats.count} pari{stats.count !== 1 ? "s" : ""} joué{stats.count !== 1 ? "s" : ""}
      </span>
    </div>
  );
}

function Calendar({
  bets, selectedDay, onSelectDay,
}: { bets: Bet[]; selectedDay: string | null; onSelectDay: (key: string | null) => void }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1);
  const lastDay = new Date(viewYear, viewMonth + 1, 0);
  // Start on Monday
  let startDow = firstDay.getDay(); // 0=Sun
  startDow = startDow === 0 ? 6 : startDow - 1;
  const days: (Date | null)[] = Array(startDow).fill(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(viewYear, viewMonth, d));
  while (days.length % 7 !== 0) days.push(null);

  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  const todayKey = toDateKey(today);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  return (
    <div style={{ background: "white", borderRadius: "16px", border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden", marginBottom: "20px" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={prevMonth} style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "8px", padding: "6px", cursor: "pointer", display: "flex" }}>
          <ChevronLeft size={16} style={{ color: "#6B7280" }} />
        </button>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: "20px", letterSpacing: "0.06em", color: "#111827" }}>
            {monthNames[viewMonth]} {viewYear}
          </span>
          {selectedDay && (
            <button onClick={() => onSelectDay(null)} style={{ display: "block", margin: "2px auto 0", fontSize: "11px", color: "#2563EB", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
              Voir tous les paris
            </button>
          )}
        </div>
        <button onClick={nextMonth} style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "8px", padding: "6px", cursor: "pointer", display: "flex" }}>
          <ChevronRight size={16} style={{ color: "#6B7280" }} />
        </button>
      </div>

      {/* Day labels */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "8px 12px 4px", gap: "2px" }}>
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: "10px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", padding: "4px 0" }}>{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "0 12px 12px", gap: "4px" }}>
        {days.map((date, i) => {
          if (!date) return <div key={i} />;
          const key = toDateKey(date);
          const { total, hasBets, hasPending } = dayStats(bets, key);
          const isToday = key === todayKey;
          const isSelected = key === selectedDay;
          const isFuture = date > today;
          const isPos = total > 0;
          const isNeg = total < 0;

          return (
            <button key={key} onClick={() => onSelectDay(isSelected ? null : key)}
              disabled={isFuture && !hasBets}
              style={{
                borderRadius: "10px", border: "none", cursor: "pointer",
                padding: "6px 2px", display: "flex", flexDirection: "column",
                alignItems: "center", gap: "2px", transition: "all 0.15s",
                background: isSelected
                  ? "linear-gradient(135deg, #2563EB, #1D4ED8)"
                  : isToday
                  ? "#EFF6FF"
                  : "transparent",
                boxShadow: isSelected ? "0 2px 8px rgba(37,99,235,0.3)" : "none",
              }}>
              {/* Day number */}
              <span style={{
                fontSize: "13px", fontWeight: isToday || isSelected ? 800 : 500,
                color: isSelected ? "white" : isToday ? "#2563EB" : isFuture ? "#D1D5DB" : "#374151",
                lineHeight: 1,
              }}>{date.getDate()}</span>

              {/* Performance badge */}
              {hasBets && (
                hasPending && !isPos && !isNeg ? (
                  <span style={{ fontSize: "9px", fontWeight: 700, color: isSelected ? "rgba(255,255,255,0.8)" : "#2563EB", lineHeight: 1 }}>•</span>
                ) : (isPos || isNeg) ? (
                  <span style={{
                    fontSize: "9px", fontWeight: 800, lineHeight: 1,
                    color: isSelected ? "white" : isPos ? "#16A34A" : "#DC2626",
                    background: isSelected ? "rgba(255,255,255,0.2)" : isPos ? "#F0FDF4" : "#FEF2F2",
                    padding: "1px 4px", borderRadius: "4px",
                  }}>
                    {isPos ? "+" : ""}{total}U
                  </span>
                ) : (
                  <span style={{ fontSize: "9px", fontWeight: 700, color: isSelected ? "rgba(255,255,255,0.8)" : "#9CA3AF", lineHeight: 1 }}>—</span>
                )
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BetCard({ bet, onToggleFollow }: { bet: Bet; onToggleFollow: (id: string, v: boolean) => void }) {
  const isPending = bet.status === "PENDING";
  const isWon = bet.status === "WON";
  const isLost = bet.status === "LOST";

  return (
    <div style={{ background: "white", borderRadius: "16px", border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
      {isWon && <div style={{ height: "3px", background: "linear-gradient(90deg, #16A34A, #4ADE80)" }} />}
      {isLost && <div style={{ height: "3px", background: "linear-gradient(90deg, #DC2626, #F87171)" }} />}
      {isPending && <div style={{ height: "3px", background: "linear-gradient(90deg, #2563EB, #60A5FA)" }} />}

      <div style={{ padding: "16px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "12px" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
              <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 10px", borderRadius: "999px", background: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE" }}>{bet.sport}</span>
              {isPending && <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: 600, padding: "3px 8px", borderRadius: "999px", background: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE" }}><Clock size={10} /> En attente</span>}
              {isWon && <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: 600, padding: "3px 8px", borderRadius: "999px", background: "#F0FDF4", color: "#16A34A", border: "1px solid #BBF7D0" }}><CheckCircle2 size={10} /> Gagnant</span>}
              {isLost && <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: 600, padding: "3px 8px", borderRadius: "999px", background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}><XCircle size={10} /> Perdant</span>}
            </div>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#111827", lineHeight: 1.4 }}>{bet.description}</p>
          </div>
          <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "8px 12px", textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: "18px", fontWeight: 800, color: "#111827", lineHeight: 1 }}>@{bet.odds}</div>
            <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "2px" }}>{bet.unit}U</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid #F3F4F6", flexWrap: "wrap", gap: "8px" }}>
          <span style={{ fontSize: "12px", color: "#9CA3AF" }}>
            {new Date(bet.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {!isPending && bet.followed && bet.gainLoss !== null && (
              <span style={{ fontSize: "15px", fontWeight: 800, color: bet.gainLoss > 0 ? "#16A34A" : "#DC2626" }}>
                {bet.gainLoss > 0 ? "+" : ""}{bet.gainLoss}U
              </span>
            )}
            <button onClick={() => onToggleFollow(bet.id, !bet.followed)} style={{
              display: "flex", alignItems: "center", gap: "6px",
              fontSize: "12px", fontWeight: 700, padding: "7px 14px",
              borderRadius: "999px", border: "none", cursor: "pointer", transition: "all 0.15s",
              background: bet.followed ? "linear-gradient(135deg, #2563EB, #1D4ED8)" : "#F3F4F6",
              color: bet.followed ? "white" : "#6B7280",
              boxShadow: bet.followed ? "0 2px 8px rgba(37,99,235,0.3)" : "none",
            }}>
              {bet.followed ? <><CheckCircle2 size={13} /> Suivi</> : <><Target size={13} /> Suivre</>}
            </button>
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
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

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
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const stats = computeStats(bets);

  // Si un jour est sélectionné, on filtre par jour — sinon on applique le filtre normal
  const filteredBets = selectedDay
    ? bets.filter(b => {
        const key = toDateKey(new Date(b.createdAt));
        if (key !== selectedDay) return false;
        if (filter === "pending") return b.status === "PENDING";
        if (filter === "settled") return b.status !== "PENDING";
        return true;
      })
    : bets.filter(b => {
        if (filter === "pending") return b.status === "PENDING";
        if (filter === "settled") return b.status !== "PENDING";
        return true;
      });

  // Résumé du jour sélectionné
  const selectedDayStats = selectedDay ? dayStats(bets, selectedDay) : null;

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "20px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Image src="/images/logo.png" alt="PrognoBeast" width={40} height={40} style={{ borderRadius: "10px", objectFit: "contain" }} />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <h1 style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: "22px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#111827" }}>
                    Espace <span style={{ background: "linear-gradient(135deg, #2563EB, #60A5FA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>VIP</span>
                  </h1>
                  <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", background: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE", padding: "2px 8px", borderRadius: "999px" }}>Membre</span>
                </div>
                <p style={{ fontSize: "13px", color: "#6B7280", marginTop: "1px" }}>Bonjour {user?.firstName} 👋</p>
              </div>
            </div>
            <button onClick={() => { logout(); router.push("/"); }} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 500, color: "#6B7280", background: "none", border: "1px solid #E5E7EB", borderRadius: "10px", padding: "8px 14px", cursor: "pointer" }}>
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "24px 16px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", marginBottom: "24px" }}>
          <StatCard label="Aujourd'hui" stats={stats.day} />
          <StatCard label="Cette semaine" stats={stats.week} />
          <StatCard label="Ce mois" stats={stats.month} />
          <StatCard label="Total" stats={stats.all} isTotal />
        </div>

        {/* Calendrier */}
        <Calendar bets={bets} selectedDay={selectedDay} onSelectDay={setSelectedDay} />

        {/* Bandeau jour sélectionné */}
        {selectedDay && selectedDayStats && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "white", borderRadius: "12px", padding: "12px 16px",
            border: "1px solid #BFDBFE", marginBottom: "16px",
            boxShadow: "0 2px 8px rgba(37,99,235,0.08)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <CalendarDays size={16} style={{ color: "#2563EB" }} />
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>
                {new Date(selectedDay + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {selectedDayStats.hasPending && (
                <span style={{ fontSize: "12px", color: "#2563EB", fontWeight: 600 }}>En cours…</span>
              )}
              {(selectedDayStats.total !== 0) && (
                <span style={{
                  fontSize: "16px", fontWeight: 800,
                  color: selectedDayStats.total > 0 ? "#16A34A" : "#DC2626",
                }}>
                  {selectedDayStats.total > 0 ? "+" : ""}{selectedDayStats.total}U
                </span>
              )}
              {selectedDayStats.total === 0 && !selectedDayStats.hasPending && (
                <span style={{ fontSize: "13px", color: "#9CA3AF", fontWeight: 600 }}>0U</span>
              )}
            </div>
          </div>
        )}

        {/* Filtres */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", background: "white", borderRadius: "12px", padding: "6px", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
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
          <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: "16px", border: "1px solid #E5E7EB" }}>
            <CalendarDays size={44} style={{ color: "#D1D5DB", margin: "0 auto 12px" }} />
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#374151", marginBottom: "4px" }}>
              {selectedDay ? "Aucun pari ce jour-là" : "Aucun pari pour le moment"}
            </p>
            <p style={{ fontSize: "13px", color: "#9CA3AF" }}>
              {selectedDay ? "Sélectionne un autre jour ou clique sur « Voir tous les paris »." : "Les prochains pronostics apparaîtront ici."}
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
    </div>
  );
}
