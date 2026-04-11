// app/page.tsx — Home
import Hero from "@/components/sections/Hero";
import Link from "next/link";

const plans = [
  {
    id: "1mois",
    label: "1 Mois",
    price: "14,99",
    perMonth: "14,99",
    popular: false,
    description: "Découvrez la méthode PrognoBeast sans engagement.",
    stripeLink: "https://buy.stripe.com/fZudR95Csgmaevl2yW9MY01",
  },
  {
    id: "3mois",
    label: "3 Mois",
    price: "34,99",
    perMonth: "11,66",
    popular: false,
    description: "Le temps de valider la méthode et voir les résultats.",
    stripeLink: "https://buy.stripe.com/3cIdR9e8Yee2gDt4H49MY00",
  },
  {
    id: "6mois",
    label: "6 Mois",
    price: "59,99",
    perMonth: "10,00",
    popular: true,
    description: "L'offre idéale pour performer sur le long terme.",
    stripeLink: "https://buy.stripe.com/6oUdR9fd2d9Y5YPb5s9MY02",
  },
  {
    id: "12mois",
    label: "12 Mois",
    price: "119,99",
    perMonth: "10,00",
    popular: false,
    description: "Le meilleur rapport qualité/prix. Une saison complète.",
    stripeLink: "https://buy.stripe.com/fZubJ1fd23zo86XehE9MY03",
  },
];

const included = [
  "Accès au canal Telegram VIP privé",
  "Pronostics premium en temps réel",
  "Analyses pré-match complètes",
  "Gestion de bankroll structurée par unités",
  "Récapitulatifs et bilans mensuels",
  "Support et communauté réactive",
];

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* ── Section Plans ─────────────────────────── */}
      <section style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB", padding: "5rem 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>

          {/* En-tête */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span style={{
              display: "inline-block",
              background: "#EFF6FF", color: "#2563EB",
              fontSize: "11px", fontWeight: 700,
              letterSpacing: "0.12em", textTransform: "uppercase",
              padding: "6px 14px", borderRadius: "999px",
              border: "1px solid #BFDBFE",
              marginBottom: "1rem",
            }}>
              Nos offres
            </span>
            <h2 style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              textTransform: "uppercase",
              color: "#111827",
              lineHeight: 1,
              marginBottom: "0.75rem",
            }}>
              Rejoins le{" "}
              <span style={{
                background: "linear-gradient(135deg, #2563EB, #60A5FA)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                VIP PrognoBeast
              </span>
            </h2>
            <p style={{ color: "#6B7280", fontSize: "1rem", maxWidth: "500px", margin: "0 auto" }}>
              Plus tu t&apos;engages sur la durée, plus tu économises.
            </p>
          </div>

          {/* Grille de plans */}
          <div className="plans-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
          }}>
            {plans.map((plan) => (
              <div
                key={plan.id}
                style={{
                  position: "relative",
                  background: plan.popular ? "#2563EB" : "white",
                  border: plan.popular ? "2px solid #2563EB" : "1.5px solid #E5E7EB",
                  borderRadius: "16px",
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: plan.popular ? "0 8px 30px rgba(37,99,235,0.2)" : "0 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                {plan.popular && (
                  <div style={{
                    position: "absolute", top: "-14px", left: "50%",
                    transform: "translateX(-50%)",
                    background: "white", color: "#2563EB",
                    fontSize: "10px", fontWeight: 700,
                    letterSpacing: "0.1em", textTransform: "uppercase",
                    padding: "5px 12px", borderRadius: "999px",
                    border: "1px solid #BFDBFE",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    whiteSpace: "nowrap",
                  }}>
                    Le plus populaire
                  </div>
                )}

                <p style={{
                  fontSize: "10px", fontWeight: 700,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: plan.popular ? "rgba(255,255,255,0.6)" : "#9CA3AF",
                  marginBottom: "6px",
                }}>
                  VIP PrognoBeast
                </p>

                <h3 style={{
                  fontSize: "1.4rem", fontWeight: 700,
                  color: plan.popular ? "white" : "#111827",
                  marginBottom: "6px",
                }}>
                  {plan.label}
                </h3>

                <p style={{
                  fontSize: "0.85rem", lineHeight: 1.5,
                  color: plan.popular ? "rgba(255,255,255,0.75)" : "#6B7280",
                  marginBottom: "1.25rem", flexGrow: 1,
                }}>
                  {plan.description}
                </p>

                <div style={{ marginBottom: "1.25rem" }}>
                  <span style={{
                    fontSize: "1.75rem", fontWeight: 700,
                    color: plan.popular ? "white" : "#111827",
                  }}>
                    {plan.price} €
                  </span>
                  <p style={{
                    fontSize: "0.75rem", marginTop: "2px",
                    color: plan.popular ? "rgba(255,255,255,0.55)" : "#9CA3AF",
                  }}>
                    soit {plan.perMonth} €/mois
                  </p>
                </div>

                <a
                  href={plan.stripeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                    background: plan.popular ? "white" : "#2563EB",
                    color: plan.popular ? "#2563EB" : "white",
                    fontSize: "13px", fontWeight: 600,
                    padding: "11px 0", borderRadius: "10px",
                    textDecoration: "none",
                    transition: "opacity 0.2s",
                  }}
                >
                  Obtenir
                </a>
              </div>
            ))}
          </div>

          <p style={{ textAlign: "center", color: "#9CA3AF", fontSize: "12px", marginTop: "1.5rem" }}>
            Paiement sécurisé · Accès immédiat
          </p>
        </div>
      </section>

      {/* ── Ce qui est inclus ─────────────────────── */}
      <section style={{ background: "white", padding: "5rem 0" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 1.5rem" }}>
          <h2 style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
            textTransform: "uppercase",
            color: "#111827",
            textAlign: "center",
            marginBottom: "2.5rem",
          }}>
            Tout ce qui est inclus dans le VIP
          </h2>

          <div className="included-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            {included.map((item) => (
              <div key={item} style={{
                display: "flex", alignItems: "center", gap: "12px",
                background: "#F9FAFB", border: "1px solid #E5E7EB",
                borderRadius: "12px", padding: "14px 18px",
              }}>
                <div style={{
                  width: 24, height: 24, minWidth: 24,
                  background: "#EFF6FF", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span style={{ fontSize: "14px", color: "#374151", fontWeight: 500 }}>{item}</span>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <Link
              href="/vip"
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                color: "#2563EB", fontSize: "14px", fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Voir toutes les offres en détail →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Rejoins nous sur nos réseaux ─────────── */}
      <section style={{
        background: "linear-gradient(160deg, #0F172A 0%, #1E3A5F 100%)",
        padding: "5rem 1.5rem",
      }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            textTransform: "uppercase",
            color: "white",
            lineHeight: 1,
            marginBottom: "0.75rem",
          }}>
            Rejoins nous sur nos réseaux
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "1rem", marginBottom: "2.5rem" }}>
            Pour être notifié en temps réel des pronos et des actus
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.5rem" }}>
            {/* Telegram */}
            <a
              href="https://t.me/prognobeastfree"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                textDecoration: "none",
              }}
            >
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "rgba(255,255,255,0.08)",
                border: "1.5px solid rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.2s",
              }}>
                {/* Telegram icon */}
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </div>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", fontWeight: 500 }}>Telegram</span>
            </a>

            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@prognobeast21"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                textDecoration: "none",
              }}
            >
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "rgba(255,255,255,0.08)",
                border: "1.5px solid rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {/* TikTok icon */}
                <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
                </svg>
              </div>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px", fontWeight: 500 }}>TikTok</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
