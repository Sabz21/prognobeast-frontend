// app/vip/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offres VIP — Abonnements PrognoBeast",
  description: "Rejoignez le canal VIP PrognoBeast.",
};

const plans = [
  {
    id: "1mois", label: "1 Mois", price: "14,99", perMonth: "14,99", popular: false,
    description: "Découvrez la méthode PrognoBeast.",
    savings: null, stripeLink: "https://buy.stripe.com/fZudR95Csgmaevl2yW9MY01",
  },
  {
    id: "3mois", label: "3 Mois", price: "34,99", perMonth: "11,66", popular: false,
    description: "Le temps de valider la méthode et voir les résultats.",
    savings: "−22%", stripeLink: "https://buy.stripe.com/3cIdR9e8Yee2gDt4H49MY00",
  },
  {
    id: "6mois", label: "6 Mois", price: "59,99", perMonth: "10,00", popular: true,
    description: "L'offre idéale pour performer sur le long terme.",
    savings: "−33%", stripeLink: "https://buy.stripe.com/6oUdR9fd2d9Y5YPb5s9MY02",
  },
  {
    id: "12mois", label: "12 Mois", price: "119,99", perMonth: "10,00", popular: false,
    description: "Le meilleur rapport qualité/prix. Une saison complète.",
    savings: "−33%", stripeLink: "https://buy.stripe.com/fZubJ1fd23zo86XehE9MY03",
  },
];

const vipIncludes = [
  "Accès au canal Telegram VIP privé",
  "Tous les pronostics premium en temps réel",
  "Analyses pré-match complètes et détaillées",
  "Système de mise par unités (bankroll structurée)",
  "Suivi de performance mensuel",
  "Récapitulatifs et bilans exclusifs",
  "Support et communauté réactive",
  "Accès aux analyses de matchs spéciaux",
];

const faq = [
  {
    question: "Comment accéder au canal VIP après l'achat ?",
    answer: "Après votre paiement, dites-moi en commentaire de n'importe quel message sur le Telegram public que c'est bon et vous serez automatiquement ajouté au VIP.",
  },
  {
    question: "Y a-t-il un renouvellement automatique ?",
    answer: "Non. Aucun renouvellement automatique. Votre abonnement est à durée déterminée. À expiration, vous choisissez si vous souhaitez renouveler.",
  },
  {
    question: "Puis-je changer de formule en cours d'abonnement ?",
    answer: "Oui, contactez-nous directement sur Telegram et nous trouverons la meilleure solution pour vous.",
  },
  {
    question: "Les pronostics concernent quels sports ?",
    answer: "PrognoBeast couvre principalement le football (toutes ligues), le tennis, et un peu de NBA.",
  },
];

export default function VipPage() {
  return (
    <div style={{ background: "white" }}>

      {/* ── Header ── */}
      <section style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB", padding: "3.5rem 1.5rem 3rem" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <span style={{
            display: "inline-block", background: "#EFF6FF", color: "#2563EB",
            fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", padding: "6px 14px", borderRadius: "999px",
            border: "1px solid #BFDBFE", marginBottom: "1.25rem",
          }}>
            Accès VIP
          </span>
          <h1 style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: "clamp(2.5rem, 7vw, 6rem)",
            textTransform: "uppercase", color: "#111827", lineHeight: 0.95, marginBottom: "1rem",
          }}>
            Rejoignez le{" "}
            <span style={{
              background: "linear-gradient(135deg, #2563EB, #60A5FA)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              niveau supérieur
            </span>
          </h1>
          <p style={{ color: "#6B7280", fontSize: "1rem", lineHeight: 1.7 }}>
            Accès aux pronostics premium, analyses détaillées et accompagnement bankroll — le tout dans un canal Telegram VIP dédié.
          </p>
        </div>
      </section>

      {/* ── Plans ── */}
      <section style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
            textTransform: "uppercase", color: "#111827",
            textAlign: "center", marginBottom: "2.5rem",
          }}>
            Choisissez votre formule
          </h2>

          <div className="plans-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
            {plans.map((plan) => (
              <div key={plan.id} style={{
                position: "relative",
                background: plan.popular ? "#2563EB" : "white",
                border: plan.popular ? "2px solid #2563EB" : "1.5px solid #E5E7EB",
                borderRadius: 16, padding: "1.5rem",
                display: "flex", flexDirection: "column",
                boxShadow: plan.popular ? "0 8px 30px rgba(37,99,235,0.2)" : "0 1px 4px rgba(0,0,0,0.05)",
              }}>
                {plan.popular && (
                  <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap" }}>
                    <span style={{
                      background: "white", color: "#2563EB", fontSize: "10px", fontWeight: 700,
                      letterSpacing: "0.1em", textTransform: "uppercase",
                      padding: "5px 12px", borderRadius: "999px",
                      border: "1px solid #BFDBFE", boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}>
                      Le plus populaire
                    </span>
                  </div>
                )}
                {plan.savings && (
                  <div style={{
                    position: "absolute", top: 16, right: 16,
                    fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "999px",
                    background: plan.popular ? "rgba(255,255,255,0.2)" : "#EFF6FF",
                    color: plan.popular ? "white" : "#2563EB",
                  }}>
                    {plan.savings}
                  </div>
                )}
                <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: plan.popular ? "rgba(255,255,255,0.6)" : "#9CA3AF", marginBottom: 6 }}>
                  VIP PrognoBeast
                </p>
                <h3 style={{ fontSize: "1.4rem", fontWeight: 700, color: plan.popular ? "white" : "#111827", marginBottom: 6 }}>
                  {plan.label}
                </h3>
                <p style={{ fontSize: "0.85rem", lineHeight: 1.5, color: plan.popular ? "rgba(255,255,255,0.75)" : "#6B7280", marginBottom: "1.25rem", flexGrow: 1 }}>
                  {plan.description}
                </p>
                <div style={{ marginBottom: "1.25rem" }}>
                  <span style={{ fontSize: "1.75rem", fontWeight: 700, color: plan.popular ? "white" : "#111827" }}>
                    {plan.price} €
                  </span>
                  <p style={{ fontSize: "0.75rem", marginTop: 2, color: plan.popular ? "rgba(255,255,255,0.55)" : "#9CA3AF" }}>
                    soit {plan.perMonth} €/mois
                  </p>
                </div>
                <a href={plan.stripeLink} target="_blank" rel="noopener noreferrer" style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: plan.popular ? "white" : "#2563EB",
                  color: plan.popular ? "#2563EB" : "white",
                  fontSize: "13px", fontWeight: 600, padding: "11px 0", borderRadius: 10,
                  textDecoration: "none",
                }}>
                  Obtenir
                </a>
              </div>
            ))}
          </div>

          <p style={{ textAlign: "center", color: "#9CA3AF", fontSize: "12px", marginTop: "1.25rem" }}>
            Paiement sécurisé · Accès immédiat
          </p>
        </div>
      </section>

      {/* ── Ce qui est inclus ── */}
      <section style={{ background: "white", borderBottom: "1px solid #E5E7EB", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
            textTransform: "uppercase", color: "#111827",
            textAlign: "center", marginBottom: "2rem",
          }}>
            Tout ce qui est inclus
          </h2>
          <div className="included-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            {vipIncludes.map((item) => (
              <div key={item} style={{
                display: "flex", alignItems: "center", gap: 12,
                background: "#F9FAFB", border: "1px solid #E5E7EB",
                borderRadius: 12, padding: "14px 18px",
              }}>
                <div style={{ width: 24, height: 24, minWidth: 24, background: "#EFF6FF", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span style={{ fontSize: "14px", color: "#374151", fontWeight: 500 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: "#F9FAFB", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
            textTransform: "uppercase", color: "#111827",
            textAlign: "center", marginBottom: "1.5rem",
          }}>
            Questions fréquentes
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {faq.map((item) => (
              <details key={item.question} style={{ background: "white", border: "1.5px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
                <summary style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "1rem 1.25rem", cursor: "pointer", listStyle: "none",
                  fontSize: "14px", fontWeight: 600, color: "#111827",
                }}>
                  {item.question}
                  <span style={{ color: "#9CA3AF", flexShrink: 0, marginLeft: 12, fontSize: 18 }}>+</span>
                </summary>
                <div style={{ padding: "0 1.25rem 1rem", borderTop: "1px solid #F3F4F6" }}>
                  <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.75, paddingTop: "0.75rem" }}>
                    {item.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>

          <div style={{
            marginTop: "2rem", textAlign: "center",
            background: "white", border: "1.5px solid #E5E7EB", borderRadius: 16, padding: "2rem",
          }}>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#111827", marginBottom: "0.4rem" }}>
              Vous avez d&apos;autres questions ?
            </p>
            <p style={{ fontSize: "13px", color: "#6B7280", marginBottom: "1.25rem" }}>
              Notre équipe répond dans les plus brefs délais.
            </p>
            <a href="https://t.me/prognobeastfree" target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#2563EB", color: "white", fontSize: "13px", fontWeight: 600,
              padding: "10px 22px", borderRadius: 10, textDecoration: "none",
              boxShadow: "0 4px 12px rgba(37,99,235,0.2)",
            }}>
              Contacter sur Telegram
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
