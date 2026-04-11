// app/public/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pronostics Public — PrognoBeast",
  description: "Accédez aux pronostics publics gratuits de PrognoBeast.",
};

export default function PublicPage() {
  return (
    <section style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem 1.5rem" }}>
      <div style={{ textAlign: "center", maxWidth: 500 }}>
        <span style={{
          display: "inline-block", background: "#EFF6FF", color: "#2563EB",
          fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em",
          textTransform: "uppercase", padding: "6px 14px", borderRadius: "999px",
          border: "1px solid #BFDBFE", marginBottom: "1.5rem",
        }}>
          Bientôt disponible
        </span>
        <h1 style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: "clamp(2.5rem, 6vw, 5rem)",
          textTransform: "uppercase", color: "#111827", lineHeight: 1, marginBottom: "1rem",
        }}>
          Pronostics Public
        </h1>
        <p style={{ color: "#6B7280", fontSize: "1rem", lineHeight: 1.7 }}>
          Les pronostics publics gratuits arrivent bientôt. Rejoins notre Telegram pour être notifié en premier.
        </p>
        <a
          href="https://t.me/prognobeastfree"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#2563EB", color: "white", fontSize: "14px", fontWeight: 600,
            padding: "12px 24px", borderRadius: "10px", textDecoration: "none",
            marginTop: "2rem", boxShadow: "0 4px 14px rgba(37,99,235,0.25)",
          }}
        >
          Rejoindre Telegram
        </a>
      </div>
    </section>
  );
}
