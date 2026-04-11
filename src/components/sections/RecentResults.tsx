// components/sections/RecentResults.tsx
import Link from "next/link";
import SectionTitle from "@/components/ui/SectionTitle";
import StatCard from "@/components/ui/StatCard";
import { recentBets, globalStats } from "@/data/mockResults";
import { TrendingUp, Target, Percent, Calendar } from "lucide-react";

export default function RecentResults() {
  return (
    <section
      className="bg-[#0A0A0A]"
      style={{ paddingTop: "6rem", paddingBottom: "6rem" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionTitle
            label="Performances"
            title="Les chiffres"
            accent="chiffres"
            subtitle="Tous nos résultats sont publics et vérifiables. Voici un aperçu de notre bilan."
          />
          <Link
            href="/results"
            className="shrink-0 text-xs font-bold tracking-widest uppercase text-[#C41E3A] hover:text-[#E8274A] transition-colors flex items-center gap-2"
          >
            Voir tout le bilan →
          </Link>
        </div>

        {/* Global stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <StatCard
            icon={TrendingUp}
            value={`+${globalStats.unitesGagnees}u`}
            label="Unités gagnées"
            sublabel={`Sur ${globalStats.moisSuivi} mois de suivi`}
            accent="red"
          />
          <StatCard
            icon={Target}
            value={`${globalStats.winRate}%`}
            label="Win Rate"
            sublabel={`Sur ${globalStats.totalPronostics} pronostics`}
            accent="gold"
          />
          <StatCard
            icon={Percent}
            value={`+${globalStats.roi}%`}
            label="ROI moyen"
            sublabel="Rendement sur investissement"
            accent="red"
          />
          <StatCard
            icon={Calendar}
            value={`${globalStats.serieWin}`}
            label="Série en cours"
            sublabel="Wins consécutifs"
            accent="gold"
          />
        </div>

        {/* Recent bets table */}
        <div className="glass-card border border-[#1a1a1a] rounded-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1a1a1a] flex items-center justify-between">
            <h3 className="text-white font-bold text-sm tracking-wide">
              Derniers pronostics publiés
            </h3>
            <span className="text-[#555] text-xs">8 derniers tips</span>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1a1a1a] text-[#444] text-xs font-semibold tracking-widest uppercase">
                  <th className="text-left px-6 py-4">Date</th>
                  <th className="text-left px-6 py-4">Match</th>
                  <th className="text-left px-6 py-4">Tip</th>
                  <th className="text-center px-6 py-4">Cote</th>
                  <th className="text-center px-6 py-4">Mise</th>
                  <th className="text-center px-6 py-4">Résultat</th>
                  <th className="text-right px-6 py-4">Gain</th>
                </tr>
              </thead>
              <tbody>
                {recentBets.map((bet, i) => (
                  <tr
                    key={bet.id}
                    className={`border-b border-[#111] transition-colors hover:bg-[#111] ${
                      i === recentBets.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    <td className="px-6 py-4 text-[#555] text-xs">{bet.date}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{bet.match}</p>
                        <p className="text-[#444] text-xs mt-0.5">{bet.competition}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#888] text-xs font-mono">{bet.tip}</td>
                    <td className="px-6 py-4 text-center text-white font-semibold">
                      {bet.cote}
                    </td>
                    <td className="px-6 py-4 text-center text-[#888] text-xs">
                      {bet.mise}u
                    </td>
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
                    <td className={`px-6 py-4 text-right font-bold text-sm ${
                      bet.gain > 0 ? "text-emerald-400" : "text-[#C41E3A]"
                    }`}>
                      {bet.gain > 0 ? `+${bet.gain}u` : `${bet.gain}u`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-[#111]">
            {recentBets.slice(0, 5).map((bet) => (
              <div key={bet.id} className="px-5 py-4 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{bet.match}</p>
                  <p className="text-[#555] text-xs mt-0.5">{bet.tip} — @{bet.cote}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-xs font-bold ${
                      bet.gain > 0 ? "text-emerald-400" : "text-[#C41E3A]"
                    }`}
                  >
                    {bet.gain > 0 ? `+${bet.gain}u` : `${bet.gain}u`}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      bet.resultat === "win" ? "bg-emerald-400" : "bg-[#C41E3A]"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
