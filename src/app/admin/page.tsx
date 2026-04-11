"use client";
import { useState, useEffect, useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users,
  TrendingUp,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  LogOut,
  Zap,
  ShieldCheck,
  Trophy,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

interface AdminBet {
  id: string;
  sport: string;
  description: string;
  odds: number;
  unit: number;
  status: "PENDING" | "WON" | "LOST";
  createdAt: string;
  totalUsers: number;
  followers: number;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "APPROVED")
    return (
      <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
        <CheckCircle2 size={11} />
        Approuvé
      </span>
    );
  if (status === "REJECTED")
    return (
      <span className="flex items-center gap-1 text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded">
        <XCircle size={11} />
        Refusé
      </span>
    );
  return (
    <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
      <Clock size={11} />
      En attente
    </span>
  );
}

export default function AdminPage() {
  const { user, token, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"users" | "bets">("users");

  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  // Bets state
  const [bets, setBets] = useState<AdminBet[]>([]);
  const [betsLoading, setBetsLoading] = useState(true);
  const [betForm, setBetForm] = useState({ sport: "", description: "", odds: "", unit: "1" });
  const [betError, setBetError] = useState("");
  const [betSuccess, setBetSuccess] = useState("");
  const [betCreating, setBetCreating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
    if (!authLoading && user && user.role !== "ADMIN") router.replace("/dashboard");
  }, [user, authLoading, router]);

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setUsers(data.data);
    } catch {
      // silent
    } finally {
      setUsersLoading(false);
    }
  }, [token]);

  const fetchBets = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/bets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setBets(data.data);
    } catch {
      // silent
    } finally {
      setBetsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchBets();
    }
  }, [token, fetchUsers, fetchBets]);

  async function handleApprove(id: string) {
    if (!token) return;
    const res = await fetch(`${API_URL}/api/admin/users/${id}/approve`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: "APPROVED" } : u)));
    }
  }

  async function handleReject(id: string) {
    if (!token) return;
    const res = await fetch(`${API_URL}/api/admin/users/${id}/reject`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: "REJECTED" } : u)));
    }
  }

  async function handleCreateBet(e: FormEvent) {
    e.preventDefault();
    setBetError("");
    setBetSuccess("");
    setBetCreating(true);

    try {
      const res = await fetch(`${API_URL}/api/admin/bets`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          sport: betForm.sport,
          description: betForm.description,
          odds: parseFloat(betForm.odds),
          unit: parseFloat(betForm.unit),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setBetSuccess("Pari créé avec succès !");
      setBetForm({ sport: "", description: "", odds: "", unit: "1" });
      await fetchBets();
    } catch (err: unknown) {
      setBetError(err instanceof Error ? err.message : "Erreur lors de la création.");
    } finally {
      setBetCreating(false);
    }
  }

  async function handleSetResult(id: string, result: "WON" | "LOST") {
    if (!token) return;
    const res = await fetch(`${API_URL}/api/admin/bets/${id}/result`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ result }),
    });
    if (res.ok) {
      setBets((prev) => prev.map((b) => (b.id === id ? { ...b, status: result } : b)));
    }
  }

  async function handleDeleteBet(id: string) {
    if (!token || !confirm("Supprimer ce pari ?")) return;
    const res = await fetch(`${API_URL}/api/admin/bets/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setBets((prev) => prev.filter((b) => b.id !== id));
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FF5C00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const pendingUsers = users.filter((u) => u.status === "PENDING");

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 bg-[#FF5C00] rounded flex items-center justify-center">
                <Zap size={12} className="text-white" fill="white" />
              </div>
              <span
                className="text-lg font-display tracking-widest uppercase text-white"
                style={{ fontFamily: "'Bebas Neue',Impact,sans-serif" }}
              >
                Panel Admin
              </span>
            </div>
            <p className="text-[#6B6B6B] text-sm flex items-center gap-1">
              <ShieldCheck size={13} className="text-[#FF5C00]" />
              {user.email}
            </p>
          </div>
          <button
            onClick={() => { logout(); router.push("/"); }}
            className="flex items-center gap-1.5 text-xs text-[#6B6B6B] hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-[#111]"
          >
            <LogOut size={14} />
            Déconnexion
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("users")}
            className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-5 py-2.5 rounded-lg transition-all ${
              tab === "users"
                ? "bg-[#FF5C00] text-white"
                : "bg-[#111] text-[#6B6B6B] hover:text-white border border-[#1F1F1F]"
            }`}
          >
            <Users size={14} />
            Comptes
            {pendingUsers.length > 0 && (
              <span className="bg-white text-[#FF5C00] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {pendingUsers.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab("bets")}
            className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-5 py-2.5 rounded-lg transition-all ${
              tab === "bets"
                ? "bg-[#FF5C00] text-white"
                : "bg-[#111] text-[#6B6B6B] hover:text-white border border-[#1F1F1F]"
            }`}
          >
            <TrendingUp size={14} />
            Paris
          </button>
        </div>

        {/* ── Onglet Comptes ────────────────────────────────────────────────── */}
        {tab === "users" && (
          <div>
            {usersLoading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-2 border-[#FF5C00] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-16 text-[#6B6B6B] text-sm">Aucun compte inscrit.</div>
            ) : (
              <div className="space-y-3">
                {/* Pendants en premier */}
                {[...users].sort((a) => (a.status === "PENDING" ? -1 : 1)).map((u) => (
                  <div key={u.id} className="glass rounded-xl border border-[#1F1F1F] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm">
                          {u.firstName} {u.lastName}
                        </p>
                        <p className="text-[#6B6B6B] text-xs mt-0.5">{u.email}</p>
                        <p className="text-[#444] text-xs mt-1">
                          Inscrit le{" "}
                          {new Date(u.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <StatusBadge status={u.status} />
                        {u.status === "PENDING" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(u.id)}
                              className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20 border border-emerald-400/20 px-2.5 py-1.5 rounded-lg transition-all"
                            >
                              <CheckCircle2 size={12} />
                              Approuver
                            </button>
                            <button
                              onClick={() => handleReject(u.id)}
                              className="flex items-center gap-1 text-xs font-bold text-red-400 bg-red-400/10 hover:bg-red-400/20 border border-red-400/20 px-2.5 py-1.5 rounded-lg transition-all"
                            >
                              <XCircle size={12} />
                              Refuser
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Onglet Paris ──────────────────────────────────────────────────── */}
        {tab === "bets" && (
          <div className="space-y-6">
            {/* Formulaire création */}
            <div className="glass rounded-xl border border-[#FF5C00]/20 p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Plus size={16} className="text-[#FF5C00]" />
                Nouveau pari
              </h3>

              {betError && (
                <div className="mb-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  {betError}
                </div>
              )}
              {betSuccess && (
                <div className="mb-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                  {betSuccess}
                </div>
              )}

              <form onSubmit={handleCreateBet} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#6B6B6B] uppercase tracking-widest mb-1.5">
                      Sport
                    </label>
                    <input
                      value={betForm.sport}
                      onChange={(e) => setBetForm((p) => ({ ...p, sport: e.target.value }))}
                      placeholder="Football, Tennis…"
                      required
                      className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg px-3 py-2.5 text-white placeholder-[#444] text-sm focus:outline-none focus:border-[#FF5C00] transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-[#6B6B6B] uppercase tracking-widest mb-1.5">
                        Cote
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="1.01"
                        value={betForm.odds}
                        onChange={(e) => setBetForm((p) => ({ ...p, odds: e.target.value }))}
                        placeholder="2.10"
                        required
                        className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg px-3 py-2.5 text-white placeholder-[#444] text-sm focus:outline-none focus:border-[#FF5C00] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#6B6B6B] uppercase tracking-widest mb-1.5">
                        Unité
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0.5"
                        value={betForm.unit}
                        onChange={(e) => setBetForm((p) => ({ ...p, unit: e.target.value }))}
                        placeholder="1"
                        required
                        className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg px-3 py-2.5 text-white placeholder-[#444] text-sm focus:outline-none focus:border-[#FF5C00] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#6B6B6B] uppercase tracking-widest mb-1.5">
                    Description du pari
                  </label>
                  <input
                    value={betForm.description}
                    onChange={(e) => setBetForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Ex : PSG Victoire — Ligue des Champions"
                    required
                    className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-lg px-3 py-2.5 text-white placeholder-[#444] text-sm focus:outline-none focus:border-[#FF5C00] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={betCreating}
                  className="btn-shimmer text-white font-bold tracking-[0.1em] uppercase text-xs px-5 py-2.5 rounded-lg transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {betCreating ? "Création…" : "Créer le pari"}
                </button>
              </form>
            </div>

            {/* Liste des paris */}
            {betsLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-2 border-[#FF5C00] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : bets.length === 0 ? (
              <div className="text-center py-12 text-[#6B6B6B] text-sm">Aucun pari créé.</div>
            ) : (
              <div className="space-y-3">
                {bets.map((bet) => (
                  <div key={bet.id} className="glass rounded-xl border border-[#1F1F1F] p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs font-bold text-[#FF5C00] bg-[#FF5C00]/10 px-2 py-0.5 rounded">
                            {bet.sport}
                          </span>
                          {bet.status === "PENDING" && (
                            <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                              <Clock size={10} />
                              En attente
                            </span>
                          )}
                          {bet.status === "WON" && (
                            <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                              <Trophy size={10} />
                              Gagnant
                            </span>
                          )}
                          {bet.status === "LOST" && (
                            <span className="flex items-center gap-1 text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded">
                              <XCircle size={10} />
                              Perdant
                            </span>
                          )}
                        </div>
                        <p className="text-white text-sm font-medium">{bet.description}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-[#6B6B6B]">@{bet.odds}</span>
                          <span className="text-xs text-[#6B6B6B]">{bet.unit}U</span>
                          <span className="text-xs text-[#444]">
                            {bet.followers}/{bet.totalUsers} suivis
                          </span>
                          <span className="text-xs text-[#444]">
                            {new Date(bet.createdAt).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        {bet.status === "PENDING" && (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleSetResult(bet.id, "WON")}
                              className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20 border border-emerald-400/20 px-2 py-1.5 rounded-lg transition-all"
                            >
                              <CheckCircle2 size={11} />
                              Gagné
                            </button>
                            <button
                              onClick={() => handleSetResult(bet.id, "LOST")}
                              className="flex items-center gap-1 text-xs font-bold text-red-400 bg-red-400/10 hover:bg-red-400/20 border border-red-400/20 px-2 py-1.5 rounded-lg transition-all"
                            >
                              <XCircle size={11} />
                              Perdu
                            </button>
                          </div>
                        )}
                        <button
                          onClick={() => handleDeleteBet(bet.id)}
                          className="text-[#444] hover:text-red-400 transition-colors p-1"
                          title="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
