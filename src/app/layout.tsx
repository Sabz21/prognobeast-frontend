import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: { default: "PrognoBeast — Pronostics Sportifs Premium", template: "%s | PrognoBeast" },
  description: "PrognoBeast : pronostics football premium, value bets, gestion de bankroll et analyses expertes.",
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-[#080808] text-[#F8F8F8] antialiased">
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen w-full">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
