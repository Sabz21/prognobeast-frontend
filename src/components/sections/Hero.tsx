// components/sections/Hero.tsx
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink } from "lucide-react";

export default function Hero() {
  return (
    <section style={{ background: "white", position: "relative", overflow: "hidden" }}>
      {/* Fond dégradé */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 70% 60% at 70% 50%, #EFF6FF 0%, transparent 65%)",
      }} />

      <div className="hero-inner" style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "5rem 1.5rem 4.5rem",
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: "3rem",
      }}>

        {/* ── Colonne texte ── */}
        <div style={{ flex: 1 }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "#EFF6FF", border: "1px solid #BFDBFE",
            color: "#2563EB", fontSize: "11px", fontWeight: 700,
            letterSpacing: "0.12em", textTransform: "uppercase",
            padding: "8px 16px", borderRadius: "999px",
            marginBottom: "1.75rem",
            maxWidth: "100%", flexWrap: "wrap",
          }}>
            <span style={{ width: 6, height: 6, background: "#2563EB", borderRadius: "50%", display: "inline-block" }} />
            Pronostics Premium — Saison 2025/2026
          </div>

          {/* Titre */}
          <h1 style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: "clamp(3rem, 7vw, 6.5rem)",
            lineHeight: 0.92,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            color: "#111827",
            marginBottom: "1.5rem",
          }}>
            La méthode<br />
            qui{" "}
            <span style={{
              background: "linear-gradient(135deg, #2563EB 0%, #60A5FA 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              performe
            </span>
            <br />
            sur la durée
          </h1>

          {/* Sous-titre */}
          <p style={{
            color: "#6B7280",
            fontSize: "1.05rem",
            lineHeight: 1.75,
            maxWidth: "480px",
            marginBottom: "2.25rem",
          }}>
            Value bets, gestion de bankroll et discipline. PrognoBeast, c&apos;est le seul
            système de pronostics conçu pour{" "}
            <strong style={{ color: "#111827", fontWeight: 600 }}>gagner sur le long terme.</strong>
          </p>

          {/* Boutons */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <a
              href="https://t.me/prognobeastfree"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "#2563EB", color: "white",
                fontSize: "14px", fontWeight: 600,
                padding: "13px 26px", borderRadius: "10px",
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
              }}
            >
              Rejoindre le VIP
              <ExternalLink size={14} />
            </a>
            <Link
              href="/vip"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "white", color: "#374151",
                fontSize: "14px", fontWeight: 600,
                padding: "13px 26px", borderRadius: "10px",
                textDecoration: "none",
                border: "1.5px solid #E5E7EB",
              }}
            >
              Voir les offres
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* ── Logo / Mascotte ── */}
        <div style={{
          flexShrink: 0,
          alignItems: "center",
          justifyContent: "center",
        }}
          className="hidden md:flex"
        >
          <div style={{
            position: "relative",
            width: 280,
            height: 280,
          }}>
            {/* Halo bleu derrière le logo */}
            <div style={{
              position: "absolute", inset: -20,
              background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)",
              borderRadius: "50%",
            }} />
            <Image
              src="/images/logo.png"
              alt="PrognoBeast"
              width={280}
              height={280}
              style={{ objectFit: "contain", position: "relative", zIndex: 1 }}
              priority
            />
          </div>
        </div>

      </div>

      {/* Séparateur */}
      <div style={{ height: 1, background: "linear-gradient(to right, transparent, #DBEAFE, transparent)" }} />
    </section>
  );
}
