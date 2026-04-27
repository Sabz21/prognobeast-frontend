"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Calculator, ChevronDown } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface BetEntry {
  createdAt: string;
  status: "WON" | "LOST" | "PENDING";
  gainLoss: number | null;
}

// Génère les mois depuis avril 2026 jusqu'au mois actuel
function generateMonths() {
  const months: { value: string; label: string }[] = [];
  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  const start = new Date(2026, 3, 1); // avril 2026
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), 1);
  let cur = new Date(start);
  while (cur <= end) {
    months.push({
      value: `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}`,
      label: `${monthNames[cur.getMonth()]} ${cur.getFullYear()}`,
    });
    cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
  }
  return months.reverse(); // plus récent en premier
}

function toDateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function SimulationPage() {
  const [bets, setBets] = useState<BetEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [capital, setCapital] = useState("1000");
  const [unitPct, setUnitPct] = useState("2");

  const months = useMemo(() => generateMonths(), []);
  const [selectedMonth, setSelectedMonth] = useState(months[0]?.value ?? "");

  useEffect(() => {
    fetch(`${API_URL}/api/stats/vip`)
      .then(r => r.json())
      .then(d => { if (d.success) setBets(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const results = useMemo(() => {
    const cap = parseFloat(capital);
    const pct = parseFloat(unitPct);
    if (!selectedMonth || isNaN(cap) || cap <= 0 || isNaN(pct) || pct <= 0 || pct > 100) return null;

    const unitValue = cap * (pct / 100); // valeur d'1U en €

    // Filtrer les paris du mois sélectionné (terminés seulement)
    const monthBets = bets
      .filter(b => {
        if (b.status === "PENDING" || b.gainLoss === null) return false;
        const d = new Date(b.createdAt);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        return key === selectedMonth;
      })
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    if (monthBets.length === 0) return { empty: true, unitValue } as const;

    let runningBK = cap;
    const days: Record<string, { profitEuros: number; won: number; lost: number; bkEnd: number }> = {};

    for (const bet of monthBets) {
      const profitEuros = parseFloat(((bet.gainLoss ?? 0) * unitValue).toFixed(2));
      runningBK = parseFloat((runningBK + profitEuros).toFixed(2));
      const dayKey = toDateKey(new Date(bet.createdAt));
      if (!days[dayKey]) days[dayKey] = { profitEuros: 0, won: 0, lost: 0, bkEnd: runningBK };
      days[dayKey].profitEuros = parseFloat((days[dayKey].profitEuros + profitEuros).toFixed(2));
      days[dayKey].bkEnd = runningBK;
      if (bet.status === "WON") days[dayKey].won++;
      else days[dayKey].lost++;
    }

    const won = monthBets.filter(b => b.status === "WON").length;
    const lost = monthBets.filter(b => b.status === "LOST").length;
    const totalUnits = parseFloat(monthBets.reduce((acc, b) => acc + (b.gainLoss ?? 0), 0).toFixed(2));
    const totalEuros = parseFloat((totalUnits * unitValue).toFixed(2));
    const finalBK = parseFloat((cap + totalEuros).toFixed(2));
    const roiPct = parseFloat(((totalEuros / cap) * 100).toFixed(2));
    const winRate = monthBets.length > 0 ? Math.round((won / monthBets.length) * 100) : 0;

    return { empty: false, unitValue, won, lost, totalUnits, totalEuros, finalBK, roiPct, winRate, days, count: monthBets.length } as const;
  }, [bets, capital, unitPct, selectedMonth]);

  const isPos = results && !results.empty && results.totalEuros > 0;
  const isNeg = results && !results.empty && results.totalEuros < 0;

  const cap = parseFloat(capital) || 0;
  const pct = parseFloat(unitPct) || 0;
  const unitValuePreview = cap > 0 && pct > 0 ? parseFloat((cap * pct / 100).toFixed(2)) : null;

  const selectedMonthLabel = months.find(m => m.value === selectedMonth)?.label ?? "";

  return (
    <div style={{ background: "#F9FAFB", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid #E5E7EB", padding: "48px 16px 32px" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "#EFF6FF", color: "#2563EB",
            fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", padding: "5px 14px", borderRadius: "999px",
            border: "1px solid #BFDBFE", marginBottom: "16px",
          }}>
            <Calculator size={12} /> Outil gratuit
          </span>
          <h1 style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: "clamp(2.2rem, 6vw, 4rem)",
            textTransform: "uppercase", color: "#111827", lineHeight: 1, marginBottom: "12px",
          }}>
            Simule tes <span style={{ background: "linear-gradient(135deg, #2563EB, #60A5FA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>gains VIP</span>
          </h1>
          <p style={{ color: "#6B7280", fontSize: "15px", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto" }}>
            Entre ta bankroll et ton unité pour voir combien tu aurais gagné en suivant toutes les sélections VIP.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 16px" }}>

        {/* ── Formulaire ── */}
        <div style={{ background: "white", borderRadius: "20px", border: "1px solid #E5E7EB", padding: "28px", marginBottom: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <p style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: "20px" }}>Paramètres</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
            {/* Capital */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>
                Capital de départ
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  min="1"
                  step="any"
                  placeholder="1000"
                  value={capital}
                  onChange={e => setCapital(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 36px 12px 14px", borderRadius: "12px",
                    border: "2px solid #E5E7EB", background: "#F9FAFB",
                    fontSize: "18px", fontWeight: 700, color: "#111827", outline: "none",
                    boxSizing: "border-box", transition: "border-color 0.15s",
                  }}
                  onFocus={e => (e.target.style.borderColor = "#2563EB")}
                  onBlur={e => (e.target.style.borderColor = "#E5E7EB")}
                />
                <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", fontWeight: 700, color: "#9CA3AF" }}>€</span>
              </div>
            </div>

            {/* Unité */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>
                Taille d&apos;une unité
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  min="0.1"
                  max="100"
                  step="0.1"
                  placeholder="2"
                  value={unitPct}
                  onChange={e => setUnitPct(e.target.value)}
                  style={{
                    width: "100%", padding: "12px 36px 12px 14px", borderRadius: "12px",
                    border: "2px solid #E5E7EB", background: "#F9FAFB",
                    fontSize: "18px", fontWeight: 700, color: "#111827", outline: "none",
                    boxSizing: "border-box", transition: "border-color 0.15s",
                  }}
                  onFocus={e => (e.target.style.borderColor = "#2563EB")}
                  onBlur={e => (e.target.style.borderColor = "#E5E7EB")}
                />
                <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", fontWeight: 700, color: "#9CA3AF" }}>%</span>
              </div>
            </div>
          </div>

          {/* Mois */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>
              Mois à simuler
            </label>
            <div style={{ position: "relative" }}>
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                style={{
                  width: "100%", padding: "12px 40px 12px 14px", borderRadius: "12px",
                  border: "2px solid #E5E7EB", background: "#F9FAFB",
                  fontSize: "16px", fontWeight: 600, color: "#111827", outline: "none",
                  appearance: "none", cursor: "pointer", boxSizing: "border-box",
                  transition: "border-color 0.15s",
                }}
                onFocus={e => (e.target.style.borderColor = "#2563EB")}
                onBlur={e => (e.target.style.borderColor = "#E5E7EB")}
              >
                {months.map(m => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              <ChevronDown size={16} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "#6B7280", pointerEvents: "none" }} />
            </div>
          </div>

          {/* Aperçu unité */}
          {unitValuePreview && (
            <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: "12px", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "13px", color: "#1E40AF", fontWeight: 600 }}>
                1 unité =
              </span>
              <span style={{ fontSize: "20px", fontWeight: 800, color: "#2563EB" }}>
                {unitValuePreview.toFixed(2)} €
              </span>
            </div>
          )}
        </div>

        {/* ── Résultats ── */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", border: "3px solid #2563EB", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : results === null ? (
          <div style={{ textAlign: "center", padding: "40px", background: "white", borderRadius: "20px", border: "1px solid #E5E7EB" }}>
            <p style={{ fontSize: "14px", color: "#9CA3AF" }}>Entre un capital et une unité pour voir la simulation.</p>
          </div>
        ) : results.empty ? (
          <div style={{ textAlign: "center", padding: "40px", background: "white", borderRadius: "20px", border: "1px solid #E5E7EB" }}>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Aucun pari ce mois</p>
            <p style={{ fontSize: "13px", color: "#9CA3AF" }}>Sélectionne un autre mois ou attends les prochains pronostics.</p>
          </div>
        ) : (
          <>
            {/* Résultat principal */}
            <div style={{
              background: isPos
                ? "linear-gradient(135deg, #F0FDF4, #DCFCE7)"
                : isNeg
                ? "linear-gradient(135deg, #FEF2F2, #FEE2E2)"
                : "linear-gradient(135deg, #F9FAFB, #F3F4F6)",
              border: `1.5px solid ${isPos ? "#86EFAC" : isNeg ? "#FCA5A5" : "#E5E7EB"}`,
              borderRadius: "20px", padding: "28px", marginBottom: "16px",
            }}>
              <p style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: isPos ? "#15803D" : isNeg ? "#B91C1C" : "#6B7280", marginBottom: "6px" }}>
                {selectedMonthLabel} — résultat simulé
              </p>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "52px", fontWeight: 900, lineHeight: 1, color: isPos ? "#16A34A" : isNeg ? "#DC2626" : "#6B7280" }}>
                      {isPos ? "+" : ""}{results.totalEuros.toFixed(2)} €
                    </span>
                    {isPos && <TrendingUp size={28} style={{ color: "#16A34A" }} />}
                    {isNeg && <TrendingDown size={28} style={{ color: "#DC2626" }} />}
                  </div>
                  <p style={{ fontSize: "14px", color: isPos ? "#15803D" : isNeg ? "#B91C1C" : "#6B7280", marginTop: "4px", fontWeight: 600 }}>
                    {isPos ? "+" : ""}{results.totalUnits}U · {isPos ? "+" : ""}{results.roiPct}% de la bankroll
                  </p>
                </div>
              </div>

              {/* Bankroll finale */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                <div style={{ background: "white", borderRadius: "14px", padding: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", textAlign: "center" }}>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "#111827", lineHeight: 1 }}>
                    {results.finalBK.toFixed(0)} €
                  </div>
                  <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "4px", fontWeight: 600 }}>Bankroll finale</div>
                </div>
                <div style={{ background: "white", borderRadius: "14px", padding: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", textAlign: "center" }}>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "#16A34A", lineHeight: 1 }}>{results.won}</div>
                  <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "4px", fontWeight: 600 }}>Gagnés</div>
                </div>
                <div style={{ background: "white", borderRadius: "14px", padding: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", textAlign: "center" }}>
                  <div style={{ fontSize: "22px", fontWeight: 800, color: "#DC2626", lineHeight: 1 }}>{results.lost}</div>
                  <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "4px", fontWeight: 600 }}>Perdus</div>
                </div>
              </div>
            </div>

            {/* Détail par jour */}
            {Object.keys(results.days).length > 0 && (
              <div style={{ background: "white", borderRadius: "20px", border: "1px solid #E5E7EB", padding: "24px", marginBottom: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <p style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: "16px" }}>
                  Progression jour par jour
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {Object.entries(results.days).map(([dayKey, day]) => {
                    const dPos = day.profitEuros > 0;
                    const dNeg = day.profitEuros < 0;
                    const dateStr = new Date(dayKey + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
                    return (
                      <div key={dayKey} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
                        padding: "12px 16px", borderRadius: "12px",
                        background: dPos ? "#F0FDF4" : dNeg ? "#FEF2F2" : "#F9FAFB",
                        border: `1px solid ${dPos ? "#BBF7D0" : dNeg ? "#FECACA" : "#E5E7EB"}`,
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: "#374151", minWidth: "80px", textTransform: "capitalize" }}>{dateStr}</span>
                          <div style={{ display: "flex", gap: "4px" }}>
                            {day.won > 0 && <span style={{ fontSize: "11px", fontWeight: 700, color: "#16A34A", background: "#DCFCE7", padding: "2px 8px", borderRadius: "999px" }}>{day.won}W</span>}
                            {day.lost > 0 && <span style={{ fontSize: "11px", fontWeight: 700, color: "#DC2626", background: "#FEE2E2", padding: "2px 8px", borderRadius: "999px" }}>{day.lost}L</span>}
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "16px", fontWeight: 800, color: dPos ? "#16A34A" : dNeg ? "#DC2626" : "#6B7280" }}>
                            {dPos ? "+" : ""}{day.profitEuros.toFixed(2)} €
                          </div>
                          <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "1px" }}>
                            BK : {day.bkEnd.toFixed(0)} €
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CTA */}
            <div style={{
              background: "linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)",
              borderRadius: "20px", padding: "28px 24px", textAlign: "center",
              boxShadow: "0 8px 32px rgba(37,99,235,0.3)",
            }}>
              <h2 style={{
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                fontSize: "clamp(1.6rem, 4vw, 2.4rem)", letterSpacing: "0.06em",
                color: "white", lineHeight: 1, marginBottom: "10px",
              }}>
                Prêt à jouer pour de vrai ?
              </h2>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", lineHeight: 1.6, marginBottom: "20px" }}>
                Rejoins le VIP et reçois toutes les sélections en temps réel.
              </p>
              <Link href="/vip" style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "white", color: "#1E3A8A",
                fontSize: "14px", fontWeight: 700,
                padding: "13px 28px", borderRadius: "12px", textDecoration: "none",
                boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
              }}>
                Voir les offres VIP
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
