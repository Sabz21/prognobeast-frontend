// components/layout/Footer.tsx
import Link from "next/link";
import Image from "next/image";
import { Send } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "#F9FAFB", borderTop: "1px solid #E5E7EB" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3.5rem 1.5rem 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "2.5rem" }}>

          {/* Brand */}
          <div>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: "1rem" }}>
              <Image src="/images/logo.png" alt="PrognoBeast" width={36} height={36} style={{ objectFit: "contain", borderRadius: 8 }} />
              <span style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: "1.2rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#111827" }}>
                Progno<span style={{ color: "#2563EB" }}>Beast</span>
              </span>
            </Link>
            <p style={{ color: "#9CA3AF", fontSize: "13px", lineHeight: 1.7, maxWidth: 260 }}>
              Pronostics sportifs premium. Value bets, gestion de bankroll et discipline.
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: "1rem" }}>
              <a href="https://t.me/prognobeastfree" target="_blank" rel="noopener noreferrer"
                style={{ width: 34, height: 34, border: "1px solid #E5E7EB", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF", background: "white", textDecoration: "none" }}>
                <Send size={13} />
              </a>
              <a href="https://www.tiktok.com/@prognobeast21" target="_blank" rel="noopener noreferrer"
                style={{ width: 34, height: 34, border: "1px solid #E5E7EB", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF", background: "white", textDecoration: "none" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#111827", marginBottom: "1rem" }}>Navigation</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { href: "/", label: "Accueil" },
                { href: "/stats-public", label: "Stats public" },
                { href: "/stats-vip", label: "Stats VIP" },
                { href: "/vip", label: "Offres VIP" },
                { href: "/faq", label: "FAQ" },
              ].map((link) => (
                <Link key={link.href} href={link.href} style={{ color: "#9CA3AF", fontSize: "13px", textDecoration: "none" }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Légal */}
          <div>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#111827", marginBottom: "1rem" }}>Légal</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { href: "/legal", label: "Mentions légales" },
                { href: "/legal#disclaimer", label: "Disclaimer" },
                { href: "/legal#rgpd", label: "Politique RGPD" },
              ].map((link) => (
                <Link key={link.href} href={link.href} style={{ color: "#9CA3AF", fontSize: "13px", textDecoration: "none" }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#111827", marginBottom: "1rem" }}>Contact</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <a href="https://t.me/prognobeastfree" target="_blank" rel="noopener noreferrer" style={{ color: "#9CA3AF", fontSize: "13px", textDecoration: "none" }}>Telegram</a>
              <a href="mailto:prognobeast@gmail.com" style={{ color: "#9CA3AF", fontSize: "13px", textDecoration: "none" }}>prognobeast@gmail.com</a>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div style={{ borderTop: "1px solid #E5E7EB", marginTop: "2.5rem", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <p style={{ color: "#D1D5DB", fontSize: "12px" }}>© {year} PrognoBeast. Tous droits réservés.</p>
          <p style={{ color: "#D1D5DB", fontSize: "12px" }}>Les paris sportifs comportent des risques. Jouez de façon responsable.</p>
        </div>
      </div>
    </footer>
  );
}
