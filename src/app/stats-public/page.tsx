// app/stats-public/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stats Public — PrognoBeast",
  description: "Statistiques publiques des pronostics PrognoBeast — résultats mensuels en toute transparence.",
};

const months = [
  {
    id: "mars-2026",
    label: "Mars 2026",
    tiktok: { won: 15, total: 18 },
    telegram: { won: 37, total: 44 },
  },
];

function pct(won: number, total: number) {
  return ((won / total) * 100).toFixed(1).replace(".", ",");
}

export default function StatsPublicPage() {
  return (
    <div style={{ background: "white", minHeight: "100vh" }}>

      {/* Header */}
      <section style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB", padding: "3.5rem 1.5rem 3rem" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <span style={{
            display: "inline-block", background: "#EFF6FF", color: "#2563EB",
            fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", padding: "6px 14px", borderRadius: "999px",
            border: "1px solid #BFDBFE", marginBottom: "1.25rem",
          }}>
            Transparence totale
          </span>
          <h1 style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            textTransform: "uppercase", color: "#111827", lineHeight: 1, marginBottom: "0.75rem",
          }}>
            Stats Public
          </h1>
          <p style={{ color: "#6B7280", fontSize: "1rem", lineHeight: 1.7 }}>
            Tous nos résultats mensuels, sans filtre. TikTok et Telegram confondus.
          </p>
        </div>
      </section>

      {/* Monthly blocks */}
      <section style={{ padding: "3.5rem 1.5rem 5rem" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>

          {months.map((month) => {
            const tiktokPct = pct(month.tiktok.won, month.tiktok.total);
            const telegramPct = pct(month.telegram.won, month.telegram.total);
            const totalWon = month.tiktok.won + month.telegram.won;
            const totalAll = month.tiktok.total + month.telegram.total;
            const totalPct = pct(totalWon, totalAll);

            return (
              <div key={month.id} style={{
                background: "white", border: "1.5px solid #E5E7EB",
                borderRadius: 16, overflow: "hidden",
                boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
              }}>
                {/* Month header */}
                <div style={{
                  background: "#F9FAFB", borderBottom: "1px solid #E5E7EB",
                  padding: "1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <h2 style={{
                    fontFamily: "'Bebas Neue', Impact, sans-serif",
                    fontSize: "1.5rem", textTransform: "uppercase", color: "#111827", letterSpacing: "0.04em",
                  }}>
                    {month.label}
                  </h2>
                  <span style={{
                    background: "#EFF6FF", color: "#2563EB",
                    fontSize: "12px", fontWeight: 700, padding: "4px 12px",
                    borderRadius: "999px", border: "1px solid #BFDBFE",
                  }}>
                    {totalWon}/{totalAll} — {totalPct}%
                  </span>
                </div>

                {/* Stats grid */}
                <div className="stats-channels" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>

                  {/* TikTok */}
                  <div style={{ padding: "1.5rem 1.75rem", borderRight: "1px solid #F3F4F6" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
                      <div style={{ width: 30, height: 30, background: "#111827", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
                        </svg>
                      </div>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>Pronostics TikTok</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: "0.75rem" }}>
                      <span style={{ fontSize: "2.5rem", fontWeight: 800, color: "#111827", lineHeight: 1 }}>
                        {tiktokPct}%
                      </span>
                      <span style={{ fontSize: "14px", color: "#9CA3AF", marginBottom: "0.3rem" }}>
                        {month.tiktok.won}/{month.tiktok.total}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div style={{ background: "#F3F4F6", borderRadius: "999px", height: 6, overflow: "hidden" }}>
                      <div style={{
                        width: `${(month.tiktok.won / month.tiktok.total) * 100}%`,
                        height: "100%", background: "linear-gradient(90deg, #2563EB, #60A5FA)", borderRadius: "999px",
                        transition: "width 0.6s ease",
                      }} />
                    </div>
                  </div>

                  {/* Telegram */}
                  <div style={{ padding: "1.5rem 1.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
                      <div style={{ width: 30, height: 30, background: "#2563EB", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13" />
                          <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                      </div>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>Pronostics &amp; Analyses Telegram</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: "0.75rem" }}>
                      <span style={{ fontSize: "2.5rem", fontWeight: 800, color: "#111827", lineHeight: 1 }}>
                        {telegramPct}%
                      </span>
                      <span style={{ fontSize: "14px", color: "#9CA3AF", marginBottom: "0.3rem" }}>
                        {month.telegram.won}/{month.telegram.total}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div style={{ background: "#F3F4F6", borderRadius: "999px", height: 6, overflow: "hidden" }}>
                      <div style={{
                        width: `${(month.telegram.won / month.telegram.total) * 100}%`,
                        height: "100%", background: "linear-gradient(90deg, #2563EB, #60A5FA)", borderRadius: "999px",
                        transition: "width 0.6s ease",
                      }} />
                    </div>
                  </div>

                </div>
              </div>
            );
          })}

        </div>
      </section>

    </div>
  );
}
