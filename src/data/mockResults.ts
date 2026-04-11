// ─── Types ───────────────────────────────────────────────────────────────────
export interface Bet {
  id: number;
  date: string;
  match: string;
  competition: string;
  tip: string;
  cote: number;
  mise: number; // en unités
  resultat: "win" | "loss" | "void" | "pending";
  gain: number; // en unités
}

export interface MonthlyStats {
  month: string;
  wins: number;
  losses: number;
  voids: number;
  winRate: number;
  unitesGagnees: number;
  roi: number;
}

// ─── Pronostics récents ───────────────────────────────────────────────────────
export const recentBets: Bet[] = [
  {
    id: 1,
    date: "02/04/2025",
    match: "Arsenal vs Chelsea",
    competition: "Premier League",
    tip: "Arsenal -1 HC",
    cote: 1.92,
    mise: 2,
    resultat: "win",
    gain: 1.84,
  },
  {
    id: 2,
    date: "01/04/2025",
    match: "PSG vs Lyon",
    competition: "Ligue 1",
    tip: "Over 2.5 buts",
    cote: 1.78,
    mise: 2,
    resultat: "win",
    gain: 1.56,
  },
  {
    id: 3,
    date: "30/03/2025",
    match: "Real Madrid vs Atletico",
    competition: "La Liga",
    tip: "BTTS Oui",
    cote: 1.85,
    mise: 1,
    resultat: "loss",
    gain: -1,
  },
  {
    id: 4,
    date: "29/03/2025",
    match: "Bayern vs Dortmund",
    competition: "Bundesliga",
    tip: "Bayern ML",
    cote: 1.65,
    mise: 3,
    resultat: "win",
    gain: 1.95,
  },
  {
    id: 5,
    date: "28/03/2025",
    match: "Inter vs Juventus",
    competition: "Serie A",
    tip: "Under 2.5 buts",
    cote: 2.1,
    mise: 2,
    resultat: "win",
    gain: 2.2,
  },
  {
    id: 6,
    date: "26/03/2025",
    match: "Manchester City vs Liverpool",
    competition: "Premier League",
    tip: "Over 3.5 buts",
    cote: 2.4,
    mise: 1,
    resultat: "loss",
    gain: -1,
  },
  {
    id: 7,
    date: "25/03/2025",
    match: "Marseille vs Nice",
    competition: "Ligue 1",
    tip: "Marseille +0 HC",
    cote: 1.72,
    mise: 2,
    resultat: "win",
    gain: 1.44,
  },
  {
    id: 8,
    date: "23/03/2025",
    match: "Barcelona vs Valencia",
    competition: "La Liga",
    tip: "Barcelona ML",
    cote: 1.55,
    mise: 3,
    resultat: "win",
    gain: 1.65,
  },
];

// ─── Stats globales ───────────────────────────────────────────────────────────
export const globalStats = {
  totalPronostics: 247,
  winRate: 68.4,
  unitesGagnees: 94.7,
  roi: 11.2,
  moisSuivi: 14,
  serieWin: 7,
};

// ─── Stats mensuelles ─────────────────────────────────────────────────────────
export const monthlyStats: MonthlyStats[] = [
  {
    month: "Mars 2025",
    wins: 18,
    losses: 7,
    voids: 1,
    winRate: 72.0,
    unitesGagnees: 11.4,
    roi: 13.8,
  },
  {
    month: "Février 2025",
    wins: 15,
    losses: 8,
    voids: 0,
    winRate: 65.2,
    unitesGagnees: 7.2,
    roi: 9.1,
  },
  {
    month: "Janvier 2025",
    wins: 19,
    losses: 6,
    voids: 2,
    winRate: 76.0,
    unitesGagnees: 14.8,
    roi: 16.2,
  },
  {
    month: "Décembre 2024",
    wins: 14,
    losses: 9,
    voids: 0,
    winRate: 60.9,
    unitesGagnees: 5.1,
    roi: 7.3,
  },
  {
    month: "Novembre 2024",
    wins: 16,
    losses: 7,
    voids: 1,
    winRate: 69.6,
    unitesGagnees: 9.6,
    roi: 11.5,
  },
  {
    month: "Octobre 2024",
    wins: 17,
    losses: 6,
    voids: 0,
    winRate: 73.9,
    unitesGagnees: 12.3,
    roi: 14.7,
  },
];
