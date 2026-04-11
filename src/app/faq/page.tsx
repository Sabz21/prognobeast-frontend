// app/faq/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "FAQ — Questions fréquentes | PrognoBeast",
  description: "Toutes les réponses à vos questions sur PrognoBeast, les abonnements VIP et les pronostics.",
};

const faqItems = [
  {
    category: "Abonnement VIP",
    questions: [
      {
        q: "Comment accéder au canal VIP après l'achat ?",
        a: "Après votre paiement, dites-moi en commentaire de n'importe quel message sur le Telegram public que c'est bon et vous serez automatiquement ajouté au VIP.",
      },
      {
        q: "Y a-t-il un renouvellement automatique ?",
        a: "Non. Aucun renouvellement automatique. Votre abonnement est à durée déterminée. À expiration, vous choisissez si vous souhaitez renouveler.",
      },
      {
        q: "Puis-je changer de formule en cours d'abonnement ?",
        a: "Oui, contactez-nous directement sur Telegram et nous trouverons la meilleure solution pour vous.",
      },
      {
        q: "Le paiement est-il sécurisé ?",
        a: "Oui. Tous les paiements sont traités par Stripe, la référence mondiale en matière de paiement en ligne sécurisé.",
      },
    ],
  },
  {
    category: "Pronostics",
    questions: [
      {
        q: "Les pronostics concernent quels sports ?",
        a: "PrognoBeast couvre principalement le football (toutes ligues), le tennis, et un peu de NBA.",
      },
      {
        q: "À quelle fréquence les pronostics sont-ils publiés ?",
        a: "Les pronostics sont publiés régulièrement selon l'actualité sportive. En période chargée (championnats, coupes), plusieurs picks par jour peuvent être publiés.",
      },
      {
        q: "Comment fonctionne la gestion de bankroll ?",
        a: "Chaque pronostic est accompagné d'une mise recommandée en unités (de 1 à 3u). Ce système permet de gérer votre capital de façon structurée et de limiter les risques.",
      },
    ],
  },
  {
    category: "Général",
    questions: [
      {
        q: "Comment rejoindre le Telegram public gratuit ?",
        a: "Clique sur le lien Telegram dans la barre d'annonce en haut de la page ou directement sur t.me/prognobeastfree.",
      },
      {
        q: "Comment vous contacter ?",
        a: "Tu peux nous contacter directement sur Telegram ou par email à prognobeast@gmail.com.",
      },
    ],
  },
];

export default function FaqPage() {
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
            Aide
          </span>
          <h1 style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            textTransform: "uppercase", color: "#111827", lineHeight: 1, marginBottom: "0.75rem",
          }}>
            Questions fréquentes
          </h1>
          <p style={{ color: "#6B7280", fontSize: "1rem", lineHeight: 1.7 }}>
            Tout ce que vous devez savoir sur PrognoBeast et le VIP.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "3.5rem 1.5rem 5rem" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", gap: "3rem" }}>

          {faqItems.map((cat) => (
            <div key={cat.category}>
              <h2 style={{
                fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em",
                textTransform: "uppercase", color: "#2563EB", marginBottom: "1rem",
              }}>
                {cat.category}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {cat.questions.map((item) => (
                  <details
                    key={item.q}
                    style={{
                      background: "#F9FAFB", border: "1.5px solid #E5E7EB",
                      borderRadius: 12, overflow: "hidden",
                    }}
                  >
                    <summary style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "1rem 1.25rem", cursor: "pointer", listStyle: "none",
                      fontSize: "14px", fontWeight: 600, color: "#111827",
                    }}>
                      {item.q}
                      <span style={{ color: "#9CA3AF", flexShrink: 0, marginLeft: 12, fontSize: 18 }}>+</span>
                    </summary>
                    <div style={{ padding: "0 1.25rem 1rem", borderTop: "1px solid #E5E7EB" }}>
                      <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.75, paddingTop: "0.75rem" }}>
                        {item.q === "Comment rejoindre le Telegram public gratuit ?" ? (
                          <>
                            Clique sur le lien Telegram dans la barre d&apos;annonce en haut de la page ou directement sur{" "}
                            <a href="https://t.me/prognobeastfree" target="_blank" rel="noopener noreferrer"
                              style={{ color: "#2563EB", fontWeight: 500, textDecoration: "none" }}>
                              t.me/prognobeastfree
                            </a>.
                          </>
                        ) : item.q === "Comment vous contacter ?" ? (
                          <>
                            Tu peux nous contacter directement sur{" "}
                            <a href="https://t.me/prognobeastfree" target="_blank" rel="noopener noreferrer"
                              style={{ color: "#2563EB", fontWeight: 500, textDecoration: "none" }}>
                              Telegram
                            </a>{" "}ou par email à{" "}
                            <a href="mailto:prognobeast@gmail.com"
                              style={{ color: "#2563EB", fontWeight: 500, textDecoration: "none" }}>
                              prognobeast@gmail.com
                            </a>.
                          </>
                        ) : item.a}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}

          {/* CTA bas */}
          <div style={{
            background: "#EFF6FF", border: "1.5px solid #BFDBFE",
            borderRadius: 16, padding: "2rem", textAlign: "center",
          }}>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#111827", marginBottom: "0.4rem" }}>
              Vous n&apos;avez pas trouvé votre réponse ?
            </p>
            <p style={{ fontSize: "13px", color: "#6B7280", marginBottom: "1.25rem" }}>
              Notre équipe répond rapidement sur Telegram.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="https://t.me/prognobeastfree" target="_blank" rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  background: "#2563EB", color: "white", fontSize: "13px", fontWeight: 600,
                  padding: "10px 20px", borderRadius: 10, textDecoration: "none",
                  boxShadow: "0 4px 12px rgba(37,99,235,0.2)",
                }}>
                Contacter sur Telegram <ArrowRight size={13} />
              </a>
              <Link href="/vip"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  background: "white", color: "#374151", fontSize: "13px", fontWeight: 600,
                  padding: "10px 20px", borderRadius: 10, textDecoration: "none",
                  border: "1.5px solid #E5E7EB",
                }}>
                Voir les offres VIP <ArrowRight size={13} />
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
