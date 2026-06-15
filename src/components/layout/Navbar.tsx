"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Menu, X, LogIn, LogOut, LayoutDashboard, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { href: "/", label: "Accueil" },
{ href: "/stats-public", label: "Stats public" },
  { href: "/stats-vip", label: "Stats VIP" },
  { href: "/simulation", label: "Simulation" },
  { href: "/faq", label: "FAQ" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  function handleLogout() {
    logout();
    router.push("/");
  }

  const dashboardHref = user?.role === "ADMIN" ? "/admin" : "/dashboard";
  const dashboardLabel = user?.role === "ADMIN" ? "Admin" : "Mon espace";
  const DashboardIcon = user?.role === "ADMIN" ? ShieldCheck : LayoutDashboard;

  return (
    <>
      {/* Barre d'annonce */}
      <div style={{
        background: "#2563EB",
        padding: "10px 1rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}>
        <span style={{ color: "white", fontSize: "13px", fontWeight: 500 }}>
          Pour recevoir les pronostics rejoins nous sur{" "}
          <a
            href="https://t.me/prognobeastfree"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "white", fontWeight: 700, textDecoration: "underline", textUnderlineOffset: "2px" }}
          >
            Telegram →
          </a>
        </span>
      </div>

      {/* Navbar principale */}
      <nav className={`sticky top-0 left-0 right-0 z-50 bg-white transition-all duration-200 ${
        scrolled ? "shadow-sm border-b border-[#E5E7EB]" : "border-b border-[#F3F4F6]"
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo + Nav gauche */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2 group">
                <Image
                  src="/images/logo.png"
                  alt="PrognoBeast"
                  width={40}
                  height={40}
                  className="rounded-lg transition-transform group-hover:scale-105"
                  style={{ objectFit: "contain" }}
                />
                <span className="text-xl tracking-widest text-[#111827] uppercase"
                  style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}>
                  Progno<span className="text-[#2563EB]">Beast</span>
                </span>
              </Link>

              <div className="hidden md:flex items-center gap-7">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href}
                    style={{ fontSize: "15px", fontWeight: 500 }}
                    className={`transition-colors duration-150 ${
                      pathname === link.href ? "text-[#2563EB]" : "text-[#6B7280] hover:text-[#111827]"
                    }`}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Auth buttons desktop */}
            <div className="hidden md:flex items-center gap-3">
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
              ) : user ? (
                <>
                  <Link href={dashboardHref}
                    className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${
                      pathname.startsWith(dashboardHref)
                        ? "border-[#2563EB] text-[#2563EB] bg-[#EFF6FF]"
                        : "border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] hover:border-[#D1D5DB]"
                    }`}>
                    <DashboardIcon size={14} />
                    {dashboardLabel}
                  </Link>
                  <button onClick={handleLogout}
                    className="flex items-center gap-1.5 text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors px-3 py-2">
                    <LogOut size={14} />
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login"
                    className="flex items-center gap-1.5 text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors border border-[#E5E7EB] hover:border-[#D1D5DB] px-4 py-2 rounded-lg">
                    <LogIn size={14} />
                    Connexion
                  </Link>
                  <Link href="/register"
                    className="text-sm font-semibold text-white px-4 py-2 rounded-lg transition-colors"
                    style={{ background: "#2563EB" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#1D4ED8")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#2563EB")}>
                    Créer un compte
                  </Link>
                </>
              )}
            </div>

            {/* Mobile burger */}
            <button onClick={() => setOpen(!open)}
              className="md:hidden text-[#6B7280] hover:text-[#111827] transition-colors p-1" aria-label="Menu">
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 40,
        background: "white",
        display: "flex", flexDirection: "column",
        paddingTop: "5.5rem", paddingLeft: "1.75rem", paddingRight: "1.75rem",
        transition: "opacity 0.25s ease",
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
      }}>
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} style={{
            fontSize: "1.6rem", fontWeight: 600,
            paddingTop: "0.85rem", paddingBottom: "0.85rem",
            borderBottom: "1px solid #F3F4F6",
            color: pathname === link.href ? "#2563EB" : "#111827",
            textDecoration: "none", display: "block",
          }}>
            {link.label}
          </Link>
        ))}
        <div style={{ paddingTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {user ? (
            <>
              <Link href={dashboardHref} style={{
                fontSize: "1rem", fontWeight: 600, color: "#2563EB",
                display: "flex", alignItems: "center", gap: "0.5rem",
              }}>
                <DashboardIcon size={18} /> {dashboardLabel}
              </Link>
              <button onClick={handleLogout} style={{
                fontSize: "0.95rem", fontWeight: 500, color: "#6B7280",
                display: "flex", alignItems: "center", gap: "0.5rem",
                background: "none", border: "none", cursor: "pointer", padding: 0,
              }}>
                <LogOut size={16} /> Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={{
                fontSize: "1rem", fontWeight: 600, color: "#111827",
                display: "flex", alignItems: "center", gap: "0.5rem",
              }}>
                <LogIn size={18} /> Connexion
              </Link>
              <Link href="/register" style={{
                fontSize: "0.95rem", fontWeight: 600, color: "white",
                background: "#2563EB", padding: "0.75rem 1.25rem",
                borderRadius: "0.5rem", textAlign: "center", textDecoration: "none",
              }}>
                Créer un compte
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
