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

const inp: React.CSSProperties = {
  width: "100%", background: "#F9FAFB", border: "1px solid #E5E7EB",
  borderRadius: "10px", padding: "10px 12px", fontSize: "14px",
  color: "#111827", outline: "none", transition: "border-color 0.15s",
  boxSizing: "border-box",
};

export default function AdminPage() {
  const { user, token, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"users" | "bets">("users");
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [bets, setBets] = useState<AdminBet[]>([]);
  const [betsLoading, setBetsLoading] = useState(true);
  const todayStr = new Date().toISOString().split("T")[0];
  const [betForm, setBetForm] = useState({ sport: "", description: "", odds: "", unit: "1", date: todayStr });
  const [betError, setBetError] = useState("");
  const [betSuccess, setBetSuccess] = useState("");
  const [betCreating, setBetCreating] = useState(false);
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

  useEffect(() => { if (token) { fetchUsers(); fetchBets(); } }, [token, fetchUsers, fetchBets]);

  async function handleApprove(id: string) {
    if (!token) return;
    const res = await fetch(`${API_URL}/api/admin/users/${id}/approve`, { method: "PUT", headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setUsers(prev => prev.map(u => u.id === id ? { ...u, status: "APPROVED" } : u));
  }

  async function handleReject(id: string) {
    if (!token) return;
    const res = await fetch(`${API_URL}/api/admin/users/${id}/reject`, { method: "PUT", headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setUsers(prev => prev.map(u => u.id === id ? { ...u, status: "REJECTED" } : u));
  }

  async function handleCreateBet(e: FormEvent) {
    e.preventDefault();
    setBetError(""); setBetSuccess(""); setBetCreating(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/bets`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ sport: betForm.sport, description: betForm.description, odds: parseFloat(betForm.odds), unit: parseFloat(betForm.unit), date: betForm.date }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setBetSuccess("Pari créé avec succès !");
      setBetForm({ sport: "", description: "", odds: "", unit: "1", date: todayStr });
      await fetchBets();
    } catch (err: unknown) {
      setBetError(err instanceof Error ? err.message : "Erreur lors de la création.");
    } finally { setBetCreating(false); }
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
        body: JSON.stringify({ sport: editForm.sport, description: editForm.description, odds: parseFloat(editForm.odds), unit: parseFloat(editForm.unit) }),
      });
      if (res.ok) {
        setBets(prev => prev.map(b => b.id === editingBet
          ? { ...b, sport: editForm.sport, description: editForm.description, odds: parseFloat(editForm.odds), unit: parseFloat(editForm.unit) }
          : b));
        setEditingBet(null);
      }
    } finally { setEditSaving(false); }
  }

  async function handleSetResult(id: string, result: "WON" | "LOST") {
    if (!token) return;
    const res = await fetch(`${API_URL}/api/admin/bets/${id}/result`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ result }),
    });
    if (res.ok) setBets(prev => prev.map(b => b.id === id ? { ...b, status: result } : b));
  }

  async function handleDeleteBet(id: string) {
    if (!token || !confirm("Supprimer ce pari ?")) return;
    const res = await fetch(`${API_URL}/api/admin/bets/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setBets(prev => prev.filter(b => b.id !== id));
  }

  if (authLoading || !user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F9FAFB" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid #2563EB", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const pendingUsers = users.filter(u => u.status === "PENDING");

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid #E5E7EB" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Image src="/images/logo.png" alt="PrognoBeast" width={40} height={40}
                style={{ borderRadius: "10px", objectFit: "contain" }} />
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <h1 style={{
                    fontFamily: "'Bebas Neue', Impact, sans-serif",
                    fontSize: "22px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#111827",
                  }}>Panel <span style={{
                    background: "linear-gradient(135deg, #2563EB, #60A5FA)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  }}>Admin</span></h1>
                  <span style={{
                    display: "flex", alignItems: "center", gap: "4px",
                    fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                    background: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE",
                    padding: "2px 8px", borderRadius: "999px",
                  }}><ShieldCheck size={10} /> Admin</span>
                </div>
                <p style={{ fontSize: "13px", color: "#6B7280", marginTop: "1px" }}>{user.email}</p>
              </div>
            </div>
            <button onClick={() => { logout(); router.push("/"); }} style={{
              display: "flex", alignItems: "center", gap: "6px",
              fontSize: "13px", fontWeight: 500, color: "#6B7280",
              background: "none", border: "1px solid #E5E7EB", borderRadius: "10px",
              padding: "8px 14px", cursor: "pointer",
            }}>
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px 16px" }}>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: "8px", marginBottom: "24px",
          background: "white", borderRadius: "14px", padding: "6px",
          border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}>
          {[
            { key: "users", label: "Comptes", Icon: Users, badge: pendingUsers.length },
            { key: "bets", label: "Paris", Icon: TrendingUp, badge: 0 },
          ].map(({ key, label, Icon, badge }) => (
            <button key={key} onClick={() => setTab(key as "users" | "bets")} style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              padding: "10px 8px", borderRadius: "10px", border: "none", cursor: "pointer",
              fontSize: "13px", fontWeight: 700, transition: "all 0.15s",
              background: tab === key ? "#2563EB" : "transparent",
              color: tab === key ? "white" : "#6B7280",
              boxShadow: tab === key ? "0 2px 8px rgba(37,99,235,0.3)" : "none",
            }}>
              <Icon size={15} /> {label}
              {badge > 0 && (
                <span style={{
                  fontSize: "10px", fontWeight: 800, width: "18px", height: "18px",
                  borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  background: tab === key ? "white" : "#2563EB",
                  color: tab === key ? "#2563EB" : "white",
                }}>{badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* ══ COMPTES ══ */}
        {tab === "users" && (
          <div>
            {usersLoading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", border: "3px solid #2563EB", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
              </div>
            ) : users.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: "16px", border: "1px solid #E5E7EB" }}>
                <Users size={40} style={{ color: "#D1D5DB", margin: "0 auto 12px" }} />
                <p style={{ fontSize: "15px", fontWeight: 600, color: "#374151" }}>Aucun compte inscrit</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[...users].sort(a => a.status === "PENDING" ? -1 : 1).map(u => (
                  <div key={u.id} style={{
                    background: "white", borderRadius: "14px",
                    border: u.status === "PENDING" ? "1px solid #BFDBFE" : "1px solid #E5E7EB",
                    boxShadow: u.status === "PENDING" ? "0 2px 12px rgba(37,99,235,0.08)" : "0 1px 3px rgba(0,0,0,0.06)",
                    overflow: "hidden",
                  }}>
                    {u.status === "PENDING" && <div style={{ height: "3px", background: "linear-gradient(90deg, #2563EB, #60A5FA)" }} />}
                    <div style={{ padding: "16px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                        <div style={{ flex: 1, minWidth: "180px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                            <div style={{
                              width: "36px", height: "36px", borderRadius: "50%",
                              background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
                              border: "1px solid #BFDBFE",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: "14px", fontWeight: 700, color: "#2563EB", flexShrink: 0,
                            }}>
                              {u.firstName[0]}{u.lastName[0]}
                            </div>
                            <div>
                              <p style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>
                                {u.firstName} {u.lastName}
                              </p>
                              <p style={{ fontSize: "12px", color: "#6B7280" }}>{u.email}</p>
                            </div>
                          </div>
                          <p style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "4px" }}>
                            Inscrit le {new Date(u.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                          </p>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                          {/* Status badge */}
                          {u.status === "APPROVED" && (
                            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "999px", background: "#F0FDF4", color: "#16A34A", border: "1px solid #BBF7D0" }}>
                              <CheckCircle2 size={11} /> Approuvé
                            </span>
                          )}
                          {u.status === "REJECTED" && (
                            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "999px", background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}>
                              <XCircle size={11} /> Refusé
                            </span>
                          )}
                          {u.status === "PENDING" && (
                            <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "999px", background: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE" }}>
                              <Clock size={11} /> En attente
                            </span>
                          )}

                          {u.status === "PENDING" && (
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button onClick={() => handleApprove(u.id)} style={{
                                display: "flex", alignItems: "center", gap: "5px",
                                fontSize: "12px", fontWeight: 700, padding: "8px 14px",
                                borderRadius: "999px", border: "none", cursor: "pointer",
                                background: "linear-gradient(135deg, #16A34A, #15803D)",
                                color: "white", boxShadow: "0 2px 8px rgba(22,163,74,0.3)",
                              }}>
                                <CheckCircle2 size={13} /> Approuver
                              </button>
                              <button onClick={() => handleReject(u.id)} style={{
                                display: "flex", alignItems: "center", gap: "5px",
                                fontSize: "12px", fontWeight: 700, padding: "8px 14px",
                                borderRadius: "999px", border: "1px solid #FECACA", cursor: "pointer",
                                background: "#FEF2F2", color: "#DC2626",
                              }}>
                                <XCircle size={13} /> Refuser
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ PARIS ══ */}
        {tab === "bets" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Formulaire création */}
            <div style={{
              background: "white", borderRadius: "16px",
              border: "1px solid #BFDBFE", boxShadow: "0 4px 24px rgba(37,99,235,0.08)",
              overflow: "hidden",
            }}>
              <div style={{ padding: "4px 0 0", background: "linear-gradient(90deg, #2563EB, #60A5FA)", height: "3px" }} />
              <div style={{ padding: "20px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#111827", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#EFF6FF", border: "1px solid #BFDBFE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Plus size={15} style={{ color: "#2563EB" }} />
                  </span>
                  Nouveau pari
                </h3>

                {betError && <div style={{ marginBottom: "12px", padding: "10px 14px", borderRadius: "10px", background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", fontSize: "13px" }}>{betError}</div>}
                {betSuccess && <div style={{ marginBottom: "12px", padding: "10px 14px", borderRadius: "10px", background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#16A34A", fontSize: "13px" }}>{betSuccess}</div>}

                <form onSubmit={handleCreateBet} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Sport</label>
                      <input value={betForm.sport} onChange={e => setBetForm(p => ({ ...p, sport: e.target.value }))}
                        placeholder="Football, Tennis…" required style={inp}
                        onFocus={e => e.currentTarget.style.borderColor = "#2563EB"}
                        onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Cote</label>
                        <input type="number" step="0.01" min="1.01" value={betForm.odds}
                          onChange={e => setBetForm(p => ({ ...p, odds: e.target.value }))}
                          placeholder="2.10" required style={inp}
                          onFocus={e => e.currentTarget.style.borderColor = "#2563EB"}
                          onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Unité</label>
                        <input type="number" step="any" min="0.01" value={betForm.unit}
                          onChange={e => setBetForm(p => ({ ...p, unit: e.target.value }))}
                          placeholder="1" required style={inp}
                          onFocus={e => e.currentTarget.style.borderColor = "#2563EB"}
                          onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Description du pari</label>
                    <input value={betForm.description} onChange={e => setBetForm(p => ({ ...p, description: e.target.value }))}
                      placeholder="Ex : PSG Victoire — Ligue des Champions" required style={inp}
                      onFocus={e => e.currentTarget.style.borderColor = "#2563EB"}
                      onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Date du pari</label>
                    <input type="date" value={betForm.date} onChange={e => setBetForm(p => ({ ...p, date: e.target.value }))}
                      required style={inp}
                      onFocus={e => e.currentTarget.style.borderColor = "#2563EB"}
                      onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"} />
                  </div>
                  <button type="submit" disabled={betCreating} style={{
                    alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "6px",
                    fontSize: "13px", fontWeight: 700, padding: "10px 20px",
                    borderRadius: "999px", border: "none", cursor: betCreating ? "not-allowed" : "pointer",
                    background: betCreating ? "#93C5FD" : "linear-gradient(135deg, #2563EB, #1D4ED8)",
                    color: "white", boxShadow: betCreating ? "none" : "0 2px 12px rgba(37,99,235,0.35)",
                    transition: "all 0.15s",
                  }}>
                    <Plus size={15} /> {betCreating ? "Création…" : "Créer le pari"}
                  </button>
                </form>
              </div>
            </div>

            {/* Liste paris */}
            {betsLoading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", border: "3px solid #2563EB", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
              </div>
            ) : bets.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: "16px", border: "1px solid #E5E7EB" }}>
                <TrendingUp size={40} style={{ color: "#D1D5DB", margin: "0 auto 12px" }} />
                <p style={{ fontSize: "15px", fontWeight: 600, color: "#374151" }}>Aucun pari créé</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {bets.map(bet => (
                  <div key={bet.id} style={{
                    background: "white", borderRadius: "14px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                    overflow: "hidden",
                  }}>
                    {bet.status === "WON" && <div style={{ height: "3px", background: "linear-gradient(90deg, #16A34A, #4ADE80)" }} />}
                    {bet.status === "LOST" && <div style={{ height: "3px", background: "linear-gradient(90deg, #DC2626, #F87171)" }} />}
                    {bet.status === "PENDING" && <div style={{ height: "3px", background: "linear-gradient(90deg, #2563EB, #60A5FA)" }} />}

                    {editingBet === bet.id ? (
                      /* Mode édition */
                      <form onSubmit={handleEditBet} style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>Modifier le pari</span>
                          <button type="button" onClick={() => setEditingBet(null)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: "2px" }}>
                            <X size={16} />
                          </button>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                          <div>
                            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "5px" }}>Sport</label>
                            <input value={editForm.sport} onChange={e => setEditForm(p => ({ ...p, sport: e.target.value }))} required style={inp}
                              onFocus={e => e.currentTarget.style.borderColor = "#2563EB"}
                              onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"} />
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                            <div>
                              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "5px" }}>Cote</label>
                              <input type="number" step="0.01" min="1.01" value={editForm.odds} onChange={e => setEditForm(p => ({ ...p, odds: e.target.value }))} required style={inp}
                                onFocus={e => e.currentTarget.style.borderColor = "#2563EB"}
                                onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"} />
                            </div>
                            <div>
                              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "5px" }}>Unité</label>
                              <input type="number" step="any" min="0.01" value={editForm.unit} onChange={e => setEditForm(p => ({ ...p, unit: e.target.value }))} required style={inp}
                                onFocus={e => e.currentTarget.style.borderColor = "#2563EB"}
                                onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"} />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "5px" }}>Description</label>
                          <input value={editForm.description} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} required style={inp}
                            onFocus={e => e.currentTarget.style.borderColor = "#2563EB"}
                            onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"} />
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button type="submit" disabled={editSaving} style={{
                            fontSize: "12px", fontWeight: 700, padding: "8px 16px", borderRadius: "999px", border: "none", cursor: "pointer",
                            background: editSaving ? "#93C5FD" : "linear-gradient(135deg, #2563EB, #1D4ED8)", color: "white",
                            boxShadow: editSaving ? "none" : "0 2px 8px rgba(37,99,235,0.3)",
                          }}>
                            {editSaving ? "Enregistrement…" : "Enregistrer"}
                          </button>
                          <button type="button" onClick={() => setEditingBet(null)} style={{
                            fontSize: "12px", fontWeight: 600, padding: "8px 16px", borderRadius: "999px",
                            border: "1px solid #E5E7EB", background: "white", color: "#6B7280", cursor: "pointer",
                          }}>Annuler</button>
                        </div>
                      </form>
                    ) : (
                      /* Mode lecture */
                      <div style={{ padding: "16px" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "6px" }}>
                              <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 10px", borderRadius: "999px", background: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE" }}>{bet.sport}</span>
                              {bet.status === "PENDING" && <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: 600, padding: "3px 8px", borderRadius: "999px", background: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE" }}><Clock size={10} /> En attente</span>}
                              {bet.status === "WON" && <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: 600, padding: "3px 8px", borderRadius: "999px", background: "#F0FDF4", color: "#16A34A", border: "1px solid #BBF7D0" }}><Trophy size={10} /> Gagnant</span>}
                              {bet.status === "LOST" && <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: 600, padding: "3px 8px", borderRadius: "999px", background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}><XCircle size={10} /> Perdant</span>}
                            </div>
                            <p style={{ fontSize: "14px", fontWeight: 600, color: "#111827", marginBottom: "6px" }}>{bet.description}</p>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                              <span style={{ fontSize: "13px", fontWeight: 700, color: "#2563EB" }}>@{bet.odds}</span>
                              <span style={{ fontSize: "12px", color: "#6B7280" }}>{bet.unit}U</span>
                              <span style={{ fontSize: "12px", color: "#9CA3AF" }}>{bet.followers}/{bet.totalUsers} suivis</span>
                              <span style={{ fontSize: "12px", color: "#9CA3AF" }}>{new Date(bet.createdAt).toLocaleDateString("fr-FR")}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px", flexShrink: 0 }}>
                            {bet.status === "PENDING" && (
                              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                                <button onClick={() => handleSetResult(bet.id, "WON")} style={{
                                  display: "flex", alignItems: "center", gap: "4px",
                                  fontSize: "11px", fontWeight: 700, padding: "6px 12px", borderRadius: "999px", border: "none", cursor: "pointer",
                                  background: "linear-gradient(135deg, #16A34A, #15803D)", color: "white",
                                  boxShadow: "0 2px 6px rgba(22,163,74,0.3)",
                                }}><CheckCircle2 size={12} /> Gagné</button>
                                <button onClick={() => handleSetResult(bet.id, "LOST")} style={{
                                  display: "flex", alignItems: "center", gap: "4px",
                                  fontSize: "11px", fontWeight: 700, padding: "6px 12px", borderRadius: "999px",
                                  border: "1px solid #FECACA", cursor: "pointer", background: "#FEF2F2", color: "#DC2626",
                                }}><XCircle size={12} /> Perdu</button>
                              </div>
                            )}
                            <div style={{ display: "flex", gap: "4px" }}>
                              <button onClick={() => startEdit(bet)} title="Modifier" style={{
                                background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "8px",
                                padding: "6px", cursor: "pointer", color: "#6B7280", display: "flex",
                              }}><Pencil size={13} /></button>
                              <button onClick={() => handleDeleteBet(bet.id)} title="Supprimer" style={{
                                background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px",
                                padding: "6px", cursor: "pointer", color: "#DC2626", display: "flex",
                              }}><Trash2 size={13} /></button>
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
