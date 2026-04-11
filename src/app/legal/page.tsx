// app/legal/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales — PrognoBeast",
  description: "Mentions légales, disclaimer et politique de confidentialité PrognoBeast.",
};

export default function LegalPage() {
  return (
    <div style={{ background: "white", minHeight: "100vh" }}>

      {/* Header */}
      <section style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB", padding: "3.5rem 1.5rem 3rem" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <span style={{
            display: "inline-block", background: "#EFF6FF", color: "#2563EB",
            fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", padding: "6px 14px", borderRadius: "999px",
            border: "1px solid #BFDBFE", marginBottom: "1.25rem",
          }}>
            Informations légales
          </span>
          <h1 style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            textTransform: "uppercase", color: "#111827", lineHeight: 1,
          }}>
            Mentions légales
          </h1>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: "3.5rem 1.5rem 5rem" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", gap: "2.5rem" }}>

          {/* Éditeur */}
          <div id="editeur">
            <h2 style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#111827", marginBottom: "0.75rem" }}>
              Éditeur du site
            </h2>
            <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.75 }}>
              Le site PrognoBeast (ci-après &quot;le Site&quot;) est édité par PrognoBeast.
              Contact :{" "}
              <a href="mailto:prognobeast@gmail.com" style={{ color: "#2563EB", textDecoration: "none", fontWeight: 500 }}>
                prognobeast@gmail.com
              </a>
            </p>
          </div>

          {/* Disclaimer */}
          <div id="disclaimer">
            <h2 style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#111827", marginBottom: "0.75rem" }}>
              Disclaimer — Avertissement sur les risques
            </h2>
            <div style={{
              background: "#FFF7ED", border: "1px solid #FED7AA",
              borderRadius: 12, padding: "1rem 1.25rem", marginBottom: "1rem",
            }}>
              <p style={{ fontSize: "14px", color: "#92400E", fontWeight: 600, marginBottom: "0.25rem" }}>⚠ Avertissement important</p>
              <p style={{ fontSize: "14px", color: "#78350F", lineHeight: 1.75 }}>
                Les paris sportifs comportent un risque de perte financière réelle. Les pronostics publiés
                sur PrognoBeast sont fournis à titre informatif et éducatif uniquement. Ils ne constituent
                en aucun cas des conseils financiers ou des garanties de gain.
              </p>
            </div>
            <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.75 }}>
              Les performances passées présentées sur ce site ne garantissent pas les résultats futurs.
              Tout parieur doit être conscient que les paris sportifs peuvent entraîner une perte totale
              des sommes misées. PrognoBeast ne peut être tenu responsable des pertes subies par ses membres ou lecteurs.
            </p>
            <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.75, marginTop: "0.75rem" }}>
              Nous encourageons vivement une pratique responsable et mesurée des paris sportifs.
              Ne misez jamais plus que ce que vous pouvez vous permettre de perdre. Si vous pensez
              souffrir d&apos;addiction aux jeux, contactez Joueurs Info Service au <strong style={{ color: "#374151" }}>09 74 75 13 13</strong> (gratuit).
            </p>
          </div>

          {/* Nature du contenu */}
          <div>
            <h2 style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#111827", marginBottom: "0.75rem" }}>
              Nature du contenu
            </h2>
            <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.75 }}>
              PrognoBeast est un service de pronostics sportifs à visée informative. Les analyses,
              statistiques et recommandations publiées reflètent l&apos;opinion de leurs auteurs au moment
              de leur rédaction. Elles ne constituent pas une incitation directe aux jeux d&apos;argent.
            </p>
            <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.75, marginTop: "0.75rem" }}>
              L&apos;accès au canal VIP Telegram implique la lecture et l&apos;acceptation pleine et entière
              du présent avertissement. Tout membre du canal VIP est réputé avoir pris connaissance
              des risques liés aux paris sportifs.
            </p>
          </div>

          {/* Propriété intellectuelle */}
          <div>
            <h2 style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#111827", marginBottom: "0.75rem" }}>
              Propriété intellectuelle
            </h2>
            <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.75 }}>
              L&apos;ensemble du contenu du site PrognoBeast (textes, analyses, visuels, marque, logo) est
              la propriété exclusive de PrognoBeast et est protégé par le droit de la propriété
              intellectuelle. Toute reproduction, distribution ou utilisation sans autorisation préalable
              écrite est interdite.
            </p>
          </div>

          {/* RGPD */}
          <div id="rgpd">
            <h2 style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#111827", marginBottom: "0.75rem" }}>
              Politique de confidentialité — RGPD
            </h2>
            <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.75 }}>
              PrognoBeast collecte uniquement les données strictement nécessaires au fonctionnement du
              service : nom et adresse email lors de l&apos;utilisation du formulaire de contact.
            </p>
            <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.75, marginTop: "0.75rem" }}>
              Ces données sont utilisées exclusivement pour répondre à vos demandes et ne sont jamais
              vendues, partagées ou cédées à des tiers. Conformément au RGPD, vous disposez d&apos;un droit
              d&apos;accès, de rectification et de suppression de vos données personnelles.
            </p>
            <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.75, marginTop: "0.75rem" }}>
              Pour exercer ces droits, contactez-nous à{" "}
              <a href="mailto:prognobeast@gmail.com" style={{ color: "#2563EB", textDecoration: "none", fontWeight: 500 }}>
                prognobeast@gmail.com
              </a>.
            </p>
          </div>

          {/* Cookies */}
          <div>
            <h2 style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#111827", marginBottom: "0.75rem" }}>
              Cookies
            </h2>
            <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.75 }}>
              Ce site utilise des cookies techniques strictement nécessaires à son fonctionnement.
              Aucun cookie de tracking publicitaire ou de profilage n&apos;est utilisé.
            </p>
          </div>

          {/* Limitation */}
          <div>
            <h2 style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#111827", marginBottom: "0.75rem" }}>
              Limitation de responsabilité
            </h2>
            <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.75 }}>
              PrognoBeast s&apos;efforce de maintenir les informations publiées à jour et exactes, mais ne
              peut garantir l&apos;exhaustivité ou l&apos;exactitude absolue du contenu. PrognoBeast décline
              toute responsabilité pour les décisions prises par les utilisateurs sur la base des
              informations publiées sur ce site.
            </p>
          </div>

          <p style={{ fontSize: "12px", color: "#D1D5DB", borderTop: "1px solid #E5E7EB", paddingTop: "1.5rem" }}>
            Dernière mise à jour : Avril 2026 · PrognoBeast
          </p>
        </div>
      </section>
    </div>
  );
}
