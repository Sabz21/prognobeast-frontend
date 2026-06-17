"use client";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

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

const CDM_PAYS: Record<string, { nom: string; flag: string }> = {
  // CONCACAF
  US: { nom: "États-Unis", flag: "🇺🇸" },
  CA: { nom: "Canada", flag: "🇨🇦" },
  MX: { nom: "Mexique", flag: "🇲🇽" },
  PA: { nom: "Panama", flag: "🇵🇦" },
  HT: { nom: "Haïti", flag: "🇭🇹" },
  CW: { nom: "Curaçao", flag: "🇨🇼" },
  // CONMEBOL
  AR: { nom: "Argentine", flag: "🇦🇷" },
  BR: { nom: "Brésil", flag: "🇧🇷" },
  CO: { nom: "Colombie", flag: "🇨🇴" },
  EC: { nom: "Équateur", flag: "🇪🇨" },
  UY: { nom: "Uruguay", flag: "🇺🇾" },
  PY: { nom: "Paraguay", flag: "🇵🇾" },
  // UEFA
  FR: { nom: "France", flag: "🇫🇷" },
  ES: { nom: "Espagne", flag: "🇪🇸" },
  EN: { nom: "Angleterre", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  PT: { nom: "Portugal", flag: "🇵🇹" },
  DE: { nom: "Allemagne", flag: "🇩🇪" },
  NL: { nom: "Pays-Bas", flag: "🇳🇱" },
  BE: { nom: "Belgique", flag: "🇧🇪" },
  HR: { nom: "Croatie", flag: "🇭🇷" },
  CH: { nom: "Suisse", flag: "🇨🇭" },
  AT: { nom: "Autriche", flag: "🇦🇹" },
  SC: { nom: "Écosse", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  NO: { nom: "Norvège", flag: "🇳🇴" },
  SE: { nom: "Suède", flag: "🇸🇪" },
  TR: { nom: "Turquie", flag: "🇹🇷" },
  CZ: { nom: "Tchéquie", flag: "🇨🇿" },
  BA: { nom: "Bosnie-Herzégovine", flag: "🇧🇦" },
  // CAF
  MA: { nom: "Maroc", flag: "🇲🇦" },
  SN: { nom: "Sénégal", flag: "🇸🇳" },
  EG: { nom: "Égypte", flag: "🇪🇬" },
  TN: { nom: "Tunisie", flag: "🇹🇳" },
  DZ: { nom: "Algérie", flag: "🇩🇿" },
  ZA: { nom: "Afrique du Sud", flag: "🇿🇦" },
  CI: { nom: "Côte d'Ivoire", flag: "🇨🇮" },
  GH: { nom: "Ghana", flag: "🇬🇭" },
  CV: { nom: "Cap-Vert", flag: "🇨🇻" },
  CD: { nom: "RD Congo", flag: "🇨🇩" },
  // AFC
  JP: { nom: "Japon", flag: "🇯🇵" },
  KR: { nom: "Corée du Sud", flag: "🇰🇷" },
  IR: { nom: "Iran", flag: "🇮🇷" },
  AU: { nom: "Australie", flag: "🇦🇺" },
  UZ: { nom: "Ouzbékistan", flag: "🇺🇿" },
  JO: { nom: "Jordanie", flag: "🇯🇴" },
  QA: { nom: "Qatar", flag: "🇶🇦" },
  SA: { nom: "Arabie Saoudite", flag: "🇸🇦" },
  IQ: { nom: "Irak", flag: "🇮🇶" },
  // OFC
  NZ: { nom: "Nouvelle-Zélande", flag: "🇳🇿" },
};

function flagOf(code: string) { return CDM_PAYS[code]?.flag ?? "🏳"; }
function nomOf(code: string) { return CDM_PAYS[code]?.nom ?? code; }

function StatsBadge({ won, total, profit }: { won: number; total: number; profit: number }) {
  const pct = total > 0 ? Math.round((won / total) * 100) : 0;
  const color = pct >= 60 ? "#16A34A" : pct >= 40 ? "#D97706" : total === 0 ? "#6B7280" : "#DC2626";
  const profitColor = profit > 0 ? "#16A34A" : profit < 0 ? "#DC2626" : "#6B7280";
  const profitStr = `${profit > 0 ? "+" : ""}${profit.toFixed(2)}u`;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "20px", background: "white", border: "1.5px solid #E5E7EB", borderRadius: "16px", padding: "18px 24px" }}>
      <div>
        <p style={{ fontSize: "11px", color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>Paris réussis</p>
        <p style={{ fontSize: "28px", fontWeight: 800, color: "#111827", lineHeight: 1 }}>{won}<span style={{ fontSize: "16px", color: "#9CA3AF" }}>/{total}</span></p>
      </div>
      <div style={{ width: "1px", height: "44px", background: "#E5E7EB" }} />
      <div>
        <p style={{ fontSize: "11px", color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>Taux de réussite</p>
        <p style={{ fontSize: "28px", fontWeight: 800, color, lineHeight: 1 }}>{pct}%</p>
      </div>
      <div style={{ width: "1px", height: "44px", background: "#E5E7EB" }} />
      <div>
        <p style={{ fontSize: "11px", color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>Profit</p>
        <p style={{ fontSize: "28px", fontWeight: 800, color: profitColor, lineHeight: 1 }}>{profitStr}</p>
      </div>
      <div style={{ flex: 1, background: "#F3F4F6", borderRadius: "999px", height: "8px", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", borderRadius: "999px", background: color, transition: "width 0.5s" }} />
      </div>
    </div>
  );
}

function BetCard({ status, match, label, sub }: { status: "PENDING" | "WON" | "LOST"; match: string; label: string; sub: string }) {
  const colors = {
    WON: { bg: "#F0FDF4", border: "#BBF7D0", dot: "#16A34A", text: "Gagné" },
    LOST: { bg: "#FEF2F2", border: "#FECACA", dot: "#DC2626", text: "Perdu" },
    PENDING: { bg: "#FFFBEB", border: "#FDE68A", dot: "#D97706", text: "En cours" },
  }[status];
  return (
    <div style={{ background: colors.bg, border: `1.5px solid ${colors.border}`, borderRadius: "14px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "16px" }}>
      <div style={{ width: "10px", height: "10px", minWidth: "10px", borderRadius: "50%", background: colors.dot }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: "13px", fontWeight: 700, color: "#111827", marginBottom: "3px" }}>{match}</p>
        <p style={{ fontSize: "13px", color: "#374151" }}>{label}</p>
        <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "2px" }}>{sub}</p>
      </div>
      <span style={{
        fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "999px",
        background: colors.dot, color: "white",
      }}>
        {colors.text}
      </span>
    </div>
  );
}

export default function Cdm2026Page() {
  const [tab, setTab] = useState<"simples" | "buteurs">("simples");
  const [simples, setSimples] = useState<CdmPariSimple[]>([]);
  const [buteurs, setButeurs] = useState<CdmPariButeur[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [r1, r2] = await Promise.all([
          fetch(`${API_URL}/api/cdm/simples`),
          fetch(`${API_URL}/api/cdm/buteurs`),
        ]);
        const [d1, d2] = await Promise.all([r1.json(), r2.json()]);
        if (d1.success) setSimples(d1.data);
        if (d2.success) setButeurs(d2.data);
      } catch { /* silent */ } finally { setLoading(false); }
    }
    load();
  }, []);

  const statsSimples = (() => {
    const done = simples.filter(b => b.status !== "PENDING");
    const won = done.filter(b => b.status === "WON").length;
    const profit = parseFloat(done.reduce((acc, b) => acc + (b.status === "WON" ? (b.cote - 1) * b.units : -b.units), 0).toFixed(2));
    return { won, total: done.length, profit };
  })();

  const statsButeurs = (() => {
    const done = buteurs.filter(b => b.status !== "PENDING");
    const won = done.filter(b => b.status === "WON").length;
    const profit = parseFloat(done.reduce((acc, b) => acc + (b.status === "WON" ? (b.cote - 1) * b.units : -b.units), 0).toFixed(2));
    return { won, total: done.length, profit };
  })();

  return (
    <div style={{ background: "white", minHeight: "100vh" }}>

      {/* Header */}
      <section style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB", padding: "3.5rem 1.5rem 3rem" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <span style={{
            display: "inline-block", background: "#EFF6FF", color: "#2563EB",
            fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", padding: "6px 14px", borderRadius: "999px",
            border: "1px solid #BFDBFE", marginBottom: "1.25rem",
          }}>
            Coupe du Monde 2026
          </span>
          <h1 style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
            textTransform: "uppercase", color: "#111827", lineHeight: 0.95, marginBottom: "1rem",
          }}>
            Nos paris{" "}
            <span style={{ background: "linear-gradient(135deg, #2563EB, #60A5FA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              CDM 2026
            </span>
          </h1>
          <p style={{ color: "#6B7280", fontSize: "1rem", lineHeight: 1.7 }}>
            Suivez tous nos pronostics pour la Coupe du Monde 2026 — paris simples et paris buteurs.
          </p>
        </div>
      </section>

      {/* Tabs + Content */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "2.5rem 1.5rem" }}>

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", background: "#F3F4F6", borderRadius: "14px", padding: "6px" }}>
          {(["simples", "buteurs"] as const).map(k => (
            <button key={k} onClick={() => setTab(k)} style={{
              flex: 1, padding: "10px", borderRadius: "10px", border: "none", cursor: "pointer",
              fontSize: "14px", fontWeight: 700,
              background: tab === k ? "white" : "transparent",
              color: tab === k ? "#111827" : "#9CA3AF",
              boxShadow: tab === k ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.15s",
            }}>
              {k === "simples" ? "⚽ Paris Simples" : "🥅 Paris Buteurs"}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div style={{ marginBottom: "24px" }}>
          <StatsBadge
            won={tab === "simples" ? statsSimples.won : statsButeurs.won}
            total={tab === "simples" ? statsSimples.total : statsButeurs.total}
            profit={tab === "simples" ? statsSimples.profit : statsButeurs.profit}
          />
        </div>

        {/* List */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "60px" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", border: "3px solid #2563EB", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
          </div>
        ) : tab === "simples" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {simples.length === 0 && (
              <p style={{ textAlign: "center", color: "#9CA3AF", padding: "60px 0", fontSize: "15px" }}>Aucun pari simple pour le moment.</p>
            )}
            {simples.map(b => (
              <BetCard
                key={b.id}
                status={b.status}
                match={`${flagOf(b.team1)} ${nomOf(b.team1)} vs ${nomOf(b.team2)} ${flagOf(b.team2)}`}
                label={b.pari}
                sub={`${b.units} unité${b.units > 1 ? "s" : ""} · Cote @${b.cote}`}
              />
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {buteurs.length === 0 && (
              <p style={{ textAlign: "center", color: "#9CA3AF", padding: "60px 0", fontSize: "15px" }}>Aucun pari buteur pour le moment.</p>
            )}
            {buteurs.map(b => (
              <BetCard
                key={b.id}
                status={b.status}
                match={`${flagOf(b.team1)} ${nomOf(b.team1)} vs ${nomOf(b.team2)} ${flagOf(b.team2)}`}
                label={`${b.joueur} — ${b.pari}`}
                sub={`${b.units} unité${b.units > 1 ? "s" : ""} · Cote @${b.cote}`}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
