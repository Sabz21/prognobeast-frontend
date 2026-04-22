import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: {
    default: "PrognoBeast — Pronostics Sportifs Premium",
    template: "%s | PrognoBeast",
  },
  description:
    "PrognoBeast : pronostics football premium, value bets, gestion de bankroll et analyses expertes. Rejoignez la communauté qui performe sur le long terme.",
  keywords: ["pronostics football", "value bets", "bankroll management", "tipster premium", "PrognoBeast"],
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "PrognoBeast — Pronostics Sportifs Premium",
    description: "Analyses expertes, value bets et gestion de bankroll. Performez sur le long terme.",
    type: "website",
    locale: "fr_FR",
    images: [{ url: "/og-image.png", width: 512, height: 512, alt: "PrognoBeast" }],
  },
  twitter: {
    card: "summary",
    title: "PrognoBeast — Pronostics Sportifs Premium",
    description: "Analyses expertes, value bets et gestion de bankroll.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-white text-[#111827] antialiased">
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
