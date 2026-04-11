// app/stats-vip/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Stats VIP — PrognoBeast",
  description: "Statistiques exclusives réservées aux membres VIP PrognoBeast.",
};

export default function StatsVipPage() {
  return (
    <section style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem 1.5rem" }}>
      <div style={{ textAlign: "center", maxWidth: 500 }}>
        <span style={{
          display: "inline-block", background: "#EFF6FF", color: "#2563EB",
          fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em",
          textTransform: "uppercase", padding: "6px 14px", borderRadius: "999px",
          border: "1px solid #BFDBFE", marginBottom: "1.5rem",
        }}>
          Accès réservé
        </span>
        <h1 style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: "clamp(2.5rem, 6vw, 5rem)",
          textTransform: "uppercase", color: "#111827", lineHeight: 1, marginBottom: "1rem",
        }}>
          Stats VIP
        </h1>
        <p style={{ color: "#6B7280", fontSize: "1rem", lineHeight: 1.7, marginBottom: "2rem" }}>
          Cette section est réservée aux membres VIP. Rejoins le VIP pour accéder aux statistiques détaillées.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="https://t.me/prognobeastfree" target="_blank" rel="noopener noreferrer" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#2563EB", color: "white", fontSize: "14px", fontWeight: 600,
            padding: "12px 24px", borderRadius: "10px", textDecoration: "none",
            boxShadow: "0 4px 14px rgba(37,99,235,0.25)",
          }}>
            Rejoindre le VIP
          </a>
          <Link href="/vip" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "white", color: "#374151", fontSize: "14px", fontWeight: 600,
            padding: "12px 24px", borderRadius: "10px", textDecoration: "none",
            border: "1.5px solid #E5E7EB",
          }}>
            Voir les offres VIP
          </Link>
        </div>
      </div>
    </section>
  );
}
