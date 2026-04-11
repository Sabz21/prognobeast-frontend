import Link from "next/link";
import { Zap, Send } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[#1F1F1F] bg-[#080808]">
      {/* CTA band */}
      <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-10 py-16 flex flex-col md:flex-row items-center justify-between gap-8 border-b border-[#1F1F1F]">
        <div>
          <p className="font-display text-4xl md:text-5xl text-white uppercase tracking-wide leading-tight" style={{fontFamily:"'Bebas Neue',Impact,sans-serif"}}>
            Prêt à performer <span className="text-[#FF5C00]">sur le long terme ?</span>
          </p>
          <p className="text-[#6B6B6B] text-sm mt-2">Rejoignez des centaines de membres qui font confiance à la méthode PrognoBeast.</p>
        </div>
        <a href="https://t.me/PrognoBeast" target="_blank" rel="noopener noreferrer"
          className="shrink-0 btn-shimmer text-white text-sm font-bold tracking-widest uppercase px-8 py-4 rounded flex items-center gap-2.5 hover:scale-105 transition-transform">
          <Send size={15} /> Rejoindre Telegram
        </a>
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-10 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 bg-[#FF5C00] rounded flex items-center justify-center">
              <Zap size={14} className="text-white" fill="white" />
            </div>
            <span className="font-display text-xl text-white tracking-widest uppercase" style={{fontFamily:"'Bebas Neue',Impact,sans-serif"}}>
              Progno<span className="text-[#FF5C00]">Beast</span>
            </span>
          </Link>
          <p className="text-[#444] text-sm leading-relaxed max-w-xs">Value bets, gestion de bankroll et discipline. La seule méthode qui fonctionne sur le long terme.</p>
        </div>
        <div>
          <p className="text-white text-xs font-bold tracking-widest uppercase mb-4">Navigation</p>
          <ul className="flex flex-col gap-2.5">
            {[{href:"/",l:"Accueil"},{href:"/about",l:"À propos"},{href:"/results",l:"Résultats"},{href:"/vip",l:"VIP"},{href:"/contact",l:"Contact"}].map(i => (
              <li key={i.href}><Link href={i.href} className="text-[#444] text-sm hover:text-white transition-colors">{i.l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-white text-xs font-bold tracking-widest uppercase mb-4">Légal</p>
          <ul className="flex flex-col gap-2.5">
            {[{href:"/legal",l:"Mentions légales"},{href:"/legal#disclaimer",l:"Disclaimer"},{href:"/legal#rgpd",l:"RGPD"}].map(i => (
              <li key={i.href}><Link href={i.href} className="text-[#444] text-sm hover:text-white transition-colors">{i.l}</Link></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-10 pb-8 flex flex-col md:flex-row justify-between items-center gap-3 border-t border-[#1F1F1F] pt-6">
        <p className="text-[#2A2A2A] text-xs">© {year} PrognoBeast. Tous droits réservés.</p>
        <p className="text-[#2A2A2A] text-xs text-center md:text-right max-w-sm">Les paris sportifs comportent des risques. Jouez de façon responsable. Contenu strictement informatif.</p>
      </div>
    </footer>
  );
}
