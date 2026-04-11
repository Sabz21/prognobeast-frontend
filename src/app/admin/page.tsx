"use client";
import { useState, useEffect, useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users, TrendingUp, Plus, CheckCircle2, XCircle,
  Clock, Trash2, LogOut, ShieldCheck, Trophy, Pencil, X,
} from "lucide-react";
import Image from "next/image";

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
    return <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded"
      style={{ color: "#16A34A", background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
      <CheckCircle2 size={11} /> Approuvé
    </span>;
  if (status === "REJECTED")
    return <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded"
      style={{ color: "#DC2626", background: "#FEF2F2", border: "1px solid #FECACA" }}>
      <XCircle size={11} /> Refusé
    </span>;
  return <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded"
    style={{ color: "#D97706", background: "#FFFBEB", border: "1px solid #FDE68A" }}>
    <Clock size={11} /> En attente
  </span>;
}

function inputStyle(focused: boolean) {
  return {
    width: "100%", background: "#F9FAFB",
    border: `1px solid ${focused ? "#2563EB" : "#E5E7EB"}`,
    borderRadius: "0.5rem", padding: "0.625rem 0.75rem",
    fontSize: "14px", color: "#111827", outline: "none",
  };
}

export default function AdminPage() {
  const { user, token, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"users" | "bets">("users");
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [bets, setBets] = useState<AdminBet[]>([]);
  const [betsLoading, setBetsLoading] = useState(true);
  const [betForm, setBetForm] = useState({ sport: "", description: "", odds: "", unit: "1" });
  const [betError, setBetError] = useState("");
  const [betSuccess, setBetSuccess] = useState("");
  const [betCreating, setBetCreating] = useState(false);
  const [focused, setFocused] = useState<string>("");
  const [editingBet, setEditingBet] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ sport: "", description: "", odds: "", unit: "" });
  const [editSaving, setEditSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
    if (!authLoading && user && user.role !== "ADMIN") router.replace("/dashboard");
  }, [user, authLoading, router]);

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setUsers(data.data);
    } catch { /* silent */ } finally { setUsersLoading(false); }
  }, [token]);

  const fetchBets = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/bets`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setBets(data.data);
    } catch { /* silent */ } finally { setBetsLoading(false); }
  }, [token]);

  useEffect(() => {
    if (token) { fetchUsers(); fetchBets(); }
  }, [token, fetchUsers, fetchBets]);

  async function handleApprove(id: string) {
    if (!token) return;
    const res = await fetch(`${API_URL}/api/admin/users/${id}/approve`, {
      method: "PUT", headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: "APPROVED" } : u)));
  }

  async function handleReject(id: string) {
    if (!token) return;
    const res = await fetch(`${API_URL}/api/admin/users/${id}/reject`, {
      method: "PUT", headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: "REJECTED" } : u)));
  }

  async function handleCreateBet(e: FormEvent) {
    e.preventDefault();
    setBetError(""); setBetSuccess(""); setBetCreating(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/bets`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          sport: betForm.sport, description: betForm.description,
          odds: parseFloat(betForm.odds), unit: parseFloat(betForm.unit),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setBetSuccess("Pari créé avec succès !");
      setBetForm({ sport: "", description: "", odds: "", unit: "1" });
      await fetchBets();
    } catch (err: unknown) {
      setBetError(err instanceof Error ? err.message : "Erreur lors de la création.");
    } finally { setBetCreating(false); }
  }

  async function handleSetResult(id: string, result: "WON" | "LOST") {
    if (!token) return;
    const res = await fetch(`${API_URL}/api/admin/bets/${id}/result`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ result }),
    });
    if (res.ok) setBets((prev) => prev.map((b) => (b.id === id ? { ...b, status: result } : b)));
  }

  function startEdit(bet: AdminBet) {
    setEditingBet(bet.id);
    setEditForm({ sport: bet.sport, description: bet.description, odds: String(bet.odds), unit: String(bet.unit) });
  }

  async function handleEditBet(e: FormEvent) {
    e.preventDefault();
    if (!token || !editingBet) return;
    setEditSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/bets/${editingBet}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          sport: editForm.sport,
          description: editForm.description,
          odds: parseFloat(editForm.odds),
          unit: parseFloat(editForm.unit),
        }),
      });
      if (res.ok) {
        setBets((prev) => prev.map((b) => b.id === editingBet
          ? { ...b, sport: editForm.sport, description: editForm.description, odds: parseFloat(editForm.odds), unit: parseFloat(editForm.unit) }
          : b
        ));
        setEditingBet(null);
      }
    } finally { setEditSaving(false); }
  }

  async function handleDeleteBet(id: string) {
    if (!token || !confirm("Supprimer ce pari ?")) return;
    const res = await fetch(`${API_URL}/api/admin/bets/${id}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setBets((prev) => prev.filter((b) => b.id !== id));
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F9FAFB" }}>
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#2563EB", borderTopColor: "transparent" }} />
      </div>
    );
  }

  const pendingUsers = users.filter((u) => u.status === "PENDING");

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: "#F9FAFB" }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="PrognoBeast" width={36} height={36}
              className="rounded-lg" style={{ objectFit: "contain" }} />
            <div>
              <h1 className="text-lg font-bold text-[#111827] flex items-center gap-1.5">
                <ShieldCheck size={18} style={{ color: "#2563EB" }} /> Panel Admin
              </h1>
              <p className="text-sm" style={{ color: "#6B7280" }}>{user.email}</p>
            </div>
          </div>
          <button onClick={() => { logout(); router.push("/"); }}
            className="flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#111827] transition-colors px-3 py-2 rounded-lg hover:bg-white">
            <LogOut size={14} /> Déconnexion
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: "users", label: "Comptes", Icon: Users, badge: pendingUsers.length },
            { key: "bets", label: "Paris", Icon: TrendingUp, badge: 0 },
          ].map(({ key, label, Icon, badge }) => (
            <button key={key} onClick={() => setTab(key as "users" | "bets")}
              className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
              style={tab === key
                ? { background: "#2563EB", color: "white" }
                : { background: "white", color: "#6B7280", border: "1px solid #E5E7EB" }}>
              <Icon size={14} /> {label}
              {badge > 0 && (
                <span className="text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
                  style={{ background: tab === key ? "white" : "#2563EB", color: tab === key ? "#2563EB" : "white" }}>
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Comptes ── */}
        {tab === "users" && (
          <div>
            {usersLoading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: "#2563EB", borderTopColor: "transparent" }} />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-16 text-[#6B7280] text-sm">Aucun compte inscrit.</div>
            ) : (
              <div className="space-y-3">
                {[...users].sort((a) => (a.status === "PENDING" ? -1 : 1)).map((u) => (
                  <div key={u.id} className="bg-white rounded-xl border border-[#E5E7EB] p-4"
                    style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-[#111827] font-semibold text-sm">{u.firstName} {u.lastName}</p>
                        <p className="text-[#6B7280] text-xs mt-0.5">{u.email}</p>
                        <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>
                          Inscrit le {new Date(u.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <StatusBadge status={u.status} />
                        {u.status === "PENDING" && (
                          <div className="flex gap-2">
                            <button onClick={() => handleApprove(u.id)}
                              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
                              style={{ color: "#16A34A", background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                              <CheckCircle2 size={12} /> Approuver
                            </button>
                            <button onClick={() => handleReject(u.id)}
                              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
                              style={{ color: "#DC2626", background: "#FEF2F2", border: "1px solid #FECACA" }}>
                              <XCircle size={12} /> Refuser
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

        {/* ── Paris ── */}
        {tab === "bets" && (
          <div className="space-y-6">
            {/* Formulaire */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-5"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <h3 className="text-sm font-bold text-[#111827] mb-4 flex items-center gap-2">
                <Plus size={16} style={{ color: "#2563EB" }} /> Nouveau pari
              </h3>

              {betError && <div className="mb-3 p-3 rounded-lg text-xs" style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626" }}>{betError}</div>}
              {betSuccess && <div className="mb-3 p-3 rounded-lg text-xs" style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#16A34A" }}>{betSuccess}</div>}

              <form onSubmit={handleCreateBet} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-1.5">Sport</label>
                    <input value={betForm.sport} onChange={(e) => setBetForm((p) => ({ ...p, sport: e.target.value }))}
                      placeholder="Football, Tennis…" required
                      style={inputStyle(focused === "sport") as React.CSSProperties}
                      onFocus={() => setFocused("sport")} onBlur={() => setFocused("")} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-1.5">Cote</label>
                      <input type="number" step="0.01" min="1.01" value={betForm.odds}
                        onChange={(e) => setBetForm((p) => ({ ...p, odds: e.target.value }))}
                        placeholder="2.10" required
                        style={inputStyle(focused === "odds") as React.CSSProperties}
                        onFocus={() => setFocused("odds")} onBlur={() => setFocused("")} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-1.5">Unité</label>
                      <input type="number" step="0.5" min="0.5" value={betForm.unit}
                        onChange={(e) => setBetForm((p) => ({ ...p, unit: e.target.value }))}
                        placeholder="1" required
                        style={inputStyle(focused === "unit") as React.CSSProperties}
                        onFocus={() => setFocused("unit")} onBlur={() => setFocused("")} />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-1.5">Description</label>
                  <input value={betForm.description} onChange={(e) => setBetForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Ex : PSG Victoire — Ligue des Champions" required
                    style={inputStyle(focused === "desc") as React.CSSProperties}
                    onFocus={() => setFocused("desc")} onBlur={() => setFocused("")} />
                </div>
                <button type="submit" disabled={betCreating}
                  className="text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
                  style={{ background: betCreating ? "#93C5FD" : "#2563EB" }}>
                  {betCreating ? "Création…" : "Créer le pari"}
                </button>
              </form>
            </div>

            {/* Liste paris */}
            {betsLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: "#2563EB", borderTopColor: "transparent" }} />
              </div>
            ) : bets.length === 0 ? (
              <div className="text-center py-12 text-[#6B7280] text-sm">Aucun pari créé.</div>
            ) : (
              <div className="space-y-3">
                {bets.map((bet) => (
                  <div key={bet.id} className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden"
                    style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                    {/* Mode édition */}
                    {editingBet === bet.id ? (
                      <form onSubmit={handleEditBet} className="p-4 space-y-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-[#111827]">Modifier le pari</span>
                          <button type="button" onClick={() => setEditingBet(null)}
                            className="text-[#9CA3AF] hover:text-[#6B7280]"><X size={16} /></button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-1">Sport</label>
                            <input value={editForm.sport} onChange={(e) => setEditForm((p) => ({ ...p, sport: e.target.value }))}
                              required style={inputStyle(focused === `edit-sport-${bet.id}`) as React.CSSProperties}
                              onFocus={() => setFocused(`edit-sport-${bet.id}`)} onBlur={() => setFocused("")} />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-1">Cote</label>
                              <input type="number" step="0.01" min="1.01" value={editForm.odds}
                                onChange={(e) => setEditForm((p) => ({ ...p, odds: e.target.value }))} required
                                style={inputStyle(focused === `edit-odds-${bet.id}`) as React.CSSProperties}
                                onFocus={() => setFocused(`edit-odds-${bet.id}`)} onBlur={() => setFocused("")} />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-1">Unité</label>
                              <input type="number" step="0.5" min="0.5" value={editForm.unit}
                                onChange={(e) => setEditForm((p) => ({ ...p, unit: e.target.value }))} required
                                style={inputStyle(focused === `edit-unit-${bet.id}`) as React.CSSProperties}
                                onFocus={() => setFocused(`edit-unit-${bet.id}`)} onBlur={() => setFocused("")} />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-1">Description</label>
                          <input value={editForm.description} onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                            required style={inputStyle(focused === `edit-desc-${bet.id}`) as React.CSSProperties}
                            onFocus={() => setFocused(`edit-desc-${bet.id}`)} onBlur={() => setFocused("")} />
                        </div>
                        <div className="flex gap-2">
                          <button type="submit" disabled={editSaving}
                            className="text-white text-xs font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
                            style={{ background: editSaving ? "#93C5FD" : "#2563EB" }}>
                            {editSaving ? "Enregistrement…" : "Enregistrer"}
                          </button>
                          <button type="button" onClick={() => setEditingBet(null)}
                            className="text-xs font-semibold px-4 py-2 rounded-lg"
                            style={{ color: "#6B7280", border: "1px solid #E5E7EB" }}>
                            Annuler
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="text-xs font-bold px-2 py-0.5 rounded"
                                style={{ color: "#2563EB", background: "#EFF6FF" }}>{bet.sport}</span>
                              {bet.status === "PENDING" && <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded" style={{ color: "#D97706", background: "#FFFBEB" }}><Clock size={10} /> En attente</span>}
                              {bet.status === "WON" && <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded" style={{ color: "#16A34A", background: "#F0FDF4" }}><Trophy size={10} /> Gagnant</span>}
                              {bet.status === "LOST" && <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded" style={{ color: "#DC2626", background: "#FEF2F2" }}><XCircle size={10} /> Perdant</span>}
                            </div>
                            <p className="text-[#111827] text-sm font-medium">{bet.description}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-[#6B7280]">@{bet.odds}</span>
                              <span className="text-xs text-[#6B7280]">{bet.unit}U</span>
                              <span className="text-xs" style={{ color: "#9CA3AF" }}>{bet.followers}/{bet.totalUsers} suivis</span>
                              <span className="text-xs" style={{ color: "#9CA3AF" }}>{new Date(bet.createdAt).toLocaleDateString("fr-FR")}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            {bet.status === "PENDING" && (
                              <div className="flex gap-1.5">
                                <button onClick={() => handleSetResult(bet.id, "WON")}
                                  className="flex items-center gap-1 text-xs font-semibold px-2 py-1.5 rounded-lg"
                                  style={{ color: "#16A34A", background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                                  <CheckCircle2 size={11} /> Gagné
                                </button>
                                <button onClick={() => handleSetResult(bet.id, "LOST")}
                                  className="flex items-center gap-1 text-xs font-semibold px-2 py-1.5 rounded-lg"
                                  style={{ color: "#DC2626", background: "#FEF2F2", border: "1px solid #FECACA" }}>
                                  <XCircle size={11} /> Perdu
                                </button>
                              </div>
                            )}
                            <div className="flex gap-1">
                              <button onClick={() => startEdit(bet)}
                                className="text-[#9CA3AF] hover:text-[#2563EB] transition-colors p-1" title="Modifier">
                                <Pencil size={14} />
                              </button>
                              <button onClick={() => handleDeleteBet(bet.id)}
                                className="text-[#9CA3AF] hover:text-red-500 transition-colors p-1" title="Supprimer">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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
