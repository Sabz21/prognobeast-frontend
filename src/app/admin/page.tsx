"use client";
import { useState, useEffect, useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users, TrendingUp, TrendingDown, Plus, CheckCircle2, XCircle,
  Clock, Trash2, LogOut, ShieldCheck, Trophy, Pencil, X,
  Eye, ChevronLeft, ChevronRight, CalendarDays, Layers, BarChart2, Crown,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

interface AdminBet {
  id: string;
  sport: string;
  description: string;
  odds: number;
  unit: number;
  status: "PENDING" | "WON" | "LOST";
  createdAt: string;
  totalUsers: number;
  followers: number;
}

interface AdminMontanteStep {
  id: string;
  stepNumber: number;
  sport: string;
  description: string;
  odds: number;
  status: string;
  createdAt: string;
}

interface AdminMontante {
  id: string;
  number: number;
  startDate: string;
  description: string | null;
  status: string;
  createdAt: string;
  steps: AdminMontanteStep[];
  totalUsers: number;
  followers: number;
}

interface LeaderboardEntry {
  userId: string;
  firstName: string;
  lastName: string;
  followedCount: number;
  wonCount: number;
  lostCount: number;
  totalUnits: number;
}

interface CdmPariSimple {
  id: string;
  team1: string;
  team2: string;
  pari: string;
  cote: number;
  units: number;
  status: "PENDING" | "WON" | "LOST";
  createdAt: string;
}

interface CdmPariButeur {
  id: string;
  team1: string;
  team2: string;
  joueur: string;
  pari: string;
  cote: number;
  units: number;
  status: "PENDING" | "WON" | "LOST";
  createdAt: string;
}

const CDM_PAYS = [
  { code: "US", nom: "États-Unis", flag: "🇺🇸" },
  { code: "CA", nom: "Canada", flag: "🇨🇦" },
  { code: "MX", nom: "Mexique", flag: "🇲🇽" },
  { code: "AR", nom: "Argentine", flag: "🇦🇷" },
  { code: "BR", nom: "Brésil", flag: "🇧🇷" },
  { code: "CO", nom: "Colombie", flag: "🇨🇴" },
  { code: "EC", nom: "Équateur", flag: "🇪🇨" },
  { code: "UY", nom: "Uruguay", flag: "🇺🇾" },
  { code: "VE", nom: "Venezuela", flag: "🇻🇪" },
  { code: "DE", nom: "Allemagne", flag: "🇩🇪" },
  { code: "ES", nom: "Espagne", flag: "🇪🇸" },
  { code: "PT", nom: "Portugal", flag: "🇵🇹" },
  { code: "FR", nom: "France", flag: "🇫🇷" },
  { code: "EN", nom: "Angleterre", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { code: "NL", nom: "Pays-Bas", flag: "🇳🇱" },
  { code: "CH", nom: "Suisse", flag: "🇨🇭" },
  { code: "AT", nom: "Autriche", flag: "🇦🇹" },
  { code: "DK", nom: "Danemark", flag: "🇩🇰" },
  { code: "TR", nom: "Turquie", flag: "🇹🇷" },
  { code: "BE", nom: "Belgique", flag: "🇧🇪" },
  { code: "HR", nom: "Croatie", flag: "🇭🇷" },
  { code: "RS", nom: "Serbie", flag: "🇷🇸" },
  { code: "SI", nom: "Slovénie", flag: "🇸🇮" },
  { code: "SC", nom: "Écosse", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  { code: "GR", nom: "Grèce", flag: "🇬🇷" },
  { code: "MA", nom: "Maroc", flag: "🇲🇦" },
  { code: "NG", nom: "Nigeria", flag: "🇳🇬" },
  { code: "SN", nom: "Sénégal", flag: "🇸🇳" },
  { code: "EG", nom: "Égypte", flag: "🇪🇬" },
  { code: "ZA", nom: "Afrique du Sud", flag: "🇿🇦" },
  { code: "CM", nom: "Cameroun", flag: "🇨🇲" },
  { code: "CD", nom: "RD Congo", flag: "🇨🇩" },
  { code: "GH", nom: "Ghana", flag: "🇬🇭" },
  { code: "DZ", nom: "Algérie", flag: "🇩🇿" },
  { code: "CI", nom: "Côte d'Ivoire", flag: "🇨🇮" },
  { code: "JP", nom: "Japon", flag: "🇯🇵" },
  { code: "KR", nom: "Corée du Sud", flag: "🇰🇷" },
  { code: "IR", nom: "Iran", flag: "🇮🇷" },
  { code: "JO", nom: "Jordanie", flag: "🇯🇴" },
  { code: "IQ", nom: "Irak", flag: "🇮🇶" },
  { code: "QA", nom: "Qatar", flag: "🇶🇦" },
  { code: "UZ", nom: "Ouzbékistan", flag: "🇺🇿" },
  { code: "AU", nom: "Australie", flag: "🇦🇺" },
  { code: "PA", nom: "Panama", flag: "🇵🇦" },
  { code: "HN", nom: "Honduras", flag: "🇭🇳" },
  { code: "CR", nom: "Costa Rica", flag: "🇨🇷" },
  { code: "NZ", nom: "Nouvelle-Zélande", flag: "🇳🇿" },
  { code: "CL", nom: "Chili", flag: "🇨🇱" },
];

// ── helpers partagés ─────────────────────────────────────────────────────────
function toDateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function betGainLoss(bet: AdminBet): number | null {
  if (bet.status === "WON") return parseFloat(((bet.odds - 1) * bet.unit).toFixed(2));
  if (bet.status === "LOST") return parseFloat((-bet.unit).toFixed(2));
  return null;
}

function previewDayStats(bets: AdminBet[], key: string) {
  const dayBets = bets.filter(b => toDateKey(new Date(b.createdAt)) === key);
  const hasBets = dayBets.length > 0;
  const hasPending = dayBets.some(b => b.status === "PENDING");
  const total = parseFloat(dayBets.filter(b => b.status !== "PENDING").reduce((acc, b) => acc + (betGainLoss(b) ?? 0), 0).toFixed(2));
  return { total, hasBets, hasPending };
}

type AdminPeriodKey = "day" | "week" | "month" | "all";

function PreviewStatCard({ label, total, count, isTotal, onClick }: { label: string; total: number; count: number; isTotal?: boolean; onClick?: () => void }) {
  const isPos = total > 0; const isNeg = total < 0;
  const color = isPos ? "#16A34A" : isNeg ? "#DC2626" : "#6B7280";
  return (
    <div onClick={onClick} style={{
      background: isTotal ? "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)" : "white",
      borderRadius: "16px", padding: "20px",
      border: isTotal ? "none" : "1px solid #E5E7EB",
      boxShadow: isTotal ? "0 4px 24px rgba(37,99,235,0.25)" : "0 1px 3px rgba(0,0,0,0.06)",
      display: "flex", flexDirection: "column", gap: "8px",
      cursor: onClick ? "pointer" : "default", transition: "transform 0.15s, box-shadow 0.15s",
    }}
      onMouseEnter={e => { if (onClick) { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = isTotal ? "0 8px 32px rgba(37,99,235,0.35)" : "0 4px 16px rgba(0,0,0,0.1)"; }}}
      onMouseLeave={e => { if (onClick) { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = isTotal ? "0 4px 24px rgba(37,99,235,0.25)" : "0 1px 3px rgba(0,0,0,0.06)"; }}}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {isTotal && <Trophy size={13} style={{ color: "rgba(255,255,255,0.8)" }} />}
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: isTotal ? "rgba(255,255,255,0.8)" : "#6B7280" }}>{label}</span>
        </div>
        {onClick && <span style={{ fontSize: "10px", fontWeight: 600, color: isTotal ? "rgba(255,255,255,0.5)" : "#D1D5DB" }}>Détails →</span>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ fontSize: "26px", fontWeight: 800, lineHeight: 1, color: isTotal ? "white" : color }}>
          {isPos ? "+" : ""}{total}U
        </span>
        {!isTotal && isPos && <TrendingUp size={18} style={{ color }} />}
        {!isTotal && isNeg && <TrendingDown size={18} style={{ color: "#DC2626" }} />}
      </div>
      <span style={{ fontSize: "12px", color: isTotal ? "rgba(255,255,255,0.6)" : "#9CA3AF" }}>
        {count} pari{count !== 1 ? "s" : ""}
      </span>
    </div>
  );
}

function AdminPeriodDetailModal({ periodKey, label, from, bets, onClose }: {
  periodKey: AdminPeriodKey; label: string; from: Date; bets: AdminBet[]; onClose: () => void;
}) {
  const periodBets = bets.filter(b => new Date(b.createdAt) >= from);
  const settled = periodBets.filter(b => b.status !== "PENDING");
  const won = settled.filter(b => b.status === "WON");
  const lost = settled.filter(b => b.status === "LOST");
  const pending = periodBets.filter(b => b.status === "PENDING");

  const totalPL = parseFloat(settled.reduce((acc, b) => acc + (betGainLoss(b) ?? 0), 0).toFixed(2));
  const winRate = settled.length > 0 ? Math.round((won.length / settled.length) * 100) : null;

  const best = [...settled].sort((a, b) => (betGainLoss(b) ?? 0) - (betGainLoss(a) ?? 0))[0] ?? null;
  const worst = [...settled].sort((a, b) => (betGainLoss(a) ?? 0) - (betGainLoss(b) ?? 0))[0] ?? null;

  const sportMap: Record<string, { pl: number; won: number; lost: number }> = {};
  settled.forEach(b => {
    if (!sportMap[b.sport]) sportMap[b.sport] = { pl: 0, won: 0, lost: 0 };
    sportMap[b.sport].pl += betGainLoss(b) ?? 0;
    if (b.status === "WON") sportMap[b.sport].won++; else sportMap[b.sport].lost++;
  });
  const sports = Object.entries(sportMap)
    .map(([sport, s]) => ({ sport, pl: parseFloat(s.pl.toFixed(2)), won: s.won, lost: s.lost }))
    .sort((a, b) => b.pl - a.pl);

  const dateLabel = periodKey === "day"
    ? new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : periodKey === "all" ? "Depuis le début"
    : `${from.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} – aujourd'hui`;

  const isPos = totalPL > 0; const isNeg = totalPL < 0;
  const bestGL = best ? betGainLoss(best) : null;
  const worstGL = worst ? betGainLoss(worst) : null;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: "20px", width: "100%", maxWidth: "640px", maxHeight: "88vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}>
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexShrink: 0 }}>
          <div>
            <h2 style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: "26px", letterSpacing: "0.06em", color: "#111827", lineHeight: 1, marginBottom: "4px" }}>{label}</h2>
            <p style={{ fontSize: "12px", color: "#9CA3AF" }}>{dateLabel}</p>
          </div>
          <button onClick={onClose} style={{ background: "#F3F4F6", border: "none", borderRadius: "50%", width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <X size={16} style={{ color: "#6B7280" }} />
          </button>
        </div>

        <div style={{ overflow: "auto", flex: 1, padding: "20px 24px" }}>
          {/* Big P&L */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px", padding: "20px", background: isPos ? "linear-gradient(135deg, #F0FDF4, #DCFCE7)" : isNeg ? "linear-gradient(135deg, #FEF2F2, #FEE2E2)" : "linear-gradient(135deg, #F9FAFB, #F3F4F6)", borderRadius: "16px", border: `1px solid ${isPos ? "#BBF7D0" : isNeg ? "#FECACA" : "#E5E7EB"}` }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "44px", fontWeight: 800, color: isPos ? "#16A34A" : isNeg ? "#DC2626" : "#6B7280", lineHeight: 1 }}>
                {isPos ? "+" : ""}{totalPL}U
              </div>
              <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "6px" }}>{settled.length} paris terminés</div>
            </div>
            {winRate !== null && (
              <div style={{ textAlign: "center", background: "white", borderRadius: "14px", padding: "14px 18px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", flexShrink: 0 }}>
                <div style={{ fontSize: "28px", fontWeight: 800, color: "#111827", lineHeight: 1 }}>{winRate}%</div>
                <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "4px", fontWeight: 600 }}>taux victoire</div>
              </div>
            )}
          </div>

          {/* Counters */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "20px" }}>
            {[
              { label: "Gagnés", value: won.length, color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0" },
              { label: "Perdus", value: lost.length, color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
              { label: "En attente", value: pending.length, color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE" },
            ].map(({ label: l, value, color, bg, border }) => (
              <div key={l} style={{ background: bg, border: `1px solid ${border}`, borderRadius: "12px", padding: "14px", textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: "11px", color: "#6B7280", marginTop: "4px", fontWeight: 600 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Best / Worst */}
          {(bestGL !== null && bestGL > 0) || (worstGL !== null && worstGL < 0) ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "20px" }}>
              {best && bestGL !== null && bestGL > 0 && (
                <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "14px", padding: "14px" }}>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#16A34A", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>🏆 Meilleur</div>
                  <div style={{ fontSize: "12px", color: "#374151", lineHeight: 1.4, marginBottom: "8px" }}>{best.description}</div>
                  <div style={{ fontSize: "18px", fontWeight: 800, color: "#16A34A" }}>+{bestGL}U</div>
                  <div style={{ fontSize: "10px", color: "#9CA3AF", marginTop: "2px" }}>@{best.odds} · {best.unit}U · {best.followers} suivis</div>
                </div>
              )}
              {worst && worstGL !== null && worstGL < 0 && worst.id !== best?.id && (
                <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "14px", padding: "14px" }}>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#DC2626", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>💔 Pire</div>
                  <div style={{ fontSize: "12px", color: "#374151", lineHeight: 1.4, marginBottom: "8px" }}>{worst.description}</div>
                  <div style={{ fontSize: "18px", fontWeight: 800, color: "#DC2626" }}>{worstGL}U</div>
                  <div style={{ fontSize: "10px", color: "#9CA3AF", marginTop: "2px" }}>@{worst.odds} · {worst.unit}U · {worst.followers} suivis</div>
                </div>
              )}
            </div>
          ) : null}

          {/* Sport breakdown */}
          {sports.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>Par sport</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {sports.map(s => (
                  <div key={s.sport} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "#F9FAFB", borderRadius: "10px", border: "1px solid #E5E7EB" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#111827" }}>{s.sport}</span>
                      <span style={{ fontSize: "11px", color: "#9CA3AF" }}>{s.won}W / {s.lost}L</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {(s.won + s.lost) > 0 && (
                        <div style={{ width: "40px", height: "6px", borderRadius: "3px", background: "#E5E7EB", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${(s.won / (s.won + s.lost)) * 100}%`, background: "#16A34A", borderRadius: "3px" }} />
                        </div>
                      )}
                      <span style={{ fontSize: "14px", fontWeight: 800, color: s.pl >= 0 ? "#16A34A" : "#DC2626", minWidth: "50px", textAlign: "right" }}>
                        {s.pl >= 0 ? "+" : ""}{s.pl}U
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bet list */}
          {periodBets.length > 0 && (
            <div>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>Tous les paris ({periodBets.length})</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {[...periodBets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(bet => {
                  const gl = betGainLoss(bet);
                  return (
                    <div key={bet.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: bet.status === "WON" ? "#F0FDF4" : bet.status === "LOST" ? "#FEF2F2" : "#F9FAFB", border: `1px solid ${bet.status === "WON" ? "#BBF7D0" : bet.status === "LOST" ? "#FECACA" : "#E5E7EB"}`, borderRadius: "10px" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "2px" }}>
                          <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#6B7280" }}>{bet.sport}</span>
                          <span style={{ fontSize: "10px", color: "#9CA3AF" }}>@{bet.odds} · {bet.unit}U</span>
                          <span style={{ fontSize: "9px", color: "#9CA3AF", background: "#F3F4F6", border: "1px solid #E5E7EB", padding: "1px 5px", borderRadius: "4px" }}>{bet.followers}/{bet.totalUsers} suivis</span>
                        </div>
                        <div style={{ fontSize: "13px", color: "#374151", lineHeight: 1.3 }}>{bet.description}</div>
                      </div>
                      <div style={{ flexShrink: 0 }}>
                        {bet.status === "PENDING" && <span style={{ fontSize: "11px", color: "#2563EB", fontWeight: 700 }}>En cours</span>}
                        {gl !== null && <span style={{ fontSize: "14px", fontWeight: 800, color: gl >= 0 ? "#16A34A" : "#DC2626" }}>{gl > 0 ? "+" : ""}{gl}U</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {periodBets.length === 0 && <div style={{ textAlign: "center", padding: "40px 0" }}><p style={{ fontSize: "14px", color: "#9CA3AF" }}>Aucun pari sur cette période</p></div>}
        </div>
      </div>
    </div>
  );
}

function PreviewCalendar({ bets, selectedDay, onSelectDay }: { bets: AdminBet[]; selectedDay: string | null; onSelectDay: (k: string | null) => void }) {
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

  const monthNames = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
  const todayKey = toDateKey(today);

  function prevMonth() { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); }
  function nextMonth() { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); }

  return (
    <div style={{ background: "white", borderRadius: "16px", border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden", marginBottom: "20px" }}>
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "8px 12px 4px", gap: "2px" }}>
        {["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"].map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: "10px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em", padding: "4px 0" }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "0 12px 12px", gap: "4px" }}>
        {days.map((date, i) => {
          if (!date) return <div key={i} />;
          const key = toDateKey(date);
          const { total, hasBets, hasPending } = previewDayStats(bets, key);
          const isToday = key === todayKey;
          const isSelected = key === selectedDay;
          const isFuture = date > today;
          const isPos = total > 0; const isNeg = total < 0;
          return (
            <button key={key} onClick={() => onSelectDay(isSelected ? null : key)}
              disabled={isFuture && !hasBets}
              style={{
                borderRadius: "10px", border: "none", cursor: hasBets || !isFuture ? "pointer" : "default",
                padding: "6px 2px", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", transition: "all 0.15s",
                background: isSelected ? "linear-gradient(135deg, #2563EB, #1D4ED8)" : isToday ? "#EFF6FF" : "transparent",
                boxShadow: isSelected ? "0 2px 8px rgba(37,99,235,0.3)" : "none",
              }}>
              <span style={{ fontSize: "13px", fontWeight: isToday || isSelected ? 800 : 500, color: isSelected ? "white" : isToday ? "#2563EB" : isFuture ? "#D1D5DB" : "#374151", lineHeight: 1 }}>
                {date.getDate()}
              </span>
              {hasBets && (
                hasPending && !isPos && !isNeg ? (
                  <span style={{ fontSize: "9px", fontWeight: 700, color: isSelected ? "rgba(255,255,255,0.8)" : "#2563EB" }}>•</span>
                ) : (isPos || isNeg) ? (
                  <span style={{ fontSize: "9px", fontWeight: 800, color: isSelected ? "white" : isPos ? "#16A34A" : "#DC2626", background: isSelected ? "rgba(255,255,255,0.2)" : isPos ? "#F0FDF4" : "#FEF2F2", padding: "1px 4px", borderRadius: "4px" }}>
                    {isPos ? "+" : ""}{total}U
                  </span>
                ) : (
                  <span style={{ fontSize: "9px", color: isSelected ? "rgba(255,255,255,0.7)" : "#9CA3AF" }}>—</span>
                )
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function computeAdminMontanteSteps(steps: AdminMontanteStep[], initialStake: number) {
  let running = initialStake;
  return steps.map((step) => {
    const betAmount = parseFloat(running.toFixed(2));
    const potentialReturn = parseFloat((running * step.odds).toFixed(2));
    const profit = parseFloat((potentialReturn - betAmount).toFixed(2));
    if (step.status === "WON") running = potentialReturn;
    else if (step.status === "LOST") running = 0;
    return { betAmount, potentialReturn, profit };
  });
}

const inp: React.CSSProperties = {
  width: "100%", background: "#F9FAFB", border: "1px solid #E5E7EB",
  borderRadius: "10px", padding: "10px 12px", fontSize: "14px",
  color: "#111827", outline: "none", transition: "border-color 0.15s",
  boxSizing: "border-box",
};

export default function AdminPage() {
  const { user, token, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"users" | "bets" | "preview" | "montantes" | "classement" | "cdm">("users");
  const [previewSelectedDay, setPreviewSelectedDay] = useState<string | null>(null);
  const [previewSelectedPeriod, setPreviewSelectedPeriod] = useState<AdminPeriodKey | null>(null);
  const [montantes, setMontantes] = useState<AdminMontante[]>([]);
  const [montantesLoading, setMontantesLoading] = useState(true);
  const [montanteForm, setMontanteForm] = useState({ startDate: new Date().toISOString().split("T")[0], description: "" });
  const [montanteError, setMontanteError] = useState("");
  const [montanteCreating, setMontanteCreating] = useState(false);
  const [expandedMontante, setExpandedMontante] = useState<string | null>(null);
  const [adminSimulStake, setAdminSimulStake] = useState<string>("100");
  const [editingMontante, setEditingMontante] = useState<string | null>(null);
  const [montanteEditForm, setMontanteEditForm] = useState({ description: "", startDate: "" });
  const [editingStep, setEditingStep] = useState<string | null>(null);
  const [stepEditForm, setStepEditForm] = useState({ sport: "", description: "", odds: "" });
  const [stepForms, setStepForms] = useState<Record<string, { sport: string; description: string; odds: string }>>({});
  const [stepSaving, setStepSaving] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [bets, setBets] = useState<AdminBet[]>([]);
  const [betsLoading, setBetsLoading] = useState(true);
  const todayStr = new Date().toISOString().split("T")[0];
  const [betForm, setBetForm] = useState({ sport: "", description: "", odds: "", unit: "1", date: todayStr });
  const [betError, setBetError] = useState("");
  const [betSuccess, setBetSuccess] = useState("");
  const [betCreating, setBetCreating] = useState(false);
  const [editingBet, setEditingBet] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ sport: "", description: "", odds: "", unit: "" });
  const [editSaving, setEditSaving] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [lbLoading, setLbLoading] = useState(false);
  const [lbPeriod, setLbPeriod] = useState<"day" | "week" | "month" | "all" | "specificMonth">("all");
  const [lbMonth, setLbMonth] = useState(() => {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}`;
  });

  // ── CDM 2026 state ───────────────────────────────────────────────────────────
  const [cdmSubTab, setCdmSubTab] = useState<"simples" | "buteurs">("simples");
  const [cdmSimples, setCdmSimples] = useState<CdmPariSimple[]>([]);
  const [cdmButeurs, setCdmButeurs] = useState<CdmPariButeur[]>([]);
  const [cdmLoading, setCdmLoading] = useState(false);
  const [cdmSimpleForm, setCdmSimpleForm] = useState({ team1: "", team2: "", pari: "", cote: "", units: "1" });
  const [cdmButeurForm, setCdmButeurForm] = useState({ team1: "", team2: "", joueur: "", pari: "", cote: "", units: "1" });
  const [cdmSimpleError, setCdmSimpleError] = useState("");
  const [cdmButeurError, setCdmButeurError] = useState("");
  const [cdmSimpleCreating, setCdmSimpleCreating] = useState(false);
  const [cdmButeurCreating, setCdmButeurCreating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
    if (!authLoading && user && user.role !== "ADMIN") router.replace("/dashboard");
  }, [user, authLoading, router]);

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setUsers(data.data);
    } catch { /* silent */ } finally { setUsersLoading(false); }
  }, [token]);

  const fetchBets = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/bets`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setBets(data.data);
    } catch { /* silent */ } finally { setBetsLoading(false); }
  }, [token]);

  const fetchMontantes = useCallback(async () => {
    if (!token) return;
    setMontantesLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/montantes`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setMontantes(data.data);
    } catch { /* silent */ } finally { setMontantesLoading(false); }
  }, [token]);

  const fetchLeaderboard = useCallback(async (period: "day" | "week" | "month" | "all" | "specificMonth" = "all", month?: string) => {
    if (!token) return;
    setLbLoading(true);
    try {
      const url = period === "specificMonth" && month
        ? `${API_URL}/api/admin/leaderboard?period=specificMonth&month=${month}`
        : `${API_URL}/api/admin/leaderboard?period=${period}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setLeaderboard(data.data);
    } catch { /* silent */ } finally { setLbLoading(false); }
  }, [token]);

  const fetchCdm = useCallback(async () => {
    if (!token) return;
    setCdmLoading(true);
    try {
      const [r1, r2] = await Promise.all([
        fetch(`${API_URL}/api/admin/cdm/simples`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/admin/cdm/buteurs`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const [d1, d2] = await Promise.all([r1.json(), r2.json()]);
      if (d1.success) setCdmSimples(d1.data);
      if (d2.success) setCdmButeurs(d2.data);
    } catch { /* silent */ } finally { setCdmLoading(false); }
  }, [token]);

  useEffect(() => { if (token) { fetchUsers(); fetchBets(); fetchMontantes(); fetchCdm(); } }, [token, fetchUsers, fetchBets, fetchMontantes, fetchCdm]);
  useEffect(() => { if (token) fetchLeaderboard(lbPeriod, lbMonth); }, [token, lbPeriod, lbMonth, fetchLeaderboard]);

  async function handleApprove(id: string) {
    if (!token) return;
    const res = await fetch(`${API_URL}/api/admin/users/${id}/approve`, { method: "PUT", headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setUsers(prev => prev.map(u => u.id === id ? { ...u, status: "APPROVED" } : u));
  }

  async function handleReject(id: string) {
    if (!token) return;
    const res = await fetch(`${API_URL}/api/admin/users/${id}/reject`, { method: "PUT", headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setUsers(prev => prev.map(u => u.id === id ? { ...u, status: "REJECTED" } : u));
  }

  async function handleCreateBet(e: FormEvent) {
    e.preventDefault();
    setBetError(""); setBetSuccess(""); setBetCreating(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/bets`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ sport: betForm.sport, description: betForm.description, odds: parseFloat(betForm.odds), unit: parseFloat(betForm.unit), date: betForm.date }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setBetSuccess("Pari créé avec succès !");
      setBetForm({ sport: "", description: "", odds: "", unit: "1", date: todayStr });
      await fetchBets();
    } catch (err: unknown) {
      setBetError(err instanceof Error ? err.message : "Erreur lors de la création.");
    } finally { setBetCreating(false); }
  }

  function startEdit(bet: AdminBet) {
    setEditingBet(bet.id);
    setEditForm({ sport: bet.sport, description: bet.description, odds: String(bet.odds), unit: String(bet.unit) });
  }

  async function handleEditBet(e: FormEvent) {
    e.preventDefault();
    if (!token || !editingBet) return;
    setEditSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/bets/${editingBet}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ sport: editForm.sport, description: editForm.description, odds: parseFloat(editForm.odds), unit: parseFloat(editForm.unit) }),
      });
      if (res.ok) {
        setBets(prev => prev.map(b => b.id === editingBet
          ? { ...b, sport: editForm.sport, description: editForm.description, odds: parseFloat(editForm.odds), unit: parseFloat(editForm.unit) }
          : b));
        setEditingBet(null);
      }
    } finally { setEditSaving(false); }
  }

  async function handleSetResult(id: string, result: "WON" | "LOST") {
    if (!token) return;
    const res = await fetch(`${API_URL}/api/admin/bets/${id}/result`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ result }),
    });
    if (res.ok) setBets(prev => prev.map(b => b.id === id ? { ...b, status: result } : b));
  }

  async function handleDeleteBet(id: string) {
    if (!token || !confirm("Supprimer ce pari ?")) return;
    const res = await fetch(`${API_URL}/api/admin/bets/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setBets(prev => prev.filter(b => b.id !== id));
  }

  async function handleEditMontante(id: string) {
    if (!token) return;
    const res = await fetch(`${API_URL}/api/admin/montantes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ description: montanteEditForm.description, startDate: montanteEditForm.startDate }),
    });
    if (res.ok) { setEditingMontante(null); await fetchMontantes(); }
  }

  async function handleEditStep(montanteId: string, stepId: string) {
    if (!token) return;
    const res = await fetch(`${API_URL}/api/admin/montantes/${montanteId}/steps/${stepId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ sport: stepEditForm.sport, description: stepEditForm.description, odds: parseFloat(stepEditForm.odds) }),
    });
    if (res.ok) { setEditingStep(null); await fetchMontantes(); }
  }

  async function handleResetStepResult(montanteId: string, stepId: string) {
    if (!token) return;
    const res = await fetch(`${API_URL}/api/admin/montantes/${montanteId}/steps/${stepId}/result`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ result: "PENDING" }),
    });
    if (res.ok) await fetchMontantes();
  }

  async function handleCreateMontante(e: React.FormEvent) {
    e.preventDefault();
    setMontanteError(""); setMontanteCreating(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/montantes`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ startDate: montanteForm.startDate, description: montanteForm.description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMontanteForm({ startDate: todayStr, description: "" });
      await fetchMontantes();
    } catch (err: unknown) {
      setMontanteError(err instanceof Error ? err.message : "Erreur lors de la création.");
    } finally { setMontanteCreating(false); }
  }

  async function handleAddStep(montanteId: string) {
    const form = stepForms[montanteId];
    if (!form) return;
    setStepSaving(montanteId);
    try {
      const res = await fetch(`${API_URL}/api/admin/montantes/${montanteId}/steps`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ sport: form.sport, description: form.description, odds: parseFloat(form.odds) }),
      });
      if (res.ok) {
        setStepForms(prev => ({ ...prev, [montanteId]: { sport: "", description: "", odds: "" } }));
        await fetchMontantes();
      }
    } finally { setStepSaving(null); }
  }

  async function handleSetStepResult(montanteId: string, stepId: string, result: "WON" | "LOST") {
    if (!token) return;
    const res = await fetch(`${API_URL}/api/admin/montantes/${montanteId}/steps/${stepId}/result`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ result }),
    });
    if (res.ok) await fetchMontantes();
  }

  async function handleDeleteMontante(id: string) {
    if (!token || !confirm("Supprimer cette montante et toutes ses étapes ?")) return;
    const res = await fetch(`${API_URL}/api/admin/montantes/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setMontantes(prev => prev.filter(m => m.id !== id));
  }

  async function handleDeleteStep(montanteId: string, stepId: string) {
    if (!token) return;
    const res = await fetch(`${API_URL}/api/admin/montantes/${montanteId}/steps/${stepId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) await fetchMontantes();
  }

  async function handleToggleMontanteStatus(montante: AdminMontante) {
    if (!token) return;
    const newStatus = montante.status === "ACTIVE" ? "COMPLETED" : "ACTIVE";
    const res = await fetch(`${API_URL}/api/admin/montantes/${montante.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) await fetchMontantes();
  }

  if (authLoading || !user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F9FAFB" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid #2563EB", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const pendingUsers = users.filter(u => u.status === "PENDING");

  function downloadMonthStats(monthKey: string, monthLabel: string, allBets: AdminBet[]) {
    const [y, m] = monthKey.split("-").map(Number);
    const from = new Date(y, m - 1, 1);
    const to = new Date(y, m, 1);
    const monthBets = allBets.filter(b => {
      const d = new Date(b.createdAt);
      return d >= from && d < to && b.status !== "PENDING";
    });
    const total = parseFloat(monthBets.reduce((acc, b) => acc + (betGainLoss(b) ?? 0), 0).toFixed(2));
    const won = monthBets.filter(b => b.status === "WON").length;
    const lost = monthBets.filter(b => b.status === "LOST").length;
    const isPos = total > 0;

    const bestBet = [...monthBets].sort((a, b) => (betGainLoss(b) ?? 0) - (betGainLoss(a) ?? 0))[0] ?? null;
    const worstBet = [...monthBets].sort((a, b) => (betGainLoss(a) ?? 0) - (betGainLoss(b) ?? 0))[0] ?? null;
    const bestGL = bestBet ? (betGainLoss(bestBet) ?? 0) : null;
    const worstGL = worstBet ? (betGainLoss(worstBet) ?? 0) : null;

    // Day map for mini-chart
    const dayMap: Record<string, number> = {};
    for (const b of monthBets) {
      const dk = toDateKey(new Date(b.createdAt));
      dayMap[dk] = parseFloat(((dayMap[dk] ?? 0) + (betGainLoss(b) ?? 0)).toFixed(2));
    }
    const dayEntries = Object.entries(dayMap).sort(([a], [b]) => a.localeCompare(b));

    const W = 900, H = 520;
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    // Background
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#0F172A"); bg.addColorStop(1, "#1E3A8A");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // Decorative circles
    ctx.beginPath(); ctx.arc(820, 100, 150, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(96,165,250,0.07)"; ctx.fill();
    ctx.beginPath(); ctx.arc(60, 440, 90, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(96,165,250,0.05)"; ctx.fill();

    // Header
    ctx.textAlign = "left";
    ctx.font = "bold 13px Arial, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.fillText("PROGNOBEAST — STATS VIP", 48, 52);

    ctx.font = "bold 44px Impact, sans-serif";
    ctx.fillStyle = "white";
    ctx.fillText(monthLabel.toUpperCase(), 48, 102);

    // Separator
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(48, 116, W - 96, 1);

    // Big P&L
    ctx.textAlign = "left";
    ctx.font = "bold 86px Impact, sans-serif";
    ctx.fillStyle = isPos ? "#4ADE80" : "#F87171";
    ctx.fillText(`${isPos ? "+" : ""}${total}U`, 48, 220);

    // Sub label
    ctx.font = "bold 16px Arial, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillText(`${monthBets.length} paris terminés`, 48, 248);

    // Stats boxes: Gagnés, Perdus (left side, stacked horizontally)
    const boxes = [
      { label: "Gagnés", value: String(won), color: "#4ADE80" },
      { label: "Perdus", value: String(lost), color: "#F87171" },
    ];
    boxes.forEach((box, i) => {
      const bx = 48 + i * 200, by = 280;
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.beginPath();
      (ctx as CanvasRenderingContext2D).roundRect?.(bx, by, 178, 80, 12);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      (ctx as CanvasRenderingContext2D).roundRect?.(bx, by, 178, 80, 12);
      ctx.stroke();
      ctx.font = "bold 32px Impact, sans-serif";
      ctx.fillStyle = box.color;
      ctx.textAlign = "center";
      ctx.fillText(box.value, bx + 89, by + 42);
      ctx.font = "bold 12px Arial, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.fillText(box.label.toUpperCase(), bx + 89, by + 64);
    });

    // Best & worst bet rows
    const bestLabel = bestBet ? `${bestBet.sport} — ${bestBet.description.slice(0, 30)}${bestBet.description.length > 30 ? "…" : ""}` : "—";
    const worstLabel = worstBet ? `${worstBet.sport} — ${worstBet.description.slice(0, 30)}${worstBet.description.length > 30 ? "…" : ""}` : "—";
    const bestValStr = bestGL != null ? `${bestGL > 0 ? "+" : ""}${bestGL}U` : "—";
    const worstValStr = worstGL != null ? `${worstGL > 0 ? "+" : ""}${worstGL}U` : "—";

    // Best bet row
    ctx.textAlign = "left";
    ctx.font = "bold 11px Arial, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.fillText("MEILLEUR PARI", 48, 384);
    ctx.font = "bold 13px Arial, sans-serif";
    ctx.fillStyle = "#4ADE80";
    ctx.fillText(bestValStr, 48, 402);
    ctx.font = "13px Arial, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.fillText(bestLabel, 120, 402);

    // Worst bet row
    ctx.font = "bold 11px Arial, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.fillText("PIRE PARI", 48, 426);
    ctx.font = "bold 13px Arial, sans-serif";
    ctx.fillStyle = "#F87171";
    ctx.fillText(worstValStr, 48, 444);
    ctx.font = "13px Arial, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.fillText(worstLabel, 120, 444);

    // Mini bar chart (right side)
    if (dayEntries.length > 0) {
      const chartX = 680, chartY = 280, chartW = 172, chartH = 80;
      const maxAbs = Math.max(...dayEntries.map(([, v]) => Math.abs(v)), 0.1);
      const barW = Math.max(4, Math.floor((chartW - dayEntries.length) / dayEntries.length));
      const midY = chartY + chartH / 2;
      dayEntries.forEach(([, val], i) => {
        const barH = Math.max(2, Math.abs(val / maxAbs) * (chartH / 2 - 4));
        const bx = chartX + i * (barW + 1);
        ctx.fillStyle = val >= 0 ? "#4ADE80" : "#F87171";
        if (val >= 0) ctx.fillRect(bx, midY - barH, barW, barH);
        else ctx.fillRect(bx, midY, barW, barH);
      });
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.fillRect(chartX, midY, chartW, 1);
      ctx.font = "bold 10px Arial, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.textAlign = "center";
      ctx.fillText("ÉVOLUTION", chartX + chartW / 2, chartY + chartH + 16);
    }

    // Footer branding
    ctx.textAlign = "center";
    ctx.font = "bold 14px Impact, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillText("PrognoBeast — prognobeast.com", W / 2, H - 18);

    const link = document.createElement("a");
    link.download = `stats-vip-${monthKey}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function downloadPodium(top3: LeaderboardEntry[], periodLabel: string) {
    const W = 900, H = 540;
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    // Background
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#0F172A"); bg.addColorStop(1, "#1E3A8A");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // Decorative circles
    ctx.beginPath(); ctx.arc(820, 80, 120, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(96,165,250,0.08)"; ctx.fill();
    ctx.beginPath(); ctx.arc(80, 460, 80, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(96,165,250,0.06)"; ctx.fill();

    // Title
    ctx.textAlign = "center";
    ctx.font = "bold 38px 'Bebas Neue', Impact, sans-serif";
    ctx.fillStyle = "white";
    ctx.fillText("CLASSEMENT MEMBRES", W / 2, 60);
    ctx.font = "bold 14px Arial, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillText(periodLabel.toUpperCase(), W / 2, 86);

    // Separator
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.fillRect(W/2 - 120, 98, 240, 1);

    // Podium data: index 0=2nd(left), 1=1st(center), 2=3rd(right)
    const slots = [
      { entry: top3[1], x: 195, blockH: 130, color: "#94A3B8", rankLabel: "#2", rankColor: "#CBD5E1" },
      { entry: top3[0], x: 450, blockH: 190, color: "#F59E0B", rankLabel: "#1", rankColor: "#FCD34D" },
      { entry: top3[2], x: 705, blockH: 90, color: "#CD7F32", rankLabel: "#3", rankColor: "#D97706" },
    ];
    const baseY = 430;

    for (const slot of slots) {
      if (!slot.entry) continue;
      const { x, blockH, color, rankLabel, rankColor, entry } = slot;
      const blockX = x - 110;
      const blockY = baseY - blockH;

      // Block shadow
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.fillRect(blockX + 4, blockY + 4, 220, blockH);

      // Block fill
      const blockGrad = ctx.createLinearGradient(blockX, blockY, blockX, baseY);
      blockGrad.addColorStop(0, color + "55");
      blockGrad.addColorStop(1, color + "22");
      ctx.fillStyle = blockGrad;
      ctx.fillRect(blockX, blockY, 220, blockH);

      // Block border
      ctx.strokeStyle = color + "BB";
      ctx.lineWidth = 2;
      ctx.strokeRect(blockX, blockY, 220, blockH);

      // Rank in block center
      ctx.font = "bold 52px Impact, sans-serif";
      ctx.fillStyle = rankColor + "99";
      ctx.textAlign = "center";
      ctx.fillText(rankLabel, x, baseY - 12);

      // Units above block
      const isPos = entry.totalUnits >= 0;
      ctx.font = "bold 22px Arial, sans-serif";
      ctx.fillStyle = isPos ? "#4ADE80" : "#F87171";
      ctx.fillText(`${isPos ? "+" : ""}${entry.totalUnits}U`, x, blockY - 58);

      // Name
      ctx.font = "bold 17px Arial, sans-serif";
      ctx.fillStyle = "white";
      const fullName = `${entry.firstName} ${entry.lastName}`;
      ctx.fillText(fullName, x, blockY - 32);

      // Followed count
      ctx.font = "13px Arial, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fillText(`${entry.followedCount} paris suivis`, x, blockY - 10);
    }

    // Base platform
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(40, baseY, W - 80, 8);

    // Branding footer
    ctx.font = "bold 16px Impact, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.textAlign = "center";
    ctx.fillText("PrognoBeast — prognobeast.com", W / 2, H - 16);

    // Download
    const link = document.createElement("a");
    link.download = `classement-${periodLabel.toLowerCase().replace(/\s+/g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Image src="/images/logo.png" alt="PrognoBeast" width={40} height={40}
                style={{ borderRadius: "10px", objectFit: "contain" }} />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <h1 style={{
                    fontFamily: "'Bebas Neue', Impact, sans-serif",
                    fontSize: "22px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#111827",
                  }}>Panel <span style={{
                    background: "linear-gradient(135deg, #2563EB, #60A5FA)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  }}>Admin</span></h1>
                  <span style={{
                    display: "flex", alignItems: "center", gap: "4px",
                    fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                    background: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE",
                    padding: "2px 8px", borderRadius: "999px",
                  }}><ShieldCheck size={10} /> Admin</span>
                </div>
                <p style={{ fontSize: "13px", color: "#6B7280", marginTop: "1px" }}>{user.email}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <Link href="/admin/abonnements" style={{
                display: "flex", alignItems: "center", gap: "6px",
                fontSize: "13px", fontWeight: 600, color: "#2563EB",
                background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: "10px",
                padding: "8px 14px", textDecoration: "none",
              }}>
                <Crown size={14} /> Abonnements
              </Link>
              <button onClick={() => { logout(); router.push("/"); }} style={{
                display: "flex", alignItems: "center", gap: "6px",
                fontSize: "13px", fontWeight: 500, color: "#6B7280",
                background: "none", border: "1px solid #E5E7EB", borderRadius: "10px",
                padding: "8px 14px", cursor: "pointer",
              }}>
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px 16px" }}>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: "8px", marginBottom: "24px",
          background: "white", borderRadius: "14px", padding: "6px",
          border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}>
          {[
            { key: "users", label: "Comptes", Icon: Users, badge: pendingUsers.length },
            { key: "bets", label: "Paris", Icon: TrendingUp, badge: 0 },
            { key: "montantes", label: "Montantes", Icon: Layers, badge: montantes.filter(m => m.status === "ACTIVE").length },
            { key: "preview", label: "Aperçu VIP", Icon: Eye, badge: 0 },
            { key: "classement", label: "Classement", Icon: BarChart2, badge: 0 },
            { key: "cdm", label: "CDM 2026", Icon: Trophy, badge: 0 },
          ].map(({ key, label, Icon, badge }) => (
            <button key={key} onClick={() => setTab(key as "users" | "bets" | "montantes" | "preview" | "classement" | "cdm")} style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              padding: "10px 8px", borderRadius: "10px", border: "none", cursor: "pointer",
              fontSize: "13px", fontWeight: 700, transition: "all 0.15s",
              background: tab === key ? "#2563EB" : "transparent",
              color: tab === key ? "white" : "#6B7280",
              boxShadow: tab === key ? "0 2px 8px rgba(37,99,235,0.3)" : "none",
            }}>
              <Icon size={15} /> {label}
              {badge > 0 && (
                <span style={{
                  fontSize: "10px", fontWeight: 800, width: "18px", height: "18px",
                  borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  background: tab === key ? "white" : "#2563EB",
                  color: tab === key ? "#2563EB" : "white",
                }}>{badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* ══ COMPTES ══ */}
        {tab === "users" && (
          <div>
            {usersLoading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", border: "3px solid #2563EB", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
              </div>
            ) : users.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: "16px", border: "1px solid #E5E7EB" }}>
                <Users size={40} style={{ color: "#D1D5DB", margin: "0 auto 12px" }} />
                <p style={{ fontSize: "15px", fontWeight: 600, color: "#374151" }}>Aucun compte inscrit</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[...users].sort(a => a.status === "PENDING" ? -1 : 1).map(u => (
                  <div key={u.id} style={{
                    background: "white", borderRadius: "14px",
                    border: u.status === "PENDING" ? "1px solid #BFDBFE" : "1px solid #E5E7EB",
                    boxShadow: u.status === "PENDING" ? "0 2px 12px rgba(37,99,235,0.08)" : "0 1px 3px rgba(0,0,0,0.06)",
                    overflow: "hidden",
                  }}>
                    {u.status === "PENDING" && <div style={{ height: "3px", background: "linear-gradient(90deg, #2563EB, #60A5FA)" }} />}
                    <div style={{ padding: "16px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: "180px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                            <div style={{
                              width: "36px", height: "36px", borderRadius: "50%",
                              background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
                              border: "1px solid #BFDBFE",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: "14px", fontWeight: 700, color: "#2563EB", flexShrink: 0,
                            }}>
                              {u.firstName[0]}{u.lastName[0]}
                            </div>
                            <div>
                              <p style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>
                                {u.firstName} {u.lastName}
                              </p>
                              <p style={{ fontSize: "12px", color: "#6B7280" }}>{u.email}</p>
                            </div>
                          </div>
                          <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "4px" }}>
                            Inscrit le {new Date(u.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                          </p>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                          {/* Status badge */}
                          {u.status === "APPROVED" && (
                            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "999px", background: "#F0FDF4", color: "#16A34A", border: "1px solid #BBF7D0" }}>
                              <CheckCircle2 size={11} /> Approuvé
                            </span>
                          )}
                          {u.status === "REJECTED" && (
                            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "999px", background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}>
                              <XCircle size={11} /> Refusé
                            </span>
                          )}
                          {u.status === "PENDING" && (
                            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "999px", background: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE" }}>
                              <Clock size={11} /> En attente
                            </span>
                          )}

                          {u.status === "PENDING" && (
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button onClick={() => handleApprove(u.id)} style={{
                                display: "flex", alignItems: "center", gap: "5px",
                                fontSize: "12px", fontWeight: 700, padding: "8px 14px",
                                borderRadius: "999px", border: "none", cursor: "pointer",
                                background: "linear-gradient(135deg, #16A34A, #15803D)",
                                color: "white", boxShadow: "0 2px 8px rgba(22,163,74,0.3)",
                              }}>
                                <CheckCircle2 size={13} /> Approuver
                              </button>
                              <button onClick={() => handleReject(u.id)} style={{
                                display: "flex", alignItems: "center", gap: "5px",
                                fontSize: "12px", fontWeight: 700, padding: "8px 14px",
                                borderRadius: "999px", border: "1px solid #FECACA", cursor: "pointer",
                                background: "#FEF2F2", color: "#DC2626",
                              }}>
                                <XCircle size={13} /> Refuser
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ PARIS ══ */}
        {tab === "bets" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Formulaire création */}
            <div style={{
              background: "white", borderRadius: "16px",
              border: "1px solid #BFDBFE", boxShadow: "0 4px 24px rgba(37,99,235,0.08)",
              overflow: "hidden",
            }}>
              <div style={{ padding: "4px 0 0", background: "linear-gradient(90deg, #2563EB, #60A5FA)", height: "3px" }} />
              <div style={{ padding: "20px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#111827", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#EFF6FF", border: "1px solid #BFDBFE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Plus size={15} style={{ color: "#2563EB" }} />
                  </span>
                  Nouveau pari
                </h3>

                {betError && <div style={{ marginBottom: "12px", padding: "10px 14px", borderRadius: "10px", background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", fontSize: "13px" }}>{betError}</div>}
                {betSuccess && <div style={{ marginBottom: "12px", padding: "10px 14px", borderRadius: "10px", background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#16A34A", fontSize: "13px" }}>{betSuccess}</div>}

                <form onSubmit={handleCreateBet} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Sport</label>
                      <input value={betForm.sport} onChange={e => setBetForm(p => ({ ...p, sport: e.target.value }))}
                        placeholder="Football, Tennis…" required style={inp}
                        onFocus={e => e.currentTarget.style.borderColor = "#2563EB"}
                        onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Cote</label>
                        <input type="number" step="0.01" min="1.01" value={betForm.odds}
                          onChange={e => setBetForm(p => ({ ...p, odds: e.target.value }))}
                          placeholder="2.10" required style={inp}
                          onFocus={e => e.currentTarget.style.borderColor = "#2563EB"}
                          onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Unité</label>
                        <input type="number" step="any" min="0.01" value={betForm.unit}
                          onChange={e => setBetForm(p => ({ ...p, unit: e.target.value }))}
                          placeholder="1" required style={inp}
                          onFocus={e => e.currentTarget.style.borderColor = "#2563EB"}
                          onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Description du pari</label>
                    <input value={betForm.description} onChange={e => setBetForm(p => ({ ...p, description: e.target.value }))}
                      placeholder="Ex : PSG Victoire — Ligue des Champions" required style={inp}
                      onFocus={e => e.currentTarget.style.borderColor = "#2563EB"}
                      onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Date du pari</label>
                    <input type="date" value={betForm.date} onChange={e => setBetForm(p => ({ ...p, date: e.target.value }))}
                      required style={inp}
                      onFocus={e => e.currentTarget.style.borderColor = "#2563EB"}
                      onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"} />
                  </div>
                  <button type="submit" disabled={betCreating} style={{
                    alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "6px",
                    fontSize: "13px", fontWeight: 700, padding: "10px 20px",
                    borderRadius: "999px", border: "none", cursor: betCreating ? "not-allowed" : "pointer",
                    background: betCreating ? "#93C5FD" : "linear-gradient(135deg, #2563EB, #1D4ED8)",
                    color: "white", boxShadow: betCreating ? "none" : "0 2px 12px rgba(37,99,235,0.35)",
                    transition: "all 0.15s",
                  }}>
                    <Plus size={15} /> {betCreating ? "Création…" : "Créer le pari"}
                  </button>
                </form>
              </div>
            </div>

            {/* Liste paris */}
            {betsLoading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", border: "3px solid #2563EB", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
              </div>
            ) : bets.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: "16px", border: "1px solid #E5E7EB" }}>
                <TrendingUp size={40} style={{ color: "#D1D5DB", margin: "0 auto 12px" }} />
                <p style={{ fontSize: "15px", fontWeight: 600, color: "#374151" }}>Aucun pari créé</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {bets.map(bet => (
                  <div key={bet.id} style={{
                    background: "white", borderRadius: "14px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                    overflow: "hidden",
                  }}>
                    {bet.status === "WON" && <div style={{ height: "3px", background: "linear-gradient(90deg, #16A34A, #4ADE80)" }} />}
                    {bet.status === "LOST" && <div style={{ height: "3px", background: "linear-gradient(90deg, #DC2626, #F87171)" }} />}
                    {bet.status === "PENDING" && <div style={{ height: "3px", background: "linear-gradient(90deg, #2563EB, #60A5FA)" }} />}

                    {editingBet === bet.id ? (
                      /* Mode édition */
                      <form onSubmit={handleEditBet} style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>Modifier le pari</span>
                          <button type="button" onClick={() => setEditingBet(null)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: "2px" }}>
                            <X size={16} />
                          </button>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                          <div>
                            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "5px" }}>Sport</label>
                            <input value={editForm.sport} onChange={e => setEditForm(p => ({ ...p, sport: e.target.value }))} required style={inp}
                              onFocus={e => e.currentTarget.style.borderColor = "#2563EB"}
                              onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"} />
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                            <div>
                              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "5px" }}>Cote</label>
                              <input type="number" step="0.01" min="1.01" value={editForm.odds} onChange={e => setEditForm(p => ({ ...p, odds: e.target.value }))} required style={inp}
                                onFocus={e => e.currentTarget.style.borderColor = "#2563EB"}
                                onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"} />
                            </div>
                            <div>
                              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "5px" }}>Unité</label>
                              <input type="number" step="any" min="0.01" value={editForm.unit} onChange={e => setEditForm(p => ({ ...p, unit: e.target.value }))} required style={inp}
                                onFocus={e => e.currentTarget.style.borderColor = "#2563EB"}
                                onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"} />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "5px" }}>Description</label>
                          <input value={editForm.description} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} required style={inp}
                            onFocus={e => e.currentTarget.style.borderColor = "#2563EB"}
                            onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"} />
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button type="submit" disabled={editSaving} style={{
                            fontSize: "12px", fontWeight: 700, padding: "8px 16px", borderRadius: "999px", border: "none", cursor: "pointer",
                            background: editSaving ? "#93C5FD" : "linear-gradient(135deg, #2563EB, #1D4ED8)", color: "white",
                            boxShadow: editSaving ? "none" : "0 2px 8px rgba(37,99,235,0.3)",
                          }}>
                            {editSaving ? "Enregistrement…" : "Enregistrer"}
                          </button>
                          <button type="button" onClick={() => setEditingBet(null)} style={{
                            fontSize: "12px", fontWeight: 600, padding: "8px 16px", borderRadius: "999px",
                            border: "1px solid #E5E7EB", background: "white", color: "#6B7280", cursor: "pointer",
                          }}>Annuler</button>
                        </div>
                      </form>
                    ) : (
                      /* Mode lecture */
                      <div style={{ padding: "16px" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "6px" }}>
                              <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 10px", borderRadius: "999px", background: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE" }}>{bet.sport}</span>
                              {bet.status === "PENDING" && <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: 600, padding: "3px 8px", borderRadius: "999px", background: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE" }}><Clock size={10} /> En attente</span>}
                              {bet.status === "WON" && <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: 600, padding: "3px 8px", borderRadius: "999px", background: "#F0FDF4", color: "#16A34A", border: "1px solid #BBF7D0" }}><Trophy size={10} /> Gagnant</span>}
                              {bet.status === "LOST" && <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: 600, padding: "3px 8px", borderRadius: "999px", background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}><XCircle size={10} /> Perdant</span>}
                            </div>
                            <p style={{ fontSize: "14px", fontWeight: 600, color: "#111827", marginBottom: "6px" }}>{bet.description}</p>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                              <span style={{ fontSize: "13px", fontWeight: 700, color: "#2563EB" }}>@{bet.odds}</span>
                              <span style={{ fontSize: "12px", color: "#6B7280" }}>{bet.unit}U</span>
                              <span style={{ fontSize: "12px", color: "#9CA3AF" }}>{bet.followers}/{bet.totalUsers} suivis</span>
                              <span style={{ fontSize: "12px", color: "#9CA3AF" }}>{new Date(bet.createdAt).toLocaleDateString("fr-FR")}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px", flexShrink: 0 }}>
                            {bet.status === "PENDING" && (
                              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                                <button onClick={() => handleSetResult(bet.id, "WON")} style={{
                                  display: "flex", alignItems: "center", gap: "4px",
                                  fontSize: "11px", fontWeight: 700, padding: "6px 12px", borderRadius: "999px", border: "none", cursor: "pointer",
                                  background: "linear-gradient(135deg, #16A34A, #15803D)", color: "white",
                                  boxShadow: "0 2px 6px rgba(22,163,74,0.3)",
                                }}><CheckCircle2 size={12} /> Gagné</button>
                                <button onClick={() => handleSetResult(bet.id, "LOST")} style={{
                                  display: "flex", alignItems: "center", gap: "4px",
                                  fontSize: "11px", fontWeight: 700, padding: "6px 12px", borderRadius: "999px",
                                  border: "1px solid #FECACA", cursor: "pointer", background: "#FEF2F2", color: "#DC2626",
                                }}><XCircle size={12} /> Perdu</button>
                              </div>
                            )}
                            <div style={{ display: "flex", gap: "4px" }}>
                              <button onClick={() => startEdit(bet)} title="Modifier" style={{
                                background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "8px",
                                padding: "6px", cursor: "pointer", color: "#6B7280", display: "flex",
                              }}><Pencil size={13} /></button>
                              <button onClick={() => handleDeleteBet(bet.id)} title="Supprimer" style={{
                                background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px",
                                padding: "6px", cursor: "pointer", color: "#DC2626", display: "flex",
                              }}><Trash2 size={13} /></button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ MONTANTES ══ */}
        {tab === "montantes" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Formulaire créer montante */}
            <div style={{ background: "white", borderRadius: "16px", border: "1px solid #FDE68A", boxShadow: "0 4px 24px rgba(245,158,11,0.1)", overflow: "hidden" }}>
              <div style={{ height: "3px", background: "linear-gradient(90deg, #F59E0B, #FBBF24)" }} />
              <div style={{ padding: "20px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#111827", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#FEF3C7", border: "1px solid #FDE68A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Plus size={15} style={{ color: "#D97706" }} />
                  </span>
                  Nouvelle montante
                </h3>
                {montanteError && <div style={{ marginBottom: "12px", padding: "10px 14px", borderRadius: "10px", background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", fontSize: "13px" }}>{montanteError}</div>}
                <form onSubmit={handleCreateMontante} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Date de début</label>
                      <input type="date" value={montanteForm.startDate}
                        onChange={e => setMontanteForm(p => ({ ...p, startDate: e.target.value }))}
                        required style={inp}
                        onFocus={e => e.currentTarget.style.borderColor = "#F59E0B"}
                        onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Description (optionnel)</label>
                      <input value={montanteForm.description}
                        onChange={e => setMontanteForm(p => ({ ...p, description: e.target.value }))}
                        placeholder="Ex : Récupération après série de pertes…" style={inp}
                        onFocus={e => e.currentTarget.style.borderColor = "#F59E0B"}
                        onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"} />
                    </div>
                  </div>
                  <button type="submit" disabled={montanteCreating} style={{
                    alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "6px",
                    fontSize: "13px", fontWeight: 700, padding: "10px 20px",
                    borderRadius: "999px", border: "none", cursor: montanteCreating ? "not-allowed" : "pointer",
                    background: montanteCreating ? "#FDE68A" : "linear-gradient(135deg, #F59E0B, #D97706)",
                    color: "white", boxShadow: montanteCreating ? "none" : "0 2px 12px rgba(245,158,11,0.35)",
                    transition: "all 0.15s",
                  }}>
                    <Plus size={15} /> {montanteCreating ? "Création…" : "Créer la montante"}
                  </button>
                </form>
              </div>
            </div>

            {/* Liste montantes */}
            {montantesLoading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", border: "3px solid #F59E0B", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
              </div>
            ) : montantes.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: "16px", border: "1px solid #E5E7EB" }}>
                <Layers size={40} style={{ color: "#D1D5DB", margin: "0 auto 12px" }} />
                <p style={{ fontSize: "15px", fontWeight: 600, color: "#374151" }}>Aucune montante créée</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {montantes.map(m => {
                  const isExpanded = expandedMontante === m.id;
                  const stepForm = stepForms[m.id] ?? { sport: "", description: "", odds: "" };
                  return (
                    <div key={m.id} style={{ background: "white", borderRadius: "16px", border: `1px solid ${m.status === "ACTIVE" ? "#FDE68A" : "#E5E7EB"}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                      <div style={{ height: "3px", background: m.status === "ACTIVE" ? "linear-gradient(90deg, #F59E0B, #FBBF24)" : "linear-gradient(90deg, #9CA3AF, #D1D5DB)" }} />
                      <div style={{ padding: "16px" }}>
                        {/* Header */}
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "12px" }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                              <span style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: "20px", letterSpacing: "0.06em", color: "#111827" }}>
                                Montante N°{m.number}
                              </span>
                              {m.status === "ACTIVE" && <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "2px 8px", borderRadius: "999px", background: "#FEF3C7", color: "#D97706", border: "1px solid #FDE68A" }}>En cours</span>}
                              {m.status === "COMPLETED" && <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "2px 8px", borderRadius: "999px", background: "#F3F4F6", color: "#6B7280", border: "1px solid #E5E7EB" }}>Terminée</span>}
                            </div>

                            {/* Édition description + date */}
                            {editingMontante === m.id ? (
                              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                                  <div>
                                    <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Date de début</label>
                                    <input type="date" value={montanteEditForm.startDate}
                                      onChange={e => setMontanteEditForm(p => ({ ...p, startDate: e.target.value }))}
                                      style={{ ...inp, fontSize: "13px", padding: "7px 10px" }}
                                      onFocus={e => e.currentTarget.style.borderColor = "#F59E0B"}
                                      onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"} />
                                  </div>
                                  <div>
                                    <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Description</label>
                                    <input value={montanteEditForm.description}
                                      onChange={e => setMontanteEditForm(p => ({ ...p, description: e.target.value }))}
                                      placeholder="Description…"
                                      style={{ ...inp, fontSize: "13px", padding: "7px 10px" }}
                                      onFocus={e => e.currentTarget.style.borderColor = "#F59E0B"}
                                      onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"} />
                                  </div>
                                </div>
                                <div style={{ display: "flex", gap: "6px" }}>
                                  <button onClick={() => handleEditMontante(m.id)} style={{ fontSize: "11px", fontWeight: 700, padding: "6px 14px", borderRadius: "999px", border: "none", cursor: "pointer", background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "white" }}>Enregistrer</button>
                                  <button onClick={() => setEditingMontante(null)} style={{ fontSize: "11px", fontWeight: 600, padding: "6px 12px", borderRadius: "999px", border: "1px solid #E5E7EB", background: "white", color: "#6B7280", cursor: "pointer" }}>Annuler</button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p style={{ fontSize: "12px", color: "#6B7280", marginTop: "4px" }}>
                                  Début : {new Date(m.startDate).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                                </p>
                                {m.description && <p style={{ fontSize: "13px", color: "#374151", marginTop: "4px" }}>{m.description}</p>}
                                <p style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "4px" }}>
                                  {m.steps.length} étape{m.steps.length !== 1 ? "s" : ""} · {m.followers}/{m.totalUsers} participants
                                </p>
                              </>
                            )}
                          </div>
                          <div style={{ display: "flex", gap: "6px", flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
                            <button onClick={() => {
                              if (isExpanded && expandedMontante === m.id) { setExpandedMontante(null); setEditingMontante(null); }
                              else { setExpandedMontante(m.id); setEditingMontante(null); }
                            }}
                              style={{ background: isExpanded ? "#EFF6FF" : "#F9FAFB", border: `1px solid ${isExpanded ? "#BFDBFE" : "#E5E7EB"}`, borderRadius: "8px", padding: "6px 10px", cursor: "pointer", fontSize: "11px", fontWeight: 700, color: isExpanded ? "#2563EB" : "#374151", display: "flex", alignItems: "center", gap: "4px" }}>
                              <Pencil size={12} /> {isExpanded ? "Fermer" : "Gérer"}
                            </button>
                            {isExpanded && editingMontante !== m.id && (
                              <button onClick={() => { setEditingMontante(m.id); setMontanteEditForm({ description: m.description ?? "", startDate: m.startDate.split("T")[0] }); }}
                                style={{ background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: "8px", padding: "6px 10px", cursor: "pointer", fontSize: "11px", fontWeight: 700, color: "#D97706", display: "flex", alignItems: "center", gap: "4px" }}>
                                <Pencil size={12} /> Modifier infos
                              </button>
                            )}
                            <button onClick={() => handleToggleMontanteStatus(m)}
                              style={{ background: m.status === "ACTIVE" ? "#F3F4F6" : "#FEF3C7", border: `1px solid ${m.status === "ACTIVE" ? "#E5E7EB" : "#FDE68A"}`, borderRadius: "8px", padding: "6px 10px", cursor: "pointer", fontSize: "11px", fontWeight: 700, color: m.status === "ACTIVE" ? "#6B7280" : "#D97706" }}>
                              {m.status === "ACTIVE" ? "Terminer" : "Réactiver"}
                            </button>
                            <button onClick={() => handleDeleteMontante(m.id)}
                              style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", padding: "6px", cursor: "pointer", color: "#DC2626", display: "flex" }}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        {/* Simulateur mise */}
                        {m.steps.length > 0 && (
                          <div style={{ background: "linear-gradient(135deg, #FFFBEB, #FEF3C7)", border: "1px solid #FDE68A", borderRadius: "12px", padding: "10px 14px", marginBottom: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "12px", fontWeight: 700, color: "#92400E", textTransform: "uppercase", letterSpacing: "0.08em" }}>Simuler avec :</span>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <input
                                type="number" min="1" step="any"
                                value={adminSimulStake}
                                onChange={e => setAdminSimulStake(e.target.value)}
                                style={{ width: "80px", padding: "6px 8px", borderRadius: "8px", border: "2px solid #F59E0B", background: "white", fontSize: "14px", fontWeight: 700, color: "#D97706", outline: "none", textAlign: "right" }}
                              />
                              <span style={{ fontSize: "13px", fontWeight: 700, color: "#D97706" }}>€</span>
                              {(() => {
                                const s = Number(adminSimulStake);
                                if (!s || s <= 0) return null;
                                const calcs = computeAdminMontanteSteps(m.steps, s);
                                const last = calcs[calcs.length - 1];
                                const allWon = m.steps.every(st => st.status === "WON");
                                const anyLost = m.steps.some(st => st.status === "LOST");
                                const finalAmt = anyLost ? 0 : last.potentialReturn;
                                const profit = parseFloat((finalAmt - s).toFixed(2));
                                return (
                                  <span style={{ fontSize: "13px", fontWeight: 800, color: profit > 0 ? "#16A34A" : "#DC2626" }}>
                                    → {allWon || anyLost ? `${finalAmt.toFixed(2)} €` : `${finalAmt.toFixed(2)} € potentiel`}
                                    {profit > 0 && ` (+${profit.toFixed(2)} €)`}
                                  </span>
                                );
                              })()}
                            </div>
                          </div>
                        )}

                        {/* Steps */}
                        {m.steps.length > 0 && (
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: isExpanded ? "16px" : "0" }}>
                            {m.steps.map((step, idx) => {
                              const s = Number(adminSimulStake);
                              const calcs = s > 0 ? computeAdminMontanteSteps(m.steps, s) : null;
                              const calc = calcs ? calcs[idx] : null;
                              return (
                              <div key={step.id} style={{
                                background: step.status === "WON" ? "#F0FDF4" : step.status === "LOST" ? "#FEF2F2" : "#F9FAFB",
                                border: `1px solid ${step.status === "WON" ? "#BBF7D0" : step.status === "LOST" ? "#FECACA" : "#E5E7EB"}`,
                                borderRadius: "10px", overflow: "hidden",
                              }}>
                                {editingStep === step.id ? (
                                  /* Mode édition étape */
                                  <div style={{ padding: "12px" }}>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 80px", gap: "6px", marginBottom: "6px" }}>
                                      <input value={stepEditForm.sport} onChange={e => setStepEditForm(p => ({ ...p, sport: e.target.value }))}
                                        placeholder="Sport" style={{ ...inp, fontSize: "12px", padding: "6px 10px" }}
                                        onFocus={e => e.currentTarget.style.borderColor = "#F59E0B"}
                                        onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"} />
                                      <input type="number" step="0.01" min="1.01" value={stepEditForm.odds}
                                        onChange={e => setStepEditForm(p => ({ ...p, odds: e.target.value }))}
                                        placeholder="Cote" style={{ ...inp, fontSize: "12px", padding: "6px 10px" }}
                                        onFocus={e => e.currentTarget.style.borderColor = "#F59E0B"}
                                        onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"} />
                                      <button onClick={() => handleEditStep(m.id, step.id)}
                                        style={{ fontSize: "11px", fontWeight: 700, borderRadius: "8px", border: "none", cursor: "pointer", background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "white" }}>
                                        Sauver
                                      </button>
                                    </div>
                                    <div style={{ display: "flex", gap: "6px" }}>
                                      <input value={stepEditForm.description} onChange={e => setStepEditForm(p => ({ ...p, description: e.target.value }))}
                                        placeholder="Description" style={{ ...inp, fontSize: "12px", padding: "6px 10px", flex: 1 }}
                                        onFocus={e => e.currentTarget.style.borderColor = "#F59E0B"}
                                        onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"} />
                                      <button onClick={() => setEditingStep(null)}
                                        style={{ background: "none", border: "1px solid #E5E7EB", borderRadius: "8px", padding: "6px 10px", cursor: "pointer", fontSize: "11px", color: "#6B7280", fontWeight: 600 }}>
                                        Annuler
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px" }}>
                                  <div style={{ width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: step.status === "WON" ? "#16A34A" : step.status === "LOST" ? "#DC2626" : "#E5E7EB" }}>
                                    {step.status === "WON" && <CheckCircle2 size={12} style={{ color: "white" }} />}
                                    {step.status === "LOST" && <XCircle size={12} style={{ color: "white" }} />}
                                    {step.status === "PENDING" && <span style={{ fontSize: "10px", fontWeight: 800, color: "#6B7280" }}>{step.stepNumber}</span>}
                                  </div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: "10px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>{step.sport} @{step.odds}</div>
                                    <div style={{ fontSize: "13px", color: "#374151" }}>{step.description}</div>
                                  </div>
                                  <div style={{ display: "flex", gap: "4px", flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
                                    {step.status === "PENDING" && (
                                      <>
                                        <button onClick={() => handleSetStepResult(m.id, step.id, "WON")} style={{ fontSize: "10px", fontWeight: 700, padding: "4px 8px", borderRadius: "999px", border: "none", cursor: "pointer", background: "linear-gradient(135deg, #16A34A, #15803D)", color: "white" }}>✓ Gagné</button>
                                        <button onClick={() => handleSetStepResult(m.id, step.id, "LOST")} style={{ fontSize: "10px", fontWeight: 700, padding: "4px 8px", borderRadius: "999px", border: "1px solid #FECACA", cursor: "pointer", background: "#FEF2F2", color: "#DC2626" }}>✗ Perdu</button>
                                      </>
                                    )}
                                    {(step.status === "WON" || step.status === "LOST") && (
                                      <button onClick={() => handleResetStepResult(m.id, step.id)} style={{ fontSize: "10px", fontWeight: 700, padding: "4px 8px", borderRadius: "999px", border: "1px solid #E5E7EB", cursor: "pointer", background: "#F9FAFB", color: "#6B7280" }}>↺ Reset</button>
                                    )}
                                    {isExpanded && (
                                      <button onClick={() => { setEditingStep(step.id); setStepEditForm({ sport: step.sport, description: step.description, odds: String(step.odds) }); }}
                                        style={{ background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: "6px", padding: "4px 6px", cursor: "pointer", color: "#D97706", display: "flex" }}>
                                        <Pencil size={11} />
                                      </button>
                                    )}
                                    <button onClick={() => handleDeleteStep(m.id, step.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", display: "flex", padding: "2px" }}><Trash2 size={12} /></button>
                                  </div>
                                </div>
                                )}
                                {calc && (
                                  <div style={{
                                    padding: "6px 12px",
                                    background: step.status === "WON" ? "#DCFCE7" : step.status === "LOST" ? "#FEE2E2" : "#F0F9FF",
                                    borderTop: `1px solid ${step.status === "WON" ? "#BBF7D0" : step.status === "LOST" ? "#FECACA" : "#BAE6FD"}`,
                                    display: "flex", alignItems: "center", gap: "10px", fontSize: "11px", fontWeight: 600,
                                    color: step.status === "WON" ? "#15803D" : step.status === "LOST" ? "#B91C1C" : "#0369A1",
                                  }}>
                                    <span>Mise : <strong>{calc.betAmount.toFixed(2)} €</strong></span>
                                    <span>→</span>
                                    <span style={{ fontWeight: 800, fontSize: "12px" }}>
                                      {step.status === "LOST" ? `-${calc.betAmount.toFixed(2)} €` : `${calc.potentialReturn.toFixed(2)} € (+${calc.profit.toFixed(2)} €)`}
                                    </span>
                                  </div>
                                )}
                              </div>
                            );})}
                          </div>
                        )}

                        {/* Ajouter étape */}
                        {isExpanded && (
                          <div style={{ borderTop: m.steps.length > 0 ? "1px solid #F3F4F6" : "none", paddingTop: m.steps.length > 0 ? "16px" : "0" }}>
                            <p style={{ fontSize: "12px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>Ajouter une étape</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 80px", gap: "8px" }}>
                                <input placeholder="Sport" value={stepForm.sport}
                                  onChange={e => setStepForms(p => ({ ...p, [m.id]: { ...stepForm, sport: e.target.value } }))}
                                  style={{ ...inp, fontSize: "13px", padding: "8px 12px" }}
                                  onFocus={e => e.currentTarget.style.borderColor = "#F59E0B"}
                                  onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"} />
                                <input placeholder="Cote (ex: 2.10)" type="number" step="0.01" min="1.01" value={stepForm.odds}
                                  onChange={e => setStepForms(p => ({ ...p, [m.id]: { ...stepForm, odds: e.target.value } }))}
                                  style={{ ...inp, fontSize: "13px", padding: "8px 12px" }}
                                  onFocus={e => e.currentTarget.style.borderColor = "#F59E0B"}
                                  onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"} />
                                <button
                                  onClick={() => handleAddStep(m.id)}
                                  disabled={stepSaving === m.id || !stepForm.sport || !stepForm.description || !stepForm.odds}
                                  style={{
                                    fontSize: "12px", fontWeight: 700, borderRadius: "10px", border: "none", cursor: "pointer",
                                    background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "white",
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: "4px",
                                    opacity: (!stepForm.sport || !stepForm.description || !stepForm.odds) ? 0.5 : 1,
                                  }}>
                                  <Plus size={14} /> Ajouter
                                </button>
                              </div>
                              <input placeholder="Description du pari (ex: PSG Victoire, Ligue des Champions)" value={stepForm.description}
                                onChange={e => setStepForms(p => ({ ...p, [m.id]: { ...stepForm, description: e.target.value } }))}
                                style={{ ...inp, fontSize: "13px", padding: "8px 12px" }}
                                onFocus={e => e.currentTarget.style.borderColor = "#F59E0B"}
                                onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══ APERÇU VIP ══ */}
        {tab === "preview" && (() => {
          const now = new Date();
          const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const startOfWeek = new Date(startOfDay);
          startOfWeek.setDate(startOfDay.getDate() - (startOfDay.getDay() || 7) + 1);
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

          function calcPeriod(from: Date) {
            const filtered = bets.filter(b => b.status !== "PENDING" && new Date(b.createdAt) >= from);
            const total = parseFloat(filtered.reduce((acc, b) => acc + (betGainLoss(b) ?? 0), 0).toFixed(2));
            return { total, count: filtered.length };
          }

          const statsDay = calcPeriod(startOfDay);
          const statsWeek = calcPeriod(startOfWeek);
          const statsMonth = calcPeriod(startOfMonth);
          const statsAll = calcPeriod(new Date(0));

          const displayBets = previewSelectedDay
            ? bets.filter(b => toDateKey(new Date(b.createdAt)) === previewSelectedDay)
            : bets;

          const selStats = previewSelectedDay ? previewDayStats(bets, previewSelectedDay) : null;

          const periodFromMap: Record<AdminPeriodKey, Date> = {
            day: startOfDay, week: startOfWeek, month: startOfMonth, all: new Date(0),
          };
          const periodLabelMap: Record<AdminPeriodKey, string> = {
            day: "Aujourd'hui", week: "Cette semaine", month: "Ce mois", all: "Total",
          };

          return (
            <div>
              {/* Period detail modal */}
              {previewSelectedPeriod && (
                <AdminPeriodDetailModal
                  periodKey={previewSelectedPeriod}
                  label={periodLabelMap[previewSelectedPeriod]}
                  from={periodFromMap[previewSelectedPeriod]}
                  bets={bets}
                  onClose={() => setPreviewSelectedPeriod(null)}
                />
              )}

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", marginBottom: "24px" }}>
                <PreviewStatCard label="Aujourd'hui" total={statsDay.total} count={statsDay.count} onClick={() => setPreviewSelectedPeriod("day")} />
                <PreviewStatCard label="Cette semaine" total={statsWeek.total} count={statsWeek.count} onClick={() => setPreviewSelectedPeriod("week")} />
                <PreviewStatCard label="Ce mois" total={statsMonth.total} count={statsMonth.count} onClick={() => setPreviewSelectedPeriod("month")} />
                <PreviewStatCard label="Total" total={statsAll.total} count={statsAll.count} isTotal onClick={() => setPreviewSelectedPeriod("all")} />
              </div>

              {/* Télécharger stats d'un mois */}
              {(() => {
                const mNames = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
                const months: { value: string; label: string }[] = [];
                const s = new Date(2026, 3, 1);
                const nowM = new Date();
                for (let c = new Date(s); c <= new Date(nowM.getFullYear(), nowM.getMonth(), 1); c = new Date(c.getFullYear(), c.getMonth() + 1, 1)) {
                  months.push({ value: `${c.getFullYear()}-${String(c.getMonth()+1).padStart(2,"0")}`, label: `${mNames[c.getMonth()]} ${c.getFullYear()}` });
                }
                months.reverse();
                const defaultM = months[0]?.value ?? "";
                return (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px", background: "white", borderRadius: "14px", padding: "12px 16px", border: "1px solid #E5E7EB" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", flexShrink: 0 }}>Télécharger</span>
                    <select
                      id="dl-month-select"
                      defaultValue={defaultM}
                      style={{
                        flex: 1, padding: "8px 12px", borderRadius: "10px",
                        border: "1px solid #E5E7EB", background: "#F9FAFB",
                        fontSize: "14px", fontWeight: 600, color: "#111827",
                        outline: "none", cursor: "pointer",
                      }}
                    >
                      {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                    <button
                      onClick={() => {
                        const sel = (document.getElementById("dl-month-select") as HTMLSelectElement);
                        const val = sel?.value ?? defaultM;
                        const label = months.find(m => m.value === val)?.label ?? val;
                        downloadMonthStats(val, label, bets);
                      }}
                      style={{
                        display: "flex", alignItems: "center", gap: "6px",
                        background: "linear-gradient(135deg, #2563EB, #1D4ED8)", color: "white",
                        fontSize: "13px", fontWeight: 700, padding: "9px 18px",
                        borderRadius: "10px", border: "none", cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(37,99,235,0.3)", flexShrink: 0,
                        whiteSpace: "nowrap",
                      }}
                    >
                      ⬇ PNG
                    </button>
                  </div>
                );
              })()}

              {/* Calendrier */}
              <PreviewCalendar bets={bets} selectedDay={previewSelectedDay} onSelectDay={setPreviewSelectedDay} />

              {/* Bandeau jour sélectionné */}
              {previewSelectedDay && selStats && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "white", borderRadius: "12px", padding: "12px 16px", border: "1px solid #BFDBFE", marginBottom: "16px", boxShadow: "0 2px 8px rgba(37,99,235,0.08)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <CalendarDays size={16} style={{ color: "#2563EB" }} />
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>
                      {new Date(previewSelectedDay + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {selStats.hasPending && <span style={{ fontSize: "12px", color: "#2563EB", fontWeight: 600 }}>En cours…</span>}
                    <span style={{ fontSize: "16px", fontWeight: 800, color: selStats.total > 0 ? "#16A34A" : selStats.total < 0 ? "#DC2626" : "#6B7280" }}>
                      {selStats.total > 0 ? "+" : ""}{selStats.total}U
                    </span>
                  </div>
                </div>
              )}

              {/* Liste paris */}
              {betsLoading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", border: "3px solid #2563EB", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
                </div>
              ) : displayBets.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: "16px", border: "1px solid #E5E7EB" }}>
                  <CalendarDays size={40} style={{ color: "#D1D5DB", margin: "0 auto 12px" }} />
                  <p style={{ fontSize: "15px", fontWeight: 600, color: "#374151" }}>
                    {previewSelectedDay ? "Aucun pari ce jour-là" : "Aucun pari créé"}
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {displayBets.map(bet => {
                    const gl = betGainLoss(bet);
                    return (
                      <div key={bet.id} style={{ background: "white", borderRadius: "14px", border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                        {bet.status === "WON" && <div style={{ height: "3px", background: "linear-gradient(90deg, #16A34A, #4ADE80)" }} />}
                        {bet.status === "LOST" && <div style={{ height: "3px", background: "linear-gradient(90deg, #DC2626, #F87171)" }} />}
                        {bet.status === "PENDING" && <div style={{ height: "3px", background: "linear-gradient(90deg, #2563EB, #60A5FA)" }} />}
                        <div style={{ padding: "16px" }}>
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "12px" }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                                <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 10px", borderRadius: "999px", background: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE" }}>{bet.sport}</span>
                                {bet.status === "PENDING" && <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: 600, padding: "3px 8px", borderRadius: "999px", background: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE" }}><Clock size={10} /> En attente</span>}
                                {bet.status === "WON" && <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: 600, padding: "3px 8px", borderRadius: "999px", background: "#F0FDF4", color: "#16A34A", border: "1px solid #BBF7D0" }}><CheckCircle2 size={10} /> Gagnant</span>}
                                {bet.status === "LOST" && <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: 600, padding: "3px 8px", borderRadius: "999px", background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}><XCircle size={10} /> Perdant</span>}
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
                              <span style={{ marginLeft: "8px", fontSize: "11px", color: "#BFDBFE" }}>{bet.followers}/{bet.totalUsers} suivis</span>
                            </span>
                            {gl !== null && (
                              <span style={{ fontSize: "15px", fontWeight: 800, color: gl > 0 ? "#16A34A" : "#DC2626" }}>
                                {gl > 0 ? "+" : ""}{gl}U
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()}

        {/* ══ CLASSEMENT ══ */}
        {tab === "classement" && (() => {
          const top3 = leaderboard.slice(0, 3);
          const monthNames = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
          const allMonths: { value: string; label: string }[] = [];
          const start = new Date(2026, 3, 1);
          const nowD = new Date();
          const endM = new Date(nowD.getFullYear(), nowD.getMonth(), 1);
          for (let cur = new Date(start); cur <= endM; cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1)) {
            allMonths.push({ value: `${cur.getFullYear()}-${String(cur.getMonth()+1).padStart(2,"0")}`, label: `${monthNames[cur.getMonth()]} ${cur.getFullYear()}` });
          }
          allMonths.reverse();

          const periodLabels: Record<string, string> = { day: "Aujourd'hui", week: "Cette semaine", all: "Tout le temps" };
          const periodLabel = lbPeriod === "specificMonth"
            ? (allMonths.find(m => m.value === lbMonth)?.label ?? lbMonth)
            : (periodLabels[lbPeriod] ?? "Ce mois");

          return (
            <div>
              {/* Period filter */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "12px", background: "white", borderRadius: "12px", padding: "6px", border: "1px solid #E5E7EB" }}>
                {(["day", "week", "all"] as const).map(p => (
                  <button key={p} onClick={() => setLbPeriod(p)} style={{
                    flex: 1, padding: "8px 4px", borderRadius: "8px", border: "none",
                    fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                    background: lbPeriod === p ? "#2563EB" : "transparent",
                    color: lbPeriod === p ? "white" : "#6B7280",
                  }}>
                    {periodLabels[p]}
                  </button>
                ))}
              </div>

              {/* Month selector */}
              <div style={{ marginBottom: "24px", position: "relative" }}>
                <select
                  value={lbPeriod === "specificMonth" ? lbMonth : ""}
                  onChange={e => { setLbMonth(e.target.value); setLbPeriod("specificMonth"); }}
                  style={{
                    width: "100%", padding: "10px 36px 10px 14px", borderRadius: "12px",
                    border: lbPeriod === "specificMonth" ? "2px solid #2563EB" : "1px solid #E5E7EB",
                    background: lbPeriod === "specificMonth" ? "#EFF6FF" : "white",
                    fontSize: "14px", fontWeight: 600,
                    color: lbPeriod === "specificMonth" ? "#2563EB" : "#6B7280",
                    appearance: "none", cursor: "pointer", outline: "none",
                  }}
                >
                  <option value="" disabled>Choisir un mois…</option>
                  {allMonths.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
                <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "12px", pointerEvents: "none", color: lbPeriod === "specificMonth" ? "#2563EB" : "#9CA3AF" }}>▾</span>
              </div>

              {lbLoading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", border: "3px solid #2563EB", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
                </div>
              ) : leaderboard.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: "16px", border: "1px solid #E5E7EB" }}>
                  <BarChart2 size={40} style={{ color: "#D1D5DB", margin: "0 auto 12px" }} />
                  <p style={{ fontSize: "15px", fontWeight: 600, color: "#374151" }}>Aucune donnée sur cette période</p>
                  <p style={{ fontSize: "13px", color: "#9CA3AF", marginTop: "4px" }}>Les membres doivent avoir suivi au moins un pari terminé.</p>
                </div>
              ) : (
                <>
                  {/* Podium top 3 */}
                  {top3.length > 0 && (
                    <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)", borderRadius: "20px", padding: "28px 24px 24px", marginBottom: "16px", boxShadow: "0 8px 32px rgba(15,23,42,0.4)" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                        <div>
                          <p style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "4px" }}>Top 3 — {periodLabel}</p>
                          <h2 style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: "28px", letterSpacing: "0.06em", color: "white", lineHeight: 1 }}>Classement</h2>
                        </div>
                        <button
                          onClick={() => downloadPodium(top3, periodLabel)}
                          style={{
                            display: "flex", alignItems: "center", gap: "6px",
                            background: "rgba(255,255,255,0.12)", color: "white",
                            fontSize: "12px", fontWeight: 600, padding: "9px 16px",
                            borderRadius: "10px", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
                        >
                          ⬇ Télécharger image
                        </button>
                      </div>

                      {/* Podium visual */}
                      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "12px", marginBottom: "8px" }}>
                        {/* 2nd place */}
                        {top3[1] && (
                          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                            <div style={{ fontSize: "22px", fontWeight: 900, color: "#4ADE80" }}>
                              {top3[1].totalUnits >= 0 ? "+" : ""}{top3[1].totalUnits}U
                            </div>
                            <div style={{ fontSize: "13px", fontWeight: 700, color: "white", textAlign: "center" }}>
                              {top3[1].firstName} {top3[1].lastName}
                            </div>
                            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>{top3[1].followedCount} paris</div>
                            <div style={{
                              width: "100%", borderRadius: "10px 10px 0 0", padding: "20px 0",
                              background: "rgba(148,163,184,0.2)", border: "1px solid rgba(148,163,184,0.4)",
                              borderBottom: "none", textAlign: "center",
                              fontSize: "32px",
                            }}>🥈</div>
                          </div>
                        )}
                        {/* 1st place */}
                        {top3[0] && (
                          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                            <div style={{ fontSize: "26px", fontWeight: 900, color: "#4ADE80" }}>
                              {top3[0].totalUnits >= 0 ? "+" : ""}{top3[0].totalUnits}U
                            </div>
                            <div style={{ fontSize: "14px", fontWeight: 700, color: "white", textAlign: "center" }}>
                              {top3[0].firstName} {top3[0].lastName}
                            </div>
                            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>{top3[0].followedCount} paris</div>
                            <div style={{
                              width: "100%", borderRadius: "10px 10px 0 0", padding: "30px 0",
                              background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.4)",
                              borderBottom: "none", textAlign: "center",
                              fontSize: "38px",
                            }}>🥇</div>
                          </div>
                        )}
                        {/* 3rd place */}
                        {top3[2] && (
                          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                            <div style={{ fontSize: "22px", fontWeight: 900, color: top3[2].totalUnits >= 0 ? "#4ADE80" : "#F87171" }}>
                              {top3[2].totalUnits >= 0 ? "+" : ""}{top3[2].totalUnits}U
                            </div>
                            <div style={{ fontSize: "13px", fontWeight: 700, color: "white", textAlign: "center" }}>
                              {top3[2].firstName} {top3[2].lastName}
                            </div>
                            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>{top3[2].followedCount} paris</div>
                            <div style={{
                              width: "100%", borderRadius: "10px 10px 0 0", padding: "14px 0",
                              background: "rgba(205,127,50,0.2)", border: "1px solid rgba(205,127,50,0.4)",
                              borderBottom: "none", textAlign: "center",
                              fontSize: "28px",
                            }}>🥉</div>
                          </div>
                        )}
                      </div>
                      {/* Base */}
                      <div style={{ height: "8px", background: "rgba(255,255,255,0.08)", borderRadius: "4px" }} />
                    </div>
                  )}

                  {/* Full ranking list */}
                  <div style={{ background: "white", borderRadius: "16px", border: "1px solid #E5E7EB", overflow: "hidden" }}>
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <p style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9CA3AF" }}>Classement complet</p>
                      <p style={{ fontSize: "12px", color: "#9CA3AF" }}>{leaderboard.length} membre{leaderboard.length !== 1 ? "s" : ""}</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {leaderboard.map((entry, idx) => {
                        const isPos = entry.totalUnits > 0;
                        const isNeg = entry.totalUnits < 0;
                        const medals = ["🥇", "🥈", "🥉"];
                        return (
                          <div key={entry.userId} style={{
                            display: "flex", alignItems: "center", gap: "14px", padding: "14px 20px",
                            borderBottom: idx < leaderboard.length - 1 ? "1px solid #F3F4F6" : "none",
                            background: idx === 0 ? "linear-gradient(90deg, #FFFBEB, white)" : idx === 1 ? "linear-gradient(90deg, #F8FAFC, white)" : "white",
                          }}>
                            <div style={{ width: "32px", textAlign: "center", flexShrink: 0 }}>
                              {idx < 3 ? (
                                <span style={{ fontSize: "20px" }}>{medals[idx]}</span>
                              ) : (
                                <span style={{ fontSize: "14px", fontWeight: 800, color: "#9CA3AF" }}>#{idx + 1}</span>
                              )}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>
                                {entry.firstName} {entry.lastName}
                              </div>
                              <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "2px" }}>
                                {entry.followedCount} paris · {entry.wonCount}W / {entry.lostCount}L
                              </div>
                            </div>
                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                              <div style={{ fontSize: "18px", fontWeight: 800, color: isPos ? "#16A34A" : isNeg ? "#DC2626" : "#6B7280" }}>
                                {isPos ? "+" : ""}{entry.totalUnits}U
                              </div>
                              {entry.followedCount > 0 && (
                                <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "2px" }}>
                                  {Math.round((entry.wonCount / entry.followedCount) * 100)}% win
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })()}

        {/* ══ CDM 2026 ══ */}
        {tab === "cdm" && (() => {
          const flagOf = (code: string) => CDM_PAYS.find(p => p.code === code)?.flag ?? "🏳";
          const nomOf = (code: string) => CDM_PAYS.find(p => p.code === code)?.nom ?? code;

          const statsSimples = (() => {
            const done = cdmSimples.filter(b => b.status !== "PENDING");
            const won = done.filter(b => b.status === "WON").length;
            const pct = done.length > 0 ? Math.round((won / done.length) * 100) : 0;
            return { won, total: done.length, pct };
          })();

          const statsButeurs = (() => {
            const done = cdmButeurs.filter(b => b.status !== "PENDING");
            const won = done.filter(b => b.status === "WON").length;
            const pct = done.length > 0 ? Math.round((won / done.length) * 100) : 0;
            return { won, total: done.length, pct };
          })();

          async function handleAddSimple(e: FormEvent) {
            e.preventDefault();
            setCdmSimpleError(""); setCdmSimpleCreating(true);
            try {
              const res = await fetch(`${API_URL}/api/admin/cdm/simples`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ ...cdmSimpleForm, cote: parseFloat(cdmSimpleForm.cote), units: parseFloat(cdmSimpleForm.units) }),
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.message);
              setCdmSimpleForm({ team1: "", team2: "", pari: "", cote: "", units: "1" });
              await fetchCdm();
            } catch (err: unknown) {
              setCdmSimpleError(err instanceof Error ? err.message : "Erreur.");
            } finally { setCdmSimpleCreating(false); }
          }

          async function handleAddButeur(e: FormEvent) {
            e.preventDefault();
            setCdmButeurError(""); setCdmButeurCreating(true);
            try {
              const res = await fetch(`${API_URL}/api/admin/cdm/buteurs`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ ...cdmButeurForm, cote: parseFloat(cdmButeurForm.cote), units: parseFloat(cdmButeurForm.units) }),
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.message);
              setCdmButeurForm({ team1: "", team2: "", joueur: "", pari: "", cote: "", units: "1" });
              await fetchCdm();
            } catch (err: unknown) {
              setCdmButeurError(err instanceof Error ? err.message : "Erreur.");
            } finally { setCdmButeurCreating(false); }
          }

          async function setSimpleResult(id: string, status: "PENDING" | "WON" | "LOST") {
            await fetch(`${API_URL}/api/admin/cdm/simples/${id}/result`, {
              method: "PUT",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify({ status }),
            });
            await fetchCdm();
          }

          async function setButeurResult(id: string, status: "PENDING" | "WON" | "LOST") {
            await fetch(`${API_URL}/api/admin/cdm/buteurs/${id}/result`, {
              method: "PUT",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify({ status }),
            });
            await fetchCdm();
          }

          async function deleteSimple(id: string) {
            await fetch(`${API_URL}/api/admin/cdm/simples/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
            await fetchCdm();
          }

          async function deleteButeur(id: string) {
            await fetch(`${API_URL}/api/admin/cdm/buteurs/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
            await fetchCdm();
          }

          const selectStyle: React.CSSProperties = { ...inp, appearance: "none" as const };
          const stats = cdmSubTab === "simples" ? statsSimples : statsButeurs;

          return (
            <div>
              {/* Sub-tabs */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                {(["simples", "buteurs"] as const).map(k => (
                  <button key={k} onClick={() => setCdmSubTab(k)} style={{
                    padding: "8px 20px", borderRadius: "10px", border: "none", cursor: "pointer",
                    fontSize: "13px", fontWeight: 700,
                    background: cdmSubTab === k ? "#2563EB" : "#F3F4F6",
                    color: cdmSubTab === k ? "white" : "#6B7280",
                  }}>
                    {k === "simples" ? "Paris Simples" : "Paris Buteurs"}
                  </button>
                ))}
              </div>

              {/* Stats */}
              <div style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: "16px", padding: "20px", marginBottom: "20px", display: "flex", gap: "24px", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: "12px", color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Paris réussis</p>
                  <p style={{ fontSize: "24px", fontWeight: 800, color: "#111827" }}>{stats.won}/{stats.total}</p>
                </div>
                <div style={{ width: "1px", height: "40px", background: "#E5E7EB" }} />
                <div>
                  <p style={{ fontSize: "12px", color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Taux de réussite</p>
                  <p style={{ fontSize: "24px", fontWeight: 800, color: stats.pct >= 60 ? "#16A34A" : stats.pct >= 40 ? "#D97706" : "#DC2626" }}>
                    {stats.pct}%
                  </p>
                </div>
                <div style={{ flex: 1, background: "#F3F4F6", borderRadius: "999px", height: "10px", overflow: "hidden" }}>
                  <div style={{ width: `${stats.pct}%`, height: "100%", borderRadius: "999px", background: stats.pct >= 60 ? "#16A34A" : stats.pct >= 40 ? "#D97706" : "#DC2626", transition: "width 0.4s" }} />
                </div>
              </div>

              {/* Form */}
              {cdmSubTab === "simples" ? (
                <form onSubmit={handleAddSimple} style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: "16px", padding: "20px", marginBottom: "20px" }}>
                  <p style={{ fontWeight: 700, fontSize: "14px", color: "#111827", marginBottom: "14px" }}>Ajouter un pari simple</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", display: "block", marginBottom: "4px" }}>Équipe 1</label>
                      <select value={cdmSimpleForm.team1} onChange={e => setCdmSimpleForm(f => ({ ...f, team1: e.target.value }))} style={selectStyle} required>
                        <option value="">Choisir un pays...</option>
                        {CDM_PAYS.map(p => <option key={p.code} value={p.code}>{p.flag} {p.nom}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", display: "block", marginBottom: "4px" }}>Équipe 2</label>
                      <select value={cdmSimpleForm.team2} onChange={e => setCdmSimpleForm(f => ({ ...f, team2: e.target.value }))} style={selectStyle} required>
                        <option value="">Choisir un pays...</option>
                        {CDM_PAYS.map(p => <option key={p.code} value={p.code}>{p.flag} {p.nom}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", display: "block", marginBottom: "4px" }}>Pari</label>
                    <input value={cdmSimpleForm.pari} onChange={e => setCdmSimpleForm(f => ({ ...f, pari: e.target.value }))} placeholder="ex: Victoire France" style={inp} required />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", display: "block", marginBottom: "4px" }}>Cote</label>
                      <input type="number" step="0.01" min="1.01" value={cdmSimpleForm.cote} onChange={e => setCdmSimpleForm(f => ({ ...f, cote: e.target.value }))} placeholder="ex: 2.10" style={inp} required />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", display: "block", marginBottom: "4px" }}>Unités</label>
                      <input type="number" step="0.5" min="0.5" value={cdmSimpleForm.units} onChange={e => setCdmSimpleForm(f => ({ ...f, units: e.target.value }))} style={inp} required />
                    </div>
                  </div>
                  {cdmSimpleError && <p style={{ color: "#DC2626", fontSize: "12px", marginBottom: "10px" }}>{cdmSimpleError}</p>}
                  <button type="submit" disabled={cdmSimpleCreating} style={{ background: "#2563EB", color: "white", border: "none", borderRadius: "10px", padding: "10px 20px", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>
                    {cdmSimpleCreating ? "Ajout..." : "Ajouter"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleAddButeur} style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: "16px", padding: "20px", marginBottom: "20px" }}>
                  <p style={{ fontWeight: 700, fontSize: "14px", color: "#111827", marginBottom: "14px" }}>Ajouter un pari buteur</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", display: "block", marginBottom: "4px" }}>Équipe 1</label>
                      <select value={cdmButeurForm.team1} onChange={e => setCdmButeurForm(f => ({ ...f, team1: e.target.value }))} style={selectStyle} required>
                        <option value="">Choisir un pays...</option>
                        {CDM_PAYS.map(p => <option key={p.code} value={p.code}>{p.flag} {p.nom}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", display: "block", marginBottom: "4px" }}>Équipe 2</label>
                      <select value={cdmButeurForm.team2} onChange={e => setCdmButeurForm(f => ({ ...f, team2: e.target.value }))} style={selectStyle} required>
                        <option value="">Choisir un pays...</option>
                        {CDM_PAYS.map(p => <option key={p.code} value={p.code}>{p.flag} {p.nom}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", display: "block", marginBottom: "4px" }}>Joueur (buteur)</label>
                    <input value={cdmButeurForm.joueur} onChange={e => setCdmButeurForm(f => ({ ...f, joueur: e.target.value }))} placeholder="ex: Mbappé" style={inp} required />
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", display: "block", marginBottom: "4px" }}>Pari</label>
                    <input value={cdmButeurForm.pari} onChange={e => setCdmButeurForm(f => ({ ...f, pari: e.target.value }))} placeholder="ex: Buteur dans le match" style={inp} required />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", display: "block", marginBottom: "4px" }}>Cote</label>
                      <input type="number" step="0.01" min="1.01" value={cdmButeurForm.cote} onChange={e => setCdmButeurForm(f => ({ ...f, cote: e.target.value }))} placeholder="ex: 3.50" style={inp} required />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: "#6B7280", display: "block", marginBottom: "4px" }}>Unités</label>
                      <input type="number" step="0.5" min="0.5" value={cdmButeurForm.units} onChange={e => setCdmButeurForm(f => ({ ...f, units: e.target.value }))} style={inp} required />
                    </div>
                  </div>
                  {cdmButeurError && <p style={{ color: "#DC2626", fontSize: "12px", marginBottom: "10px" }}>{cdmButeurError}</p>}
                  <button type="submit" disabled={cdmButeurCreating} style={{ background: "#2563EB", color: "white", border: "none", borderRadius: "10px", padding: "10px 20px", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>
                    {cdmButeurCreating ? "Ajout..." : "Ajouter"}
                  </button>
                </form>
              )}

              {/* Liste des paris */}
              {cdmLoading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", border: "3px solid #2563EB", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
                </div>
              ) : cdmSubTab === "simples" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {cdmSimples.length === 0 && <p style={{ textAlign: "center", color: "#9CA3AF", padding: "40px" }}>Aucun pari simple pour le moment.</p>}
                  {cdmSimples.map(b => (
                    <div key={b.id} style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: "14px", padding: "16px 18px", display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{ fontSize: "24px", display: "flex", gap: "4px", alignItems: "center" }}>
                        <span>{flagOf(b.team1)}</span>
                        <span style={{ fontSize: "13px", color: "#9CA3AF", margin: "0 2px" }}>vs</span>
                        <span>{flagOf(b.team2)}</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: "13px", fontWeight: 700, color: "#111827", marginBottom: "2px" }}>{b.pari}</p>
                        <p style={{ fontSize: "11px", color: "#9CA3AF" }}>{nomOf(b.team1)} vs {nomOf(b.team2)} · {b.units}u · @{b.cote}</p>
                      </div>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        {(["WON", "PENDING", "LOST"] as const).map(s => (
                          <button key={s} onClick={() => setSimpleResult(b.id, s)} style={{
                            padding: "5px 10px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: 700,
                            background: b.status === s ? (s === "WON" ? "#16A34A" : s === "LOST" ? "#DC2626" : "#F59E0B") : "#F3F4F6",
                            color: b.status === s ? "white" : "#9CA3AF",
                          }}>
                            {s === "WON" ? "✓ Gagné" : s === "LOST" ? "✗ Perdu" : "En cours"}
                          </button>
                        ))}
                        <button onClick={() => deleteSimple(b.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#DC2626", padding: "4px" }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {cdmButeurs.length === 0 && <p style={{ textAlign: "center", color: "#9CA3AF", padding: "40px" }}>Aucun pari buteur pour le moment.</p>}
                  {cdmButeurs.map(b => (
                    <div key={b.id} style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: "14px", padding: "16px 18px", display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{ fontSize: "24px", display: "flex", gap: "4px", alignItems: "center" }}>
                        <span>{flagOf(b.team1)}</span>
                        <span style={{ fontSize: "13px", color: "#9CA3AF", margin: "0 2px" }}>vs</span>
                        <span>{flagOf(b.team2)}</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: "13px", fontWeight: 700, color: "#111827", marginBottom: "2px" }}>{b.joueur} — {b.pari}</p>
                        <p style={{ fontSize: "11px", color: "#9CA3AF" }}>{nomOf(b.team1)} vs {nomOf(b.team2)} · {b.units}u · @{b.cote}</p>
                      </div>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        {(["WON", "PENDING", "LOST"] as const).map(s => (
                          <button key={s} onClick={() => setButeurResult(b.id, s)} style={{
                            padding: "5px 10px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: 700,
                            background: b.status === s ? (s === "WON" ? "#16A34A" : s === "LOST" ? "#DC2626" : "#F59E0B") : "#F3F4F6",
                            color: b.status === s ? "white" : "#9CA3AF",
                          }}>
                            {s === "WON" ? "✓ Gagné" : s === "LOST" ? "✗ Perdu" : "En cours"}
                          </button>
                        ))}
                        <button onClick={() => deleteButeur(b.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#DC2626", padding: "4px" }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
