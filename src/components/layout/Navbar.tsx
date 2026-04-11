"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Zap, LogIn, LogOut, LayoutDashboard, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/about", label: "À propos" },
  { href: "/results", label: "Résultats" },
  { href: "/vip", label: "VIP" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
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
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[#080808]/95 backdrop-blur-xl border-b border-[#1F1F1F]" : "bg-transparent"
        }`}
      >
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-[#FF5C00] rounded flex items-center justify-center transition-all group-hover:scale-105 group-hover:rotate-3">
              <Zap size={16} className="text-white" fill="white" />
            </div>
            <span
              className="font-display text-2xl text-white tracking-widest uppercase"
              style={{ fontFamily: "'Bebas Neue',Impact,sans-serif" }}
            >
              Progno<span className="text-[#FF5C00]">Beast</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-xs font-semibold tracking-[0.15em] uppercase transition-colors duration-150 ${
                  pathname === l.href ? "text-[#FF5C00]" : "text-[#6B6B6B] hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#FF5C00] border-t-transparent rounded-full animate-spin" />
            ) : user ? (
              <>
                <Link
                  href={dashboardHref}
                  className={`flex items-center gap-1.5 text-xs font-semibold tracking-[0.12em] uppercase transition-colors px-4 py-2 rounded-lg border ${
                    pathname.startsWith(dashboardHref)
                      ? "border-[#FF5C00]/50 text-[#FF5C00]"
                      : "border-[#2A2A2A] text-[#6B6B6B] hover:text-white hover:border-[#444]"
                  }`}
                >
                  <DashboardIcon size={13} />
                  {dashboardLabel}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs font-semibold tracking-[0.12em] uppercase text-[#6B6B6B] hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-[#111]"
                >
                  <LogOut size={13} />
                  Déco
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 text-xs font-semibold tracking-[0.12em] uppercase text-[#6B6B6B] hover:text-white transition-colors border border-[#2A2A2A] hover:border-[#444] px-4 py-2 rounded-lg"
                >
                  <LogIn size={13} />
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="btn-shimmer text-white text-xs font-bold tracking-[0.15em] uppercase px-5 py-2.5 rounded transition-transform hover:scale-105 active:scale-95"
                >
                  Créer un compte
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-[#6B6B6B] hover:text-white transition-colors"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[#080808]/98 backdrop-blur-xl flex flex-col justify-center items-center gap-6 transition-all duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {links.map((l, i) => (
          <Link
            key={l.href}
            href={l.href}
            className={`font-display text-6xl tracking-widest uppercase transition-colors ${
              pathname === l.href ? "text-[#FF5C00]" : "text-white hover:text-[#FF5C00]"
            }`}
            style={{
              fontFamily: "'Bebas Neue',Impact,sans-serif",
              animationDelay: `${i * 0.05}s`,
            }}
          >
            {l.label}
          </Link>
        ))}

        {user ? (
          <>
            <Link
              href={dashboardHref}
              className="font-display text-4xl tracking-widest uppercase text-[#FF5C00] hover:opacity-80"
              style={{ fontFamily: "'Bebas Neue',Impact,sans-serif" }}
            >
              {dashboardLabel}
            </Link>
            <button
              onClick={handleLogout}
              className="mt-2 text-sm font-semibold text-[#6B6B6B] hover:text-white tracking-widest uppercase transition-colors"
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="font-display text-4xl tracking-widest uppercase text-white hover:text-[#FF5C00] transition-colors"
              style={{ fontFamily: "'Bebas Neue',Impact,sans-serif" }}
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className="mt-2 btn-shimmer text-white text-sm font-bold tracking-widest uppercase px-8 py-4 rounded"
            >
              Créer un compte
            </Link>
          </>
        )}
      </div>
    </>
  );
}
