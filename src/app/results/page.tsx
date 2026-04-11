// app/results/page.tsx
import type { Metadata } from "next";
import SectionTitle from "@/components/ui/SectionTitle";
import StatCard from "@/components/ui/StatCard";
import { recentBets, globalStats, monthlyStats } from "@/data/mockResults";
import { TrendingUp, Target, Percent, Calendar, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Résultats & Stats",
  description: "Bilan complet et transparent de PrognoBeast : win rate, unités gagnées, ROI mensuel et historique des pronostics.",
};

export default function ResultsPage() {
  return (
    <>
      {/* Header */}
      <section className="relative pt-36 pb-16 bg-[#0A0A0A] border-b border-[#1a1a1a] overflow-hidden">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#C41E3A] opacity-[0.03] rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <span className="inline-block text-[#C9A84C] text-xs font-semibold tracking-[0.2em] uppercase border border-[#C9A84C]/30 px-3 py-1 rounded-sm mb-6">
            Bilan public
          </span>
          <h1
            className="font-display text-6xl md:text-8xl text-white uppercase leading-none tracking-wide mb-4"
            style={{ fontFamily: "var(--font-bebas, 'Bebas Neue', Impact, sans-serif)" }}
          >
            Résultats &{" "}
            <span className="text-gradient-red">Performance</span>
          </h1>
          <p className="text-[#666] text-lg max-w-xl leading-relaxed">
            Tous nos résultats sont publiés sans filtre. Win, loss, série difficile —
            la transparence est notre engagement le plus important.
          </p>
        </div>
      </section>

      {/* Global stats */}
      <section className="bg-[#0A0A0A] border-b border-[#1a1a1a]" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-[#444] text-xs font-bold tracking-widest uppercase mb-6">
            Statistiques globales — depuis le lancement
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatCard icon={TrendingUp} value={`+${globalStats.unitesGagnees}u`} label="Unités gagnées" accent="red" large />
            <StatCard icon={Target} value={`${globalStats.winRate}%`} label="Win Rate" sublabel={`${globalStats.totalPronostics} pronostics`} accent="gold" />
            <StatCard icon={Percent} value={`+${globalStats.roi}%`} label="ROI moyen" sublabel="Rendement global" accent="red" />
            <StatCard icon={Calendar} value={`${globalStats.moisSuivi}`} label="Mois de suivi" sublabel="Historique complet" accent="gold" />
            <StatCard icon={Award} value={`${globalStats.serieWin}`} label="Série en cours" sublabel="Wins consécutifs" accent="red" />
          </div>
        </div>
      </section>

      {/* Monthly breakdown */}
      <section className="bg-[#0c0c0c] border-b border-[#1a1a1a]" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionTitle label="Par mois" title="Bilan mensuel" accent="mensuel" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {monthlyStats.map((m) => (
              <div key={m.month} className="glass-card border border-[#1a1a1a] hover:border-[#C41E3A]/25 rounded-sm p-6 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-white font-bold text-sm">{m.month}</p>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-sm ${
                      m.unitesGagnees > 0
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-[#C41E3A]/10 text-[#C41E3A] border border-[#C41E3A]/20"
                    }`}
                  >
                    {m.unitesGagnees > 0 ? `+${m.unitesGagnees}u` : `${m.unitesGagnees}u`}
                  </span>
                </div>

                {/* Win/Loss bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-[#555] mb-1.5">
                    <span>{m.wins}W / {m.losses}L{m.voids > 0 ? ` / ${m.voids}V` : ""}</span>
                    <span className="text-white font-semibold">{m.winRate}% WR</span>
                  </div>
                  <div className="h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#C41E3A] to-emerald-400 rounded-full"
                      style={{ width: `${m.winRate}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-xs text-[#555] pt-3 border-t border-[#1a1a1a]">
                  <span>ROI mensuel</span>
                  <span className={m.roi > 0 ? "text-emerald-400 font-semibold" : "text-[#C41E3A] font-semibold"}>
                    {m.roi > 0 ? `+${m.roi}%` : `${m.roi}%`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full bets table */}
      <section className="bg-[#0A0A0A]" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionTitle label="Historique" title="Derniers pronostics" accent="pronostics" />

          <div className="glass-card border border-[#1a1a1a] rounded-sm overflow-hidden mt-8">
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1a1a1a] text-[#444] text-xs font-bold tracking-widest uppercase">
                    <th className="text-left px-6 py-4">Date</th>
                    <th className="text-left px-6 py-4">Match</th>
                    <th className="text-left px-6 py-4">Compétition</th>
                    <th className="text-left px-6 py-4">Tip</th>
                    <th className="text-center px-6 py-4">Cote</th>
                    <th className="text-center px-6 py-4">Mise</th>
                    <th className="text-center px-6 py-4">Résultat</th>
                    <th className="text-right px-6 py-4">+/- Unités</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBets.map((bet, i) => (
                    <tr
                      key={bet.id}
                      className={`border-b border-[#111] hover:bg-[#111] transition-colors ${
                        i === recentBets.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      <td className="px-6 py-4 text-[#444] text-xs font-mono">{bet.date}</td>
                      <td className="px-6 py-4 text-white font-medium">{bet.match}</td>
                      <td className="px-6 py-4 text-[#555] text-xs">{bet.competition}</td>
                      <td className="px-6 py-4 text-[#888] text-xs font-mono">{bet.tip}</td>
                      <td className="px-6 py-4 text-center text-white font-semibold">{bet.cote}</td>
                      <td className="px-6 py-4 text-center text-[#666] text-xs">{bet.mise}u</td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-sm text-xs font-bold tracking-wider uppercase
                            ${bet.resultat === "win"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : bet.resultat === "loss"
                              ? "bg-[#C41E3A]/10 text-[#C41E3A] border border-[#C41E3A]/20"
                              : "bg-[#333]/40 text-[#666] border border-[#333]"
                            }`}
                        >
                          {bet.resultat === "win" ? "✓ Win" : bet.resultat === "loss" ? "✗ Loss" : "Void"}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-right font-bold ${bet.gain > 0 ? "text-emerald-400" : "text-[#C41E3A]"}`}>
                        {bet.gain > 0 ? `+${bet.gain}u` : `${bet.gain}u`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden divide-y divide-[#111]">
              {recentBets.map((bet) => (
                <div key={bet.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-white text-sm font-medium">{bet.match}</p>
                    <span
                      className={`shrink-0 text-xs font-bold ${bet.gain > 0 ? "text-emerald-400" : "text-[#C41E3A]"}`}
                    >
                      {bet.gain > 0 ? `+${bet.gain}u` : `${bet.gain}u`}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#555]">
                    <span>{bet.date}</span>
                    <span>·</span>
                    <span className="font-mono">{bet.tip}</span>
                    <span>·</span>
                    <span>@{bet.cote}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[#333] text-xs mt-4 text-center">
            Résultats affichés à titre informatif. Les performances passées ne garantissent pas les résultats futurs.
          </p>
        </div>
      </section>
    </>
  );
}
