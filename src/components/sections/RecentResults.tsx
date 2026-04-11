import Link from "next/link";
import SectionTitle from "@/components/ui/SectionTitle";
import StatCard from "@/components/ui/StatCard";
import { recentBets, globalStats } from "@/data/mockResults";
import { TrendingUp, Target, Percent, Calendar } from "lucide-react";

export default function RecentResults() {
  return (
    <section className="w-full bg-[#080808] py-24">
      <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionTitle label="Performances" title="Les chiffres" accent="chiffres" subtitle="Tous nos résultats sont publics et vérifiables." />
          <Link href="/results" className="shrink-0 text-xs font-bold tracking-[0.15em] uppercase text-[#FF5C00] hover:text-[#FF7A2E] transition-colors flex items-center gap-2 mb-14">
            Voir tout le bilan →
          </Link>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard icon={TrendingUp} value={`+${globalStats.unitesGagnees}u`} label="Unités gagnées" sublabel={`Sur ${globalStats.moisSuivi} mois`} accent="orange" />
          <StatCard icon={Target}    value={`${globalStats.winRate}%`} label="Win Rate" sublabel={`${globalStats.totalPronostics} pronostics`} accent="white" />
          <StatCard icon={Percent}   value={`+${globalStats.roi}%`} label="ROI moyen" sublabel="Rendement global" accent="orange" />
          <StatCard icon={Calendar}  value={`${globalStats.serieWin}`} label="Série en cours" sublabel="Wins consécutifs" accent="white" />
        </div>

        {/* Table */}
        <div className="glass border border-[#1F1F1F] rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1F1F1F] flex items-center justify-between">
            <h3 className="text-white font-bold text-sm">Derniers pronostics</h3>
            <span className="text-[#444] text-xs">8 derniers tips</span>
          </div>

          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1F1F1F] text-[#333] text-xs font-bold tracking-widest uppercase">
                  {["Date","Match","Tip","Cote","Mise","Résultat","Gain"].map(h => (
                    <th key={h} className={`px-6 py-4 ${h==="Résultat"||h==="Cote"||h==="Mise" ? "text-center" : h==="Gain" ? "text-right" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentBets.map((bet, i) => (
                  <tr key={bet.id} className={`border-b border-[#0F0F0F] hover:bg-[#0E0E0E] transition-colors ${i===recentBets.length-1?"border-b-0":""}`}>
                    <td className="px-6 py-4 text-[#444] text-xs font-mono">{bet.date}</td>
                    <td className="px-6 py-4">
                      <p className="text-white font-semibold">{bet.match}</p>
                      <p className="text-[#333] text-xs">{bet.competition}</p>
                    </td>
                    <td className="px-6 py-4 text-[#666] text-xs font-mono">{bet.tip}</td>
                    <td className="px-6 py-4 text-center text-white font-bold">{bet.cote}</td>
                    <td className="px-6 py-4 text-center text-[#555] text-xs">{bet.mise}u</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded text-xs font-bold tracking-wider uppercase
                        ${bet.resultat==="win" ? "bg-emerald-500/8 text-emerald-400 border border-emerald-500/15"
                        : bet.resultat==="loss" ? "bg-[#FF5C00]/8 text-[#FF5C00] border border-[#FF5C00]/15"
                        : "bg-[#1F1F1F] text-[#444]"}`}>
                        {bet.resultat==="win" ? "✓ Win" : bet.resultat==="loss" ? "✗ Loss" : "Void"}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-bold ${bet.gain>0?"text-emerald-400":"text-[#FF5C00]"}`}>
                      {bet.gain>0?`+${bet.gain}u`:`${bet.gain}u`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="md:hidden divide-y divide-[#0F0F0F]">
            {recentBets.slice(0,5).map(bet => (
              <div key={bet.id} className="px-5 py-4 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{bet.match}</p>
                  <p className="text-[#444] text-xs mt-0.5">{bet.tip} — @{bet.cote}</p>
                </div>
                <span className={`text-sm font-bold shrink-0 ${bet.gain>0?"text-emerald-400":"text-[#FF5C00]"}`}>
                  {bet.gain>0?`+${bet.gain}u`:`${bet.gain}u`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
