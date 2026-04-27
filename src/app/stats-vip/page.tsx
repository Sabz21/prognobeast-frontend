"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp, TrendingDown, Trophy, ChevronLeft, ChevronRight, CalendarDays,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface BetEntry {
  createdAt: string;
  status: "WON" | "LOST";
  gainLoss: number;
}

function toDateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function computePeriods(bets: BetEntry[]) {
  const now = new Date();
  const sd = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sw = new Date(sd); sw.setDate(sd.getDate() - (sd.getDay() || 7) + 1);
  const sm = new Date(now.getFullYear(), now.getMonth(), 1);

  function calc(from: Date) {
    const filtered = bets.filter(b => new Date(b.createdAt) >= from);
    const total = parseFloat(filtered.reduce((acc, b) => acc + b.gainLoss, 0).toFixed(2));
    const won = filtered.filter(b => b.status === "WON").length;
    return { total, count: filtered.length, won };
  }

  return {
    day: calc(sd),
    week: calc(sw),
    month: calc(sm),
    all: calc(new Date(0)),
  };
}

function StatCard({ label, data, isTotal }: { label: string; data: { total: number; count: number; won: number }; isTotal?: boolean }) {
  const isPos = data.total > 0;
  const isNeg = data.total < 0;
  const color = isPos ? "#16A34A" : isNeg ? "#DC2626" : "#6B7280";
  const winRate = data.count > 0 ? Math.round((data.won / data.count) * 100) : null;

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
          {isPos ? "+" : ""}{data.total}U
        </span>
        {!isTotal && isPos && <TrendingUp size={18} style={{ color }} />}
        {!isTotal && isNeg && <TrendingDown size={18} style={{ color }} />}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "12px", color: isTotal ? "rgba(255,255,255,0.6)" : "#9CA3AF" }}>
          {data.count} pari{data.count !== 1 ? "s" : ""} joué{data.count !== 1 ? "s" : ""}
        </span>
        {winRate !== null && (
          <span style={{ fontSize: "11px", fontWeight: 700, color: isTotal ? "rgba(255,255,255,0.7)" : "#6B7280" }}>
            {winRate}% win
          </span>
        )}
      </div>
    </div>
  );
}

function Calendar({ bets }: { bets: BetEntry[] }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1);
  const lastDay = new Date(viewYear, viewMonth + 1, 0);
  let startDow = firstDay.getDay();
  startDow = startDow === 0 ? 6 : startDow - 1;
  const days: (Date | null)[] = Array(startDow).fill(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(viewYear, viewMonth, d));
  while (days.length % 7 !== 0) days.push(null);

  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  const todayKey = toDateKey(today);

  // Build day map
  const dayMap: Record<string, { total: number; hasBets: boolean }> = {};
  for (const b of bets) {
    const key = toDateKey(new Date(b.createdAt));
    if (!dayMap[key]) dayMap[key] = { total: 0, hasBets: false };
    dayMap[key].total = parseFloat((dayMap[key].total + b.gainLoss).toFixed(2));
    dayMap[key].hasBets = true;
  }

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
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={prevMonth} style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "8px", padding: "6px", cursor: "pointer", display: "flex" }}>
          <ChevronLeft size={16} style={{ color: "#6B7280" }} />
        </button>
        <span style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: "20px", letterSpacing: "0.06em", color: "#111827" }}>
          {monthNames[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "8px", padding: "6px", cursor: "pointer", display: "flex" }}>
          <ChevronRight size={16} style={{ color: "#6B7280" }} />
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "8px 12px 4px", gap: "2px" }}>
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: "10px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", padding: "4px 0" }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "0 12px 12px", gap: "4px" }}>
        {days.map((date, i) => {
          if (!date) return <div key={i} />;
          const key = toDateKey(date);
          const day = dayMap[key];
          const isToday = key === todayKey;
          const isFuture = date > today;
          const isPos = (day?.total ?? 0) > 0;
          const isNeg = (day?.total ?? 0) < 0;

          return (
            <div key={key} style={{
              borderRadius: "10px", padding: "6px 2px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
              background: isToday ? "#EFF6FF" : "transparent",
            }}>
              <span style={{ fontSize: "13px", fontWeight: isToday ? 800 : 500, color: isToday ? "#2563EB" : isFuture ? "#D1D5DB" : "#374151", lineHeight: 1 }}>{date.getDate()}</span>
              {day?.hasBets && (
                (isPos || isNeg) ? (
                  <span style={{ fontSize: "9px", fontWeight: 800, lineHeight: 1, color: isPos ? "#16A34A" : "#DC2626", background: isPos ? "#F0FDF4" : "#FEF2F2", padding: "1px 4px", borderRadius: "4px" }}>
                    {isPos ? "+" : ""}{day.total}U
                  </span>
                ) : (
                  <span style={{ fontSize: "9px", fontWeight: 700, color: "#9CA3AF", lineHeight: 1 }}>—</span>
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function StatsVipPage() {
  const [bets, setBets] = useState<BetEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/stats/vip`)
      .then(r => r.json())
      .then(d => { if (d.success) setBets(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const periods = computePeriods(bets);

  return (
    <div style={{ background: "#F9FAFB", minHeight: "100vh" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid #E5E7EB", padding: "48px 16px 32px" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", textAlign: "center" }}>
          <span style={{
            display: "inline-block", background: "#EFF6FF", color: "#2563EB",
            fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", padding: "5px 14px", borderRadius: "999px",
            border: "1px solid #BFDBFE", marginBottom: "16px",
          }}>
            Transparence totale
          </span>
          <h1 style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: "clamp(2.2rem, 6vw, 4rem)",
            textTransform: "uppercase", color: "#111827", lineHeight: 1, marginBottom: "12px",
          }}>
            Stats <span style={{ background: "linear-gradient(135deg, #2563EB, #60A5FA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>VIP</span>
          </h1>
          <p style={{ color: "#6B7280", fontSize: "15px", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto" }}>
            Résultats réels du groupe VIP en unités. Rejoins pour accéder aux sélections complètes.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 16px" }}>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", border: "3px solid #2563EB", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", marginBottom: "24px" }}>
              <StatCard label="Aujourd'hui" data={periods.day} />
              <StatCard label="Cette semaine" data={periods.week} />
              <StatCard label="Ce mois" data={periods.month} />
              <StatCard label="Total" data={periods.all} isTotal />
            </div>

            {/* Calendar */}
            <Calendar bets={bets} />

            {/* Info banner */}
            <div style={{
              background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "14px",
              padding: "14px 18px", marginBottom: "24px",
              display: "flex", alignItems: "center", gap: "10px",
            }}>
              <CalendarDays size={18} style={{ color: "#D97706", flexShrink: 0 }} />
              <p style={{ fontSize: "13px", color: "#92400E", lineHeight: 1.5 }}>
                Les statistiques affichées sont calculées en unités (U). 1U = mise de base définie à l&apos;entrée. Les sélections détaillées sont réservées aux membres VIP.
              </p>
            </div>

            {/* CTA */}
            <div style={{
              background: "linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)",
              borderRadius: "20px", padding: "32px 24px", textAlign: "center",
              boxShadow: "0 8px 32px rgba(37,99,235,0.3)",
            }}>
              <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: "10px" }}>
                Accède aux sélections complètes
              </div>
              <h2 style={{
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                fontSize: "clamp(1.8rem, 5vw, 3rem)", letterSpacing: "0.06em",
                color: "white", lineHeight: 1, marginBottom: "12px",
              }}>
                Rejoins le groupe VIP
              </h2>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", lineHeight: 1.6, marginBottom: "24px", maxWidth: "400px", margin: "0 auto 24px" }}>
                Pronostics complets, analyses, montantes et bien plus. Rejoins les membres qui performent sur le long terme.
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/vip" style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "white", color: "#1E3A8A",
                  fontSize: "14px", fontWeight: 700,
                  padding: "13px 28px", borderRadius: "12px", textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                  transition: "transform 0.15s",
                }}>
                  Voir les offres VIP
                </Link>
                <a href="https://t.me/prognobeastfree" target="_blank" rel="noopener noreferrer" style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  background: "rgba(255,255,255,0.15)", color: "white",
                  fontSize: "14px", fontWeight: 600,
                  padding: "13px 28px", borderRadius: "12px", textDecoration: "none",
                  border: "1.5px solid rgba(255,255,255,0.3)",
                }}>
                  Canal gratuit Telegram
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
