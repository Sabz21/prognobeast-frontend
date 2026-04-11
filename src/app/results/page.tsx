import type { Metadata } from "next";
import SectionTitle from "@/components/ui/SectionTitle";
import StatCard from "@/components/ui/StatCard";
import { recentBets, globalStats, monthlyStats } from "@/data/mockResults";
import { TrendingUp, Target, Percent, Calendar, Award } from "lucide-react";
export const metadata: Metadata = { title: "Résultats & Stats" };

export default function ResultsPage() {
  return (
    <>
      <section className="relative w-full pt-36 pb-16 bg-[#080808] border-b border-[#1F1F1F] overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#FF5C00] opacity-[0.03] rounded-full blur-[120px] pointer-events-none" />
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-10">
          <span className="inline-flex items-center gap-2 text-[#FF5C00] text-xs font-bold tracking-[0.2em] uppercase mb-6">
            <span className="w-4 h-px bg-[#FF5C00]" />Bilan public<span className="w-4 h-px bg-[#FF5C00]" />
          </span>
          <h1 className="font-display text-6xl md:text-8xl text-white uppercase leading-none tracking-wide mb-4" style={{fontFamily:"'Bebas Neue',Impact,sans-serif"}}>
            Résultats & <span className="text-orange">Performance</span>
          </h1>
          <p className="text-[#555] text-lg max-w-xl leading-relaxed">Tous nos résultats sont publiés sans filtre. Win, loss, série difficile — la transparence est notre engagement.</p>
        </div>
      </section>

      <section className="w-full bg-[#080808] border-b border-[#1F1F1F] py-16">
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="text-[#333] text-xs font-bold tracking-widest uppercase mb-6">Statistiques globales — depuis le lancement</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatCard icon={TrendingUp} value={`+${globalStats.unitesGagnees}u`} label="Unités gagnées" accent="orange" />
            <StatCard icon={Target}    value={`${globalStats.winRate}%`} label="Win Rate" sublabel={`${globalStats.totalPronostics} pronostics`} accent="white" />
            <StatCard icon={Percent}   value={`+${globalStats.roi}%`} label="ROI moyen" accent="orange" />
            <StatCard icon={Calendar}  value={`${globalStats.moisSuivi}`} label="Mois de suivi" accent="white" />
            <StatCard icon={Award}     value={`${globalStats.serieWin}`} label="Série en cours" accent="orange" />
          </div>
        </div>
      </section>

      <section className="w-full bg-[#0B0B0B] border-b border-[#1F1F1F] py-16">
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-10">
          <SectionTitle label="Par mois" title="Bilan mensuel" accent="mensuel" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {monthlyStats.map(m => (
              <div key={m.month} className="glass border border-[#1F1F1F] hover:border-[#FF5C00]/25 rounded-lg p-6 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-white font-bold text-sm">{m.month}</p>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded ${m.unitesGagnees>0?"bg-emerald-500/8 text-emerald-400 border border-emerald-500/15":"bg-[#FF5C00]/8 text-[#FF5C00] border border-[#FF5C00]/15"}`}>
                    {m.unitesGagnees>0?`+${m.unitesGagnees}u`:`${m.unitesGagnees}u`}
                  </span>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-[#444] mb-1.5">
                    <span>{m.wins}W / {m.losses}L{m.voids>0?` / ${m.voids}V`:""}</span>
                    <span className="text-white font-bold">{m.winRate}% WR</span>
                  </div>
                  <div className="h-1 bg-[#1F1F1F] rounded-full overflow-hidden">
                    <div className="h-full bg-[#FF5C00] rounded-full" style={{width:`${m.winRate}%`}} />
                  </div>
                </div>
                <div className="flex justify-between text-xs text-[#444] pt-3 border-t border-[#1F1F1F]">
                  <span>ROI mensuel</span>
                  <span className={m.roi>0?"text-emerald-400 font-bold":"text-[#FF5C00] font-bold"}>{m.roi>0?`+${m.roi}%`:`${m.roi}%`}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-[#080808] py-16">
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-10">
          <SectionTitle label="Historique" title="Derniers pronostics" accent="pronostics" />
          <div className="glass border border-[#1F1F1F] rounded-lg overflow-hidden mt-8">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1F1F1F] text-[#333] text-xs font-bold tracking-widest uppercase">
                    {["Date","Match","Compétition","Tip","Cote","Mise","Résultat","+/- Unités"].map(h => (
                      <th key={h} className={`px-6 py-4 ${["Cote","Mise","Résultat"].includes(h)?"text-center":h==="+/- Unités"?"text-right":"text-left"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentBets.map((bet, i) => (
                    <tr key={bet.id} className={`border-b border-[#0F0F0F] hover:bg-[#0E0E0E] transition-colors ${i===recentBets.length-1?"border-b-0":""}`}>
                      <td className="px-6 py-4 text-[#333] text-xs font-mono">{bet.date}</td>
                      <td className="px-6 py-4 text-white font-semibold">{bet.match}</td>
                      <td className="px-6 py-4 text-[#444] text-xs">{bet.competition}</td>
                      <td className="px-6 py-4 text-[#666] text-xs font-mono">{bet.tip}</td>
                      <td className="px-6 py-4 text-center text-white font-bold">{bet.cote}</td>
                      <td className="px-6 py-4 text-center text-[#444] text-xs">{bet.mise}u</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded text-xs font-bold uppercase
                          ${bet.resultat==="win"?"bg-emerald-500/8 text-emerald-400 border border-emerald-500/15"
                          :bet.resultat==="loss"?"bg-[#FF5C00]/8 text-[#FF5C00] border border-[#FF5C00]/15"
                          :"bg-[#1F1F1F] text-[#444]"}`}>
                          {bet.resultat==="win"?"✓ Win":bet.resultat==="loss"?"✗ Loss":"Void"}
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
            <div className="md:hidden divide-y divide-[#0F0F0F]">
              {recentBets.map(bet => (
                <div key={bet.id} className="px-5 py-4 flex items-start justify-between gap-3">
                  <div><p className="text-white text-sm font-semibold">{bet.match}</p><p className="text-[#444] text-xs mt-0.5">{bet.tip} · @{bet.cote}</p></div>
                  <span className={`text-sm font-bold shrink-0 ${bet.gain>0?"text-emerald-400":"text-[#FF5C00]"}`}>{bet.gain>0?`+${bet.gain}u`:`${bet.gain}u`}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[#222] text-xs mt-4 text-center">Les performances passées ne garantissent pas les résultats futurs.</p>
        </div>
      </section>
    </>
  );
}
