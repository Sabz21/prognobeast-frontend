"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const STORAGE_KEY = "pb_cdm2026_bets";

type GroupId = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L";

interface Match {
  id: string;
  home: string;
  homeFl: string;
  away: string;
  awayFl: string;
  date: string;
  time: string;
  city: string;
  group?: GroupId;
  round?: string;
}

const GROUPS: Record<GroupId, { teams: { name: string; flag: string }[] }> = {
  A: { teams: [{ name: "USA", flag: "🇺🇸" }, { name: "Panama", flag: "🇵🇦" }, { name: "Bolivie", flag: "🇧🇴" }, { name: "Bénin", flag: "🇧🇯" }] },
  B: { teams: [{ name: "Canada", flag: "🇨🇦" }, { name: "Australie", flag: "🇦🇺" }, { name: "Pérou", flag: "🇵🇪" }, { name: "Trinidad & Tobago", flag: "🇹🇹" }] },
  C: { teams: [{ name: "Mexique", flag: "🇲🇽" }, { name: "Jamaïque", flag: "🇯🇲" }, { name: "Nouvelle-Zélande", flag: "🇳🇿" }, { name: "Ouzbékistan", flag: "🇺🇿" }] },
  D: { teams: [{ name: "France", flag: "🇫🇷" }, { name: "Maroc", flag: "🇲🇦" }, { name: "Algérie", flag: "🇩🇿" }, { name: "Honduras", flag: "🇭🇳" }] },
  E: { teams: [{ name: "Espagne", flag: "🇪🇸" }, { name: "Colombie", flag: "🇨🇴" }, { name: "Serbie", flag: "🇷🇸" }, { name: "Cameroun", flag: "🇨🇲" }] },
  F: { teams: [{ name: "Brésil", flag: "🇧🇷" }, { name: "Paraguay", flag: "🇵🇾" }, { name: "Japon", flag: "🇯🇵" }, { name: "Côte d'Ivoire", flag: "🇨🇮" }] },
  G: { teams: [{ name: "Argentine", flag: "🇦🇷" }, { name: "Uruguay", flag: "🇺🇾" }, { name: "Croatie", flag: "🇭🇷" }, { name: "Nigeria", flag: "🇳🇬" }] },
  H: { teams: [{ name: "Angleterre", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" }, { name: "Suisse", flag: "🇨🇭" }, { name: "Sénégal", flag: "🇸🇳" }, { name: "Corée du Sud", flag: "🇰🇷" }] },
  I: { teams: [{ name: "Portugal", flag: "🇵🇹" }, { name: "Danemark", flag: "🇩🇰" }, { name: "Arabie Saoudite", flag: "🇸🇦" }, { name: "Ghana", flag: "🇬🇭" }] },
  J: { teams: [{ name: "Belgique", flag: "🇧🇪" }, { name: "Turquie", flag: "🇹🇷" }, { name: "Équateur", flag: "🇪🇨" }, { name: "Tunisie", flag: "🇹🇳" }] },
  K: { teams: [{ name: "Pays-Bas", flag: "🇳🇱" }, { name: "Venezuela", flag: "🇻🇪" }, { name: "Iran", flag: "🇮🇷" }, { name: "Pologne", flag: "🇵🇱" }] },
  L: { teams: [{ name: "Allemagne", flag: "🇩🇪" }, { name: "Chili", flag: "🇨🇱" }, { name: "Guatemala", flag: "🇬🇹" }, { name: "Irak", flag: "🇮🇶" }] },
};

const GROUP_MATCHES: Match[] = [
  // Groupe A
  { id: "A1", group: "A", home: "USA", homeFl: "🇺🇸", away: "Panama", awayFl: "🇵🇦", date: "11 Juin 2026", time: "21:00", city: "Los Angeles" },
  { id: "A2", group: "A", home: "Bolivie", homeFl: "🇧🇴", away: "Bénin", awayFl: "🇧🇯", date: "12 Juin 2026", time: "18:00", city: "Dallas" },
  { id: "A3", group: "A", home: "USA", homeFl: "🇺🇸", away: "Bolivie", awayFl: "🇧🇴", date: "16 Juin 2026", time: "21:00", city: "Los Angeles" },
  { id: "A4", group: "A", home: "Panama", homeFl: "🇵🇦", away: "Bénin", awayFl: "🇧🇯", date: "16 Juin 2026", time: "18:00", city: "Dallas" },
  { id: "A5", group: "A", home: "USA", homeFl: "🇺🇸", away: "Bénin", awayFl: "🇧🇯", date: "20 Juin 2026", time: "21:00", city: "New York" },
  { id: "A6", group: "A", home: "Panama", homeFl: "🇵🇦", away: "Bolivie", awayFl: "🇧🇴", date: "20 Juin 2026", time: "21:00", city: "Seattle" },
  // Groupe B
  { id: "B1", group: "B", home: "Canada", homeFl: "🇨🇦", away: "Australie", awayFl: "🇦🇺", date: "12 Juin 2026", time: "21:00", city: "Toronto" },
  { id: "B2", group: "B", home: "Pérou", homeFl: "🇵🇪", away: "Trinidad & Tobago", awayFl: "🇹🇹", date: "12 Juin 2026", time: "21:00", city: "Kansas City" },
  { id: "B3", group: "B", home: "Canada", homeFl: "🇨🇦", away: "Pérou", awayFl: "🇵🇪", date: "17 Juin 2026", time: "18:00", city: "Vancouver" },
  { id: "B4", group: "B", home: "Australie", homeFl: "🇦🇺", away: "Trinidad & Tobago", awayFl: "🇹🇹", date: "17 Juin 2026", time: "21:00", city: "New York" },
  { id: "B5", group: "B", home: "Canada", homeFl: "🇨🇦", away: "Trinidad & Tobago", awayFl: "🇹🇹", date: "21 Juin 2026", time: "21:00", city: "Toronto" },
  { id: "B6", group: "B", home: "Australie", homeFl: "🇦🇺", away: "Pérou", awayFl: "🇵🇪", date: "21 Juin 2026", time: "21:00", city: "Dallas" },
  // Groupe C
  { id: "C1", group: "C", home: "Mexique", homeFl: "🇲🇽", away: "Jamaïque", awayFl: "🇯🇲", date: "13 Juin 2026", time: "21:00", city: "Guadalajara" },
  { id: "C2", group: "C", home: "Nouvelle-Zélande", homeFl: "🇳🇿", away: "Ouzbékistan", awayFl: "🇺🇿", date: "13 Juin 2026", time: "18:00", city: "San Francisco" },
  { id: "C3", group: "C", home: "Mexique", homeFl: "🇲🇽", away: "Nouvelle-Zélande", awayFl: "🇳🇿", date: "17 Juin 2026", time: "21:00", city: "Mexico City" },
  { id: "C4", group: "C", home: "Jamaïque", homeFl: "🇯🇲", away: "Ouzbékistan", awayFl: "🇺🇿", date: "17 Juin 2026", time: "18:00", city: "Houston" },
  { id: "C5", group: "C", home: "Mexique", homeFl: "🇲🇽", away: "Ouzbékistan", awayFl: "🇺🇿", date: "21 Juin 2026", time: "21:00", city: "Monterrey" },
  { id: "C6", group: "C", home: "Jamaïque", homeFl: "🇯🇲", away: "Nouvelle-Zélande", awayFl: "🇳🇿", date: "21 Juin 2026", time: "21:00", city: "Miami" },
  // Groupe D
  { id: "D1", group: "D", home: "France", homeFl: "🇫🇷", away: "Maroc", awayFl: "🇲🇦", date: "14 Juin 2026", time: "21:00", city: "New York" },
  { id: "D2", group: "D", home: "Algérie", homeFl: "🇩🇿", away: "Honduras", awayFl: "🇭🇳", date: "14 Juin 2026", time: "18:00", city: "Miami" },
  { id: "D3", group: "D", home: "France", homeFl: "🇫🇷", away: "Algérie", awayFl: "🇩🇿", date: "18 Juin 2026", time: "21:00", city: "Boston" },
  { id: "D4", group: "D", home: "Maroc", homeFl: "🇲🇦", away: "Honduras", awayFl: "🇭🇳", date: "18 Juin 2026", time: "18:00", city: "Atlanta" },
  { id: "D5", group: "D", home: "France", homeFl: "🇫🇷", away: "Honduras", awayFl: "🇭🇳", date: "22 Juin 2026", time: "21:00", city: "Los Angeles" },
  { id: "D6", group: "D", home: "Maroc", homeFl: "🇲🇦", away: "Algérie", awayFl: "🇩🇿", date: "22 Juin 2026", time: "21:00", city: "Philadelphia" },
  // Groupe E
  { id: "E1", group: "E", home: "Espagne", homeFl: "🇪🇸", away: "Colombie", awayFl: "🇨🇴", date: "14 Juin 2026", time: "21:00", city: "Dallas" },
  { id: "E2", group: "E", home: "Serbie", homeFl: "🇷🇸", away: "Cameroun", awayFl: "🇨🇲", date: "14 Juin 2026", time: "18:00", city: "Chicago" },
  { id: "E3", group: "E", home: "Espagne", homeFl: "🇪🇸", away: "Serbie", awayFl: "🇷🇸", date: "18 Juin 2026", time: "21:00", city: "Miami" },
  { id: "E4", group: "E", home: "Colombie", homeFl: "🇨🇴", away: "Cameroun", awayFl: "🇨🇲", date: "18 Juin 2026", time: "18:00", city: "Seattle" },
  { id: "E5", group: "E", home: "Espagne", homeFl: "🇪🇸", away: "Cameroun", awayFl: "🇨🇲", date: "22 Juin 2026", time: "21:00", city: "New York" },
  { id: "E6", group: "E", home: "Colombie", homeFl: "🇨🇴", away: "Serbie", awayFl: "🇷🇸", date: "22 Juin 2026", time: "21:00", city: "San Francisco" },
  // Groupe F
  { id: "F1", group: "F", home: "Brésil", homeFl: "🇧🇷", away: "Paraguay", awayFl: "🇵🇾", date: "15 Juin 2026", time: "21:00", city: "Los Angeles" },
  { id: "F2", group: "F", home: "Japon", homeFl: "🇯🇵", away: "Côte d'Ivoire", awayFl: "🇨🇮", date: "15 Juin 2026", time: "18:00", city: "San Francisco" },
  { id: "F3", group: "F", home: "Brésil", homeFl: "🇧🇷", away: "Japon", awayFl: "🇯🇵", date: "19 Juin 2026", time: "21:00", city: "Los Angeles" },
  { id: "F4", group: "F", home: "Paraguay", homeFl: "🇵🇾", away: "Côte d'Ivoire", awayFl: "🇨🇮", date: "19 Juin 2026", time: "18:00", city: "Dallas" },
  { id: "F5", group: "F", home: "Brésil", homeFl: "🇧🇷", away: "Côte d'Ivoire", awayFl: "🇨🇮", date: "23 Juin 2026", time: "21:00", city: "Miami" },
  { id: "F6", group: "F", home: "Paraguay", homeFl: "🇵🇾", away: "Japon", awayFl: "🇯🇵", date: "23 Juin 2026", time: "21:00", city: "Houston" },
  // Groupe G
  { id: "G1", group: "G", home: "Argentine", homeFl: "🇦🇷", away: "Uruguay", awayFl: "🇺🇾", date: "15 Juin 2026", time: "21:00", city: "New York" },
  { id: "G2", group: "G", home: "Croatie", homeFl: "🇭🇷", away: "Nigeria", awayFl: "🇳🇬", date: "15 Juin 2026", time: "18:00", city: "Atlanta" },
  { id: "G3", group: "G", home: "Argentine", homeFl: "🇦🇷", away: "Croatie", awayFl: "🇭🇷", date: "19 Juin 2026", time: "21:00", city: "Dallas" },
  { id: "G4", group: "G", home: "Uruguay", homeFl: "🇺🇾", away: "Nigeria", awayFl: "🇳🇬", date: "19 Juin 2026", time: "18:00", city: "Kansas City" },
  { id: "G5", group: "G", home: "Argentine", homeFl: "🇦🇷", away: "Nigeria", awayFl: "🇳🇬", date: "23 Juin 2026", time: "21:00", city: "Los Angeles" },
  { id: "G6", group: "G", home: "Uruguay", homeFl: "🇺🇾", away: "Croatie", awayFl: "🇭🇷", date: "23 Juin 2026", time: "21:00", city: "San Francisco" },
  // Groupe H
  { id: "H1", group: "H", home: "Angleterre", homeFl: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", away: "Suisse", awayFl: "🇨🇭", date: "16 Juin 2026", time: "21:00", city: "Miami" },
  { id: "H2", group: "H", home: "Sénégal", homeFl: "🇸🇳", away: "Corée du Sud", awayFl: "🇰🇷", date: "16 Juin 2026", time: "18:00", city: "Los Angeles" },
  { id: "H3", group: "H", home: "Angleterre", homeFl: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", away: "Sénégal", awayFl: "🇸🇳", date: "20 Juin 2026", time: "21:00", city: "New York" },
  { id: "H4", group: "H", home: "Suisse", homeFl: "🇨🇭", away: "Corée du Sud", awayFl: "🇰🇷", date: "20 Juin 2026", time: "18:00", city: "Dallas" },
  { id: "H5", group: "H", home: "Angleterre", homeFl: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", away: "Corée du Sud", awayFl: "🇰🇷", date: "24 Juin 2026", time: "21:00", city: "Atlanta" },
  { id: "H6", group: "H", home: "Suisse", homeFl: "🇨🇭", away: "Sénégal", awayFl: "🇸🇳", date: "24 Juin 2026", time: "21:00", city: "Houston" },
  // Groupe I
  { id: "I1", group: "I", home: "Portugal", homeFl: "🇵🇹", away: "Danemark", awayFl: "🇩🇰", date: "16 Juin 2026", time: "21:00", city: "Boston" },
  { id: "I2", group: "I", home: "Arabie Saoudite", homeFl: "🇸🇦", away: "Ghana", awayFl: "🇬🇭", date: "16 Juin 2026", time: "18:00", city: "San Francisco" },
  { id: "I3", group: "I", home: "Portugal", homeFl: "🇵🇹", away: "Arabie Saoudite", awayFl: "🇸🇦", date: "20 Juin 2026", time: "21:00", city: "Philadelphia" },
  { id: "I4", group: "I", home: "Danemark", homeFl: "🇩🇰", away: "Ghana", awayFl: "🇬🇭", date: "20 Juin 2026", time: "18:00", city: "Chicago" },
  { id: "I5", group: "I", home: "Portugal", homeFl: "🇵🇹", away: "Ghana", awayFl: "🇬🇭", date: "24 Juin 2026", time: "21:00", city: "New York" },
  { id: "I6", group: "I", home: "Danemark", homeFl: "🇩🇰", away: "Arabie Saoudite", awayFl: "🇸🇦", date: "24 Juin 2026", time: "21:00", city: "Seattle" },
  // Groupe J
  { id: "J1", group: "J", home: "Belgique", homeFl: "🇧🇪", away: "Turquie", awayFl: "🇹🇷", date: "17 Juin 2026", time: "21:00", city: "Los Angeles" },
  { id: "J2", group: "J", home: "Équateur", homeFl: "🇪🇨", away: "Tunisie", awayFl: "🇹🇳", date: "17 Juin 2026", time: "18:00", city: "Atlanta" },
  { id: "J3", group: "J", home: "Belgique", homeFl: "🇧🇪", away: "Équateur", awayFl: "🇪🇨", date: "21 Juin 2026", time: "21:00", city: "Miami" },
  { id: "J4", group: "J", home: "Turquie", homeFl: "🇹🇷", away: "Tunisie", awayFl: "🇹🇳", date: "21 Juin 2026", time: "18:00", city: "Dallas" },
  { id: "J5", group: "J", home: "Belgique", homeFl: "🇧🇪", away: "Tunisie", awayFl: "🇹🇳", date: "25 Juin 2026", time: "21:00", city: "San Francisco" },
  { id: "J6", group: "J", home: "Turquie", homeFl: "🇹🇷", away: "Équateur", awayFl: "🇪🇨", date: "25 Juin 2026", time: "21:00", city: "Kansas City" },
  // Groupe K
  { id: "K1", group: "K", home: "Pays-Bas", homeFl: "🇳🇱", away: "Venezuela", awayFl: "🇻🇪", date: "18 Juin 2026", time: "21:00", city: "Houston" },
  { id: "K2", group: "K", home: "Iran", homeFl: "🇮🇷", away: "Pologne", awayFl: "🇵🇱", date: "18 Juin 2026", time: "18:00", city: "New York" },
  { id: "K3", group: "K", home: "Pays-Bas", homeFl: "🇳🇱", away: "Iran", awayFl: "🇮🇷", date: "22 Juin 2026", time: "21:00", city: "Boston" },
  { id: "K4", group: "K", home: "Venezuela", homeFl: "🇻🇪", away: "Pologne", awayFl: "🇵🇱", date: "22 Juin 2026", time: "18:00", city: "Chicago" },
  { id: "K5", group: "K", home: "Pays-Bas", homeFl: "🇳🇱", away: "Pologne", awayFl: "🇵🇱", date: "26 Juin 2026", time: "21:00", city: "Los Angeles" },
  { id: "K6", group: "K", home: "Venezuela", homeFl: "🇻🇪", away: "Iran", awayFl: "🇮🇷", date: "26 Juin 2026", time: "21:00", city: "Miami" },
  // Groupe L
  { id: "L1", group: "L", home: "Allemagne", homeFl: "🇩🇪", away: "Chili", awayFl: "🇨🇱", date: "19 Juin 2026", time: "21:00", city: "Philadelphia" },
  { id: "L2", group: "L", home: "Guatemala", homeFl: "🇬🇹", away: "Irak", awayFl: "🇮🇶", date: "19 Juin 2026", time: "18:00", city: "Vancouver" },
  { id: "L3", group: "L", home: "Allemagne", homeFl: "🇩🇪", away: "Guatemala", awayFl: "🇬🇹", date: "23 Juin 2026", time: "21:00", city: "Chicago" },
  { id: "L4", group: "L", home: "Chili", homeFl: "🇨🇱", away: "Irak", awayFl: "🇮🇶", date: "23 Juin 2026", time: "18:00", city: "Atlanta" },
  { id: "L5", group: "L", home: "Allemagne", homeFl: "🇩🇪", away: "Irak", awayFl: "🇮🇶", date: "27 Juin 2026", time: "21:00", city: "New York" },
  { id: "L6", group: "L", home: "Chili", homeFl: "🇨🇱", away: "Guatemala", awayFl: "🇬🇹", date: "27 Juin 2026", time: "21:00", city: "Kansas City" },
];

const KNOCKOUT_ROUNDS = [
  { id: "KO", label: "Phase finale", rounds: [
    { label: "Huitièmes de finale", matches: Array.from({ length: 16 }, (_, i) => ({ id: `R32_${i + 1}`, label: `Match ${i + 1}`, date: "Fin Juin / Début Juillet 2026" })) },
    { label: "Quarts de finale", matches: Array.from({ length: 8 }, (_, i) => ({ id: `QF_${i + 1}`, label: `Match ${i + 1}`, date: "4–5 Juillet 2026" })) },
    { label: "Demi-finales", matches: Array.from({ length: 4 }, (_, i) => ({ id: `SF_${i + 1}`, label: `Match ${i + 1}`, date: "14–15 Juillet 2026" })) },
    { label: "Finale", matches: [{ id: "FINAL", label: "Finale", date: "19 Juillet 2026 · MetLife Stadium, New York" }] },
  ]},
];

const GROUP_IDS = Object.keys(GROUPS) as GroupId[];
type Tab = GroupId | "KO";

function MatchCard({ match, bet, isAdmin, onSave }: {
  match: Match;
  bet: string;
  isAdmin: boolean;
  onSave: (id: string, text: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(bet);

  function save() {
    onSave(match.id, draft);
    setEditing(false);
  }

  return (
    <div style={{
      background: "white",
      border: "1px solid #E5E7EB",
      borderRadius: "12px",
      padding: "1rem 1.25rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.6rem",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      transition: "box-shadow 0.15s",
    }}>
      {/* Teams */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, fontSize: "15px" }}>
          <span style={{ fontSize: "22px" }}>{match.homeFl}</span>
          <span style={{ color: "#111827" }}>{match.home}</span>
        </div>
        <span style={{ color: "#9CA3AF", fontWeight: 700, fontSize: "13px" }}>VS</span>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, fontSize: "15px" }}>
          <span style={{ color: "#111827" }}>{match.away}</span>
          <span style={{ fontSize: "22px" }}>{match.awayFl}</span>
        </div>
      </div>

      {/* Date / city */}
      <div style={{ fontSize: "12px", color: "#6B7280", display: "flex", gap: "10px" }}>
        <span>📅 {match.date}</span>
        <span>🕐 {match.time}</span>
        <span>📍 {match.city}</span>
      </div>

      {/* Bet */}
      {editing ? (
        <div style={{ display: "flex", gap: "8px", marginTop: "2px" }}>
          <input
            autoFocus
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") save(); if (e.key === "Escape") setEditing(false); }}
            placeholder="Ex: France gagne, +1.5 buts…"
            style={{
              flex: 1, padding: "7px 10px", borderRadius: "8px",
              border: "1.5px solid #2563EB", fontSize: "13px",
              outline: "none", fontFamily: "inherit",
            }}
          />
          <button onClick={save} style={{
            background: "#2563EB", color: "white", border: "none",
            borderRadius: "8px", padding: "7px 14px", fontSize: "13px",
            fontWeight: 600, cursor: "pointer",
          }}>OK</button>
          <button onClick={() => setEditing(false)} style={{
            background: "#F3F4F6", color: "#6B7280", border: "none",
            borderRadius: "8px", padding: "7px 10px", fontSize: "13px",
            cursor: "pointer",
          }}>✕</button>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {bet ? (
            <div style={{
              flex: 1, background: "#EFF6FF", border: "1px solid #DBEAFE",
              borderRadius: "8px", padding: "7px 12px",
              fontSize: "13px", fontWeight: 600, color: "#1D4ED8",
            }}>
              ⚡ {bet}
            </div>
          ) : (
            <div style={{
              flex: 1, background: "#F9FAFB", border: "1px solid #E5E7EB",
              borderRadius: "8px", padding: "7px 12px",
              fontSize: "13px", color: "#9CA3AF",
            }}>
              🔒 Pari à venir
            </div>
          )}
          {isAdmin && (
            <button onClick={() => { setDraft(bet); setEditing(true); }} style={{
              background: "none", border: "1px solid #E5E7EB",
              borderRadius: "8px", padding: "5px 10px", fontSize: "12px",
              color: "#6B7280", cursor: "pointer", whiteSpace: "nowrap",
            }}>
              ✏️ {bet ? "Modifier" : "Ajouter"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function KnockoutCard({ id, label, date, bet, isAdmin, onSave }: {
  id: string; label: string; date: string; bet: string;
  isAdmin: boolean; onSave: (id: string, text: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(bet);

  function save() { onSave(id, draft); setEditing(false); }

  return (
    <div style={{
      background: "white", border: "1px solid #E5E7EB", borderRadius: "12px",
      padding: "0.9rem 1.1rem", display: "flex", flexDirection: "column", gap: "0.5rem",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    }}>
      <div style={{ fontWeight: 700, fontSize: "14px", color: "#111827" }}>{label}</div>
      <div style={{ fontSize: "12px", color: "#9CA3AF" }}>📅 {date}</div>
      {editing ? (
        <div style={{ display: "flex", gap: "8px" }}>
          <input autoFocus value={draft} onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") save(); if (e.key === "Escape") setEditing(false); }}
            placeholder="Ton pari…"
            style={{ flex: 1, padding: "6px 10px", borderRadius: "8px", border: "1.5px solid #2563EB", fontSize: "13px", outline: "none", fontFamily: "inherit" }} />
          <button onClick={save} style={{ background: "#2563EB", color: "white", border: "none", borderRadius: "8px", padding: "6px 12px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>OK</button>
          <button onClick={() => setEditing(false)} style={{ background: "#F3F4F6", color: "#6B7280", border: "none", borderRadius: "8px", padding: "6px 10px", fontSize: "13px", cursor: "pointer" }}>✕</button>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {bet ? (
            <div style={{ flex: 1, background: "#EFF6FF", border: "1px solid #DBEAFE", borderRadius: "8px", padding: "6px 12px", fontSize: "13px", fontWeight: 600, color: "#1D4ED8" }}>⚡ {bet}</div>
          ) : (
            <div style={{ flex: 1, background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "8px", padding: "6px 12px", fontSize: "13px", color: "#9CA3AF" }}>🔒 À confirmer</div>
          )}
          {isAdmin && (
            <button onClick={() => { setDraft(bet); setEditing(true); }} style={{ background: "none", border: "1px solid #E5E7EB", borderRadius: "8px", padding: "4px 10px", fontSize: "12px", color: "#6B7280", cursor: "pointer" }}>
              ✏️ {bet ? "Modifier" : "Ajouter"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function CDM2026Page() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [activeTab, setActiveTab] = useState<Tab>("A");
  const [bets, setBets] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setBets(JSON.parse(raw));
    } catch { /* */ }
  }, []);

  function saveBet(id: string, text: string) {
    const updated = { ...bets, [id]: text };
    setBets(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  const groupMatches = activeTab !== "KO"
    ? GROUP_MATCHES.filter(m => m.group === activeTab)
    : [];

  const tabs: { id: Tab; label: string }[] = [
    ...GROUP_IDS.map(g => ({ id: g as Tab, label: `Groupe ${g}` })),
    { id: "KO", label: "Phase finale" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB" }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1D4ED8 0%, #2563EB 60%, #3B82F6 100%)",
        padding: "3rem 1.5rem 2.5rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "-60px", right: "10%", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "13px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
          ⚽ Coupe du Monde 2026
        </p>
        <h1 style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: "clamp(2.5rem, 7vw, 5rem)",
          color: "white", letterSpacing: "0.04em",
          lineHeight: 1, marginBottom: "0.75rem",
        }}>
          CDM 2026
        </h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "15px" }}>
          11 Juin – 19 Juillet 2026 · USA, Canada & Mexique
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "1.25rem", flexWrap: "wrap" }}>
          {["🇺🇸 USA", "🇨🇦 Canada", "🇲🇽 Mexique"].map(h => (
            <span key={h} style={{
              background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)",
              color: "white", fontSize: "13px", fontWeight: 500,
              padding: "4px 14px", borderRadius: "999px",
            }}>{h}</span>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1rem 4rem" }}>

        {/* Tabs */}
        <div style={{ overflowX: "auto", marginBottom: "2rem", paddingBottom: "4px" }}>
          <div style={{ display: "flex", gap: "6px", minWidth: "max-content" }}>
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 600,
                border: "none", cursor: "pointer", whiteSpace: "nowrap",
                background: activeTab === tab.id ? "#2563EB" : "white",
                color: activeTab === tab.id ? "white" : "#6B7280",
                boxShadow: activeTab === tab.id ? "0 2px 8px rgba(37,99,235,0.3)" : "0 1px 3px rgba(0,0,0,0.08)",
                transition: "all 0.15s",
              }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Group tab content */}
        {activeTab !== "KO" && (
          <div>
            {/* Group teams */}
            <div style={{
              background: "white", border: "1px solid #E5E7EB", borderRadius: "14px",
              padding: "1.25rem 1.5rem", marginBottom: "1.5rem",
              display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap",
            }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Groupe {activeTab}
              </span>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {GROUPS[activeTab].teams.map(t => (
                  <span key={t.name} style={{
                    display: "inline-flex", alignItems: "center", gap: "5px",
                    background: "#F3F4F6", borderRadius: "8px",
                    padding: "5px 12px", fontSize: "14px", fontWeight: 600,
                  }}>
                    <span style={{ fontSize: "18px" }}>{t.flag}</span> {t.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Matches grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "12px" }}>
              {groupMatches.map(m => (
                <MatchCard key={m.id} match={m} bet={bets[m.id] || ""} isAdmin={isAdmin} onSave={saveBet} />
              ))}
            </div>
          </div>
        )}

        {/* Knockout tab content */}
        {activeTab === "KO" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {KNOCKOUT_ROUNDS[0].rounds.map(round => (
              <div key={round.label}>
                <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#111827", marginBottom: "1rem" }}>
                  {round.label}
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "10px" }}>
                  {round.matches.map(m => (
                    <KnockoutCard key={m.id} id={m.id} label={m.label} date={m.date} bet={bets[m.id] || ""} isAdmin={isAdmin} onSave={saveBet} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
