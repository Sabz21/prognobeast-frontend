"use client";
import { useState, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale/fr";
import "react-datepicker/dist/react-datepicker.css";
registerLocale("fr", fr);
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Plus, Trash2, Pencil, X, Check, ChevronLeft,
  Crown, Zap, Users, Download, Upload, Copy,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type VipPlan = "1 Mois" | "3 Mois" | "6 Mois" | "12 Mois" | "2 Mois Flash";

interface VipSubscriber {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  telegram: string;
  plan: VipPlan;
  active: boolean;
  startDate: string;
  notes: string;
}

interface TipFollower {
  id: string;
  name: string;
  email: string;
  tipCount: number;
  notes: string;
}

const PLANS: VipPlan[] = ["1 Mois", "3 Mois", "6 Mois", "12 Mois", "2 Mois Flash"];

const STORAGE_VIP = "pb_vip_subscribers";
const STORAGE_TIPS = "pb_tip_followers";

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function loadStorage<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function saveStorage<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ── Empty forms ───────────────────────────────────────────────────────────────

const emptyVip = (): Omit<VipSubscriber, "id"> => ({
  firstName: "", lastName: "", email: "", telegram: "",
  plan: "1 Mois", active: true,
  startDate: new Date().toISOString().slice(0, 10), notes: "",
});

const emptyTip = (): Omit<TipFollower, "id"> => ({
  name: "", email: "", tipCount: 0, notes: "",
});

// ── Component ─────────────────────────────────────────────────────────────────

export default function AbonnementsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState<"vip" | "tips">("vip");

  // VIP state
  const [vips, setVips] = useState<VipSubscriber[]>([]);
  const [vipForm, setVipForm] = useState(emptyVip());
  const [editingVip, setEditingVip] = useState<string | null>(null);
  const [showVipForm, setShowVipForm] = useState(false);

  // Tips state
  const [tips, setTips] = useState<TipFollower[]>([]);
  const [tipForm, setTipForm] = useState(emptyTip());
  const [editingTip, setEditingTip] = useState<string | null>(null);
  const [showTipForm, setShowTipForm] = useState(false);

  // Filter VIP
  const [filterPlan, setFilterPlan] = useState<"all" | VipPlan>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterActive, setFilterActive] = useState<"all" | "active" | "inactive">("all");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);

  // Load from localStorage
  useEffect(() => {
    setVips(loadStorage<VipSubscriber>(STORAGE_VIP));
    setTips(loadStorage<TipFollower>(STORAGE_TIPS));
  }, []);

  // Auth guard
  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) router.push("/");
  }, [user, loading, router]);

  if (loading || !user || user.role !== "ADMIN") return null;

  // ── VIP CRUD ───────────────────────────────────────────────────────────────

  function saveVips(data: VipSubscriber[]) {
    setVips(data);
    saveStorage(STORAGE_VIP, data);
  }

  function handleAddVip() {
    if (!vipForm.firstName || !vipForm.lastName || !vipForm.email) return;
    const next = [...vips, { ...vipForm, id: uid() }];
    saveVips(next);
    setVipForm(emptyVip());
    setShowVipForm(false);
  }

  function handleUpdateVip() {
    if (!editingVip || !vipForm.firstName || !vipForm.lastName || !vipForm.email) return;
    const next = vips.map(v => v.id === editingVip ? { ...vipForm, id: editingVip } : v);
    saveVips(next);
    setEditingVip(null);
    setVipForm(emptyVip());
    setShowVipForm(false);
  }

  function handleDuplicateVip(v: VipSubscriber) {
    const copy = { ...v, id: uid(), firstName: v.firstName + " (copie)" };
    saveVips([...vips, copy]);
  }

  function handleDeleteVip(id: string) {
    if (!confirm("Supprimer cet abonné ?")) return;
    saveVips(vips.filter(v => v.id !== id));
  }

  function startEditVip(v: VipSubscriber) {
    setEditingVip(v.id);
    setVipForm({ firstName: v.firstName, lastName: v.lastName, email: v.email, telegram: v.telegram, plan: v.plan, active: v.active, startDate: v.startDate, notes: v.notes });
    setShowVipForm(true);
  }

  function toggleVipActive(id: string) {
    const next = vips.map(v => v.id === id ? { ...v, active: !v.active } : v);
    saveVips(next);
  }

  // ── TIP CRUD ───────────────────────────────────────────────────────────────

  function saveTips(data: TipFollower[]) {
    setTips(data);
    saveStorage(STORAGE_TIPS, data);
  }

  function handleAddTip() {
    if (!tipForm.name) return;
    const next = [...tips, { ...tipForm, id: uid() }];
    saveTips(next);
    setTipForm(emptyTip());
    setShowTipForm(false);
  }

  function handleUpdateTip() {
    if (!editingTip || !tipForm.name) return;
    const next = tips.map(t => t.id === editingTip ? { ...tipForm, id: editingTip } : t);
    saveTips(next);
    setEditingTip(null);
    setTipForm(emptyTip());
    setShowTipForm(false);
  }

  function handleDeleteTip(id: string) {
    if (!confirm("Supprimer ce contact ?")) return;
    saveTips(tips.filter(t => t.id !== id));
  }

  function startEditTip(t: TipFollower) {
    setEditingTip(t.id);
    setTipForm({ name: t.name, email: t.email, tipCount: t.tipCount, notes: t.notes });
    setShowTipForm(true);
  }

  function incrementTip(id: string) {
    const next = tips.map(t => t.id === id ? { ...t, tipCount: t.tipCount + 1 } : t);
    saveTips(next);
  }

  // ── Export ─────────────────────────────────────────────────────────────────

  function exportData() {
    const blob = new Blob([JSON.stringify({ vips, tips }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prognobeast-abonnements-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target?.result as string);
          if (parsed.vips) { saveStorage(STORAGE_VIP, parsed.vips); setVips(parsed.vips); }
          if (parsed.tips) { saveStorage(STORAGE_TIPS, parsed.tips); setTips(parsed.tips); }
          alert(`Import réussi : ${parsed.vips?.length ?? 0} abonnés, ${parsed.tips?.length ?? 0} tips.`);
        } catch {
          alert("Fichier invalide.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  // ── Filtered VIPs ──────────────────────────────────────────────────────────

  const filteredVips = vips
    .filter(v => {
      if (filterPlan !== "all" && v.plan !== filterPlan) return false;
      if (filterActive === "active" && !v.active) return false;
      if (filterActive === "inactive" && v.active) return false;
      if (search) {
        const q = search.toLowerCase();
        const match = [v.firstName, v.lastName, v.email, v.telegram].join(" ").toLowerCase();
        if (!match.includes(q)) return false;
      }
      if (dateFrom && new Date(v.startDate) < dateFrom) return false;
      if (dateTo && new Date(v.startDate) > dateTo) return false;
      return true;
    })
    .sort((a, b) => {
      const diff = a.startDate.localeCompare(b.startDate);
      return sortOrder === "asc" ? diff : -diff;
    });

  const activeCount = vips.filter(v => v.active).length;

  // ── Shared input style ─────────────────────────────────────────────────────

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "9px 12px", borderRadius: "8px",
    border: "1.5px solid #E5E7EB", fontSize: "14px",
    background: "white", color: "#111827", outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "12px", fontWeight: 600, color: "#6B7280",
    textTransform: "uppercase", letterSpacing: "0.08em",
    display: "block", marginBottom: "5px",
  };

  // ── Plan badge color ───────────────────────────────────────────────────────

  function planColor(plan: VipPlan) {
    if (plan === "2 Mois Flash") return { bg: "#FEF3C7", color: "#92400E", border: "#FDE68A" };
    if (plan === "12 Mois") return { bg: "#EDE9FE", color: "#5B21B6", border: "#C4B5FD" };
    if (plan === "6 Mois") return { bg: "#DBEAFE", color: "#1D4ED8", border: "#BFDBFE" };
    if (plan === "3 Mois") return { bg: "#D1FAE5", color: "#065F46", border: "#A7F3D0" };
    return { bg: "#F3F4F6", color: "#374151", border: "#E5E7EB" };
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB" }}>

      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid #E5E7EB", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={() => router.push("/admin")}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 12px", borderRadius: "8px", border: "1px solid #E5E7EB", background: "white", cursor: "pointer", fontSize: "13px", color: "#374151", fontWeight: 600 }}
          >
            <ChevronLeft size={15} /> Admin
          </button>
          <div style={{ width: 1, height: 24, background: "#E5E7EB" }} />
          <h1 style={{ fontSize: "18px", fontWeight: 700, color: "#111827", display: "flex", alignItems: "center", gap: "8px" }}>
            <Crown size={18} color="#2563EB" /> Tracker Abonnements
          </h1>
        </div>
        <button
          onClick={exportData}
          style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "8px", border: "1px solid #E5E7EB", background: "white", cursor: "pointer", fontSize: "13px", color: "#374151", fontWeight: 600 }}
        >
          <Download size={14} /> Exporter JSON
        </button>
        <button
          onClick={importData}
          style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "8px", border: "1px solid #BFDBFE", background: "#EFF6FF", cursor: "pointer", fontSize: "13px", color: "#2563EB", fontWeight: 600 }}
        >
          <Upload size={14} /> Importer JSON
        </button>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px 16px" }}>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", background: "white", borderRadius: "14px", padding: "6px", border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          {([
            { key: "vip", label: "Abonnés VIP", Icon: Crown, badge: activeCount },
            { key: "tips", label: "Tips quotidiens", Icon: Zap, badge: tips.length },
          ] as const).map(({ key, label, Icon, badge }) => (
            <button key={key} onClick={() => setTab(key)} style={{
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
                  fontSize: "10px", fontWeight: 800, width: "18px", height: "18px", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: tab === key ? "white" : "#2563EB",
                  color: tab === key ? "#2563EB" : "white",
                }}>{badge}</span>
              )}
            </button>
          ))}
        </div>

        {/* ══ VIP TAB ══════════════════════════════════════════════════════════ */}
        {tab === "vip" && (
          <div>
            {/* Stats cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", marginBottom: "20px" }}>
              {[
                { label: "Total abonnés", value: vips.length, color: "#2563EB" },
                { label: "Actifs", value: activeCount, color: "#16A34A" },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px 20px" }}>
                  <div style={{ fontSize: "28px", fontWeight: 800, color }}>{value}</div>
                  <div style={{ fontSize: "12px", color: "#6B7280", fontWeight: 600, marginTop: "2px" }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Filters + Add button */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center" }}>
              <input
                type="text"
                placeholder="Rechercher nom, email, telegram..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ ...inputStyle, width: "260px", padding: "8px 12px" }}
              />
              <select
                value={filterPlan}
                onChange={e => setFilterPlan(e.target.value as "all" | VipPlan)}
                style={{ ...inputStyle, width: "auto", padding: "8px 12px" }}
              >
                <option value="all">Tous les plans</option>
                {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <select
                value={filterActive}
                onChange={e => setFilterActive(e.target.value as "all" | "active" | "inactive")}
                style={{ ...inputStyle, width: "auto", padding: "8px 12px" }}
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actifs uniquement</option>
                <option value="inactive">Inactifs uniquement</option>
              </select>
              <button
                onClick={() => setSortOrder(o => o === "asc" ? "desc" : "asc")}
                style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px", borderRadius: "8px", border: "1px solid #E5E7EB", background: "white", cursor: "pointer", fontSize: "13px", fontWeight: 600, color: "#374151" }}
              >
                Date {sortOrder === "asc" ? "↑ Ancien → Récent" : "↓ Récent → Ancien"}
              </button>
              <DatePicker
                locale="fr"
                dateFormat="dd/MM/yyyy"
                selected={dateFrom}
                onChange={(d: Date | null) => setDateFrom(d)}
                placeholderText="Du..."
                isClearable
                customInput={<input style={{ ...inputStyle, width: "110px", padding: "8px 12px", cursor: "pointer" }} />}
                popperPlacement="bottom-start"
              />
              <DatePicker
                locale="fr"
                dateFormat="dd/MM/yyyy"
                selected={dateTo}
                onChange={(d: Date | null) => setDateTo(d)}
                placeholderText="Au..."
                isClearable
                customInput={<input style={{ ...inputStyle, width: "110px", padding: "8px 12px", cursor: "pointer" }} />}
                popperPlacement="bottom-start"
              />
              {(dateFrom || dateTo) && (
                <button onClick={() => { setDateFrom(null); setDateTo(null); }} style={{ fontSize: "12px", color: "#DC2626", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                  Effacer dates
                </button>
              )}
              <div style={{ flex: 1 }} />
              <button
                onClick={() => { setEditingVip(null); setVipForm(emptyVip()); setShowVipForm(true); }}
                style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 16px", borderRadius: "9px", border: "none", background: "#2563EB", color: "white", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}
              >
                <Plus size={15} /> Ajouter un abonné
              </button>
            </div>

            {/* Form add/edit */}
            {showVipForm && (
              <div style={{ background: "white", border: "1.5px solid #BFDBFE", borderRadius: "14px", padding: "20px", marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>
                    {editingVip ? "Modifier l'abonné" : "Nouvel abonné"}
                  </h3>
                  <button onClick={() => { setShowVipForm(false); setEditingVip(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}><X size={18} /></button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={labelStyle}>Prénom *</label>
                    <input style={inputStyle} placeholder="Jean" value={vipForm.firstName} onChange={e => setVipForm(f => ({ ...f, firstName: e.target.value }))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Nom *</label>
                    <input style={inputStyle} placeholder="Dupont" value={vipForm.lastName} onChange={e => setVipForm(f => ({ ...f, lastName: e.target.value }))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email *</label>
                    <input style={inputStyle} placeholder="jean@email.com" type="email" value={vipForm.email} onChange={e => setVipForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Nom Telegram</label>
                    <input style={inputStyle} placeholder="@pseudo" value={vipForm.telegram} onChange={e => setVipForm(f => ({ ...f, telegram: e.target.value }))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Abonnement</label>
                    <select style={inputStyle} value={vipForm.plan} onChange={e => setVipForm(f => ({ ...f, plan: e.target.value as VipPlan }))}>
                      {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Date de début</label>
                    <DatePicker
                      locale="fr"
                      dateFormat="dd/MM/yyyy"
                      selected={vipForm.startDate ? new Date(vipForm.startDate) : null}
                      onChange={(date: Date | null) => setVipForm(f => ({ ...f, startDate: date ? date.toISOString().slice(0, 10) : "" }))}
                      customInput={<input style={inputStyle} />}
                      popperPlacement="bottom-start"
                    />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "24px", gridColumn: "span 2" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", fontWeight: 600, color: "#374151" }}>
                      <input type="checkbox" checked={vipForm.active} onChange={e => setVipForm(f => ({ ...f, active: e.target.checked }))} />
                      Abonnement actif
                    </label>
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={labelStyle}>Notes (optionnel)</label>
                    <textarea style={{ ...inputStyle, resize: "vertical", minHeight: "60px" }} placeholder="Infos supplémentaires..." value={vipForm.notes} onChange={e => setVipForm(f => ({ ...f, notes: e.target.value }))} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", marginTop: "16px", justifyContent: "flex-end" }}>
                  <button onClick={() => { setShowVipForm(false); setEditingVip(null); }} style={{ padding: "9px 16px", borderRadius: "8px", border: "1px solid #E5E7EB", background: "white", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: "#374151" }}>
                    Annuler
                  </button>
                  <button onClick={editingVip ? handleUpdateVip : handleAddVip} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 16px", borderRadius: "8px", border: "none", background: "#2563EB", color: "white", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
                    <Check size={14} /> {editingVip ? "Mettre à jour" : "Ajouter"}
                  </button>
                </div>
              </div>
            )}

            {/* Table */}
            {filteredVips.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#9CA3AF", background: "white", borderRadius: "14px", border: "1px solid #E5E7EB" }}>
                <Users size={32} style={{ marginBottom: "8px", opacity: 0.4 }} />
                <p style={{ fontSize: "14px" }}>Aucun abonné trouvé.</p>
              </div>
            ) : (
              <div style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: "14px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                      {["Nom", "Email", "Telegram", "Plan", "Début", "Actif", "Actions"].map(h => (
                        <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVips.map((v, i) => {
                      const pc = planColor(v.plan);
                      return (
                        <tr key={v.id} style={{ borderBottom: i < filteredVips.length - 1 ? "1px solid #F3F4F6" : "none", transition: "background 0.1s" }}>
                          <td style={{ padding: "12px 14px" }}>
                            <div style={{ fontWeight: 700, fontSize: "14px", color: "#111827" }}>{v.firstName} {v.lastName}</div>
                            {v.notes && <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "2px" }}>{v.notes}</div>}
                          </td>
                          <td style={{ padding: "12px 14px", fontSize: "13px", color: "#374151" }}>{v.email}</td>
                          <td style={{ padding: "12px 14px", fontSize: "13px", color: "#374151" }}>{v.telegram || <span style={{ color: "#D1D5DB" }}>—</span>}</td>
                          <td style={{ padding: "12px 14px" }}>
                            <span style={{ background: pc.bg, color: pc.color, border: `1px solid ${pc.border}`, fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "999px" }}>
                              {v.plan}
                            </span>
                          </td>
                          <td style={{ padding: "12px 14px", fontSize: "13px", color: "#6B7280" }}>{v.startDate}</td>
                          <td style={{ padding: "12px 14px" }}>
                            <button onClick={() => toggleVipActive(v.id)} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "4px 10px", borderRadius: "999px", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: 700, background: v.active ? "#D1FAE5" : "#FEE2E2", color: v.active ? "#065F46" : "#991B1B" }}>
                              {v.active ? <><Check size={11} /> Actif</> : <><X size={11} /> Inactif</>}
                            </button>
                          </td>
                          <td style={{ padding: "12px 14px" }}>
                            <div style={{ display: "flex", gap: "6px" }}>
                              <button onClick={() => startEditVip(v)} style={{ padding: "5px 8px", borderRadius: "7px", border: "1px solid #E5E7EB", background: "white", cursor: "pointer", color: "#374151" }}><Pencil size={13} /></button>
                              <button onClick={() => handleDuplicateVip(v)} style={{ padding: "5px 8px", borderRadius: "7px", border: "1px solid #BFDBFE", background: "white", cursor: "pointer", color: "#2563EB" }}><Copy size={13} /></button>
                              <button onClick={() => handleDeleteVip(v.id)} style={{ padding: "5px 8px", borderRadius: "7px", border: "1px solid #FEE2E2", background: "white", cursor: "pointer", color: "#DC2626" }}><Trash2 size={13} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ══ TIPS TAB ═════════════════════════════════════════════════════════ */}
        {tab === "tips" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px 20px", display: "flex", gap: "32px" }}>
                <div>
                  <div style={{ fontSize: "28px", fontWeight: 800, color: "#2563EB" }}>{tips.length}</div>
                  <div style={{ fontSize: "12px", color: "#6B7280", fontWeight: 600 }}>Contacts</div>
                </div>
                <div>
                  <div style={{ fontSize: "28px", fontWeight: 800, color: "#16A34A" }}>{tips.reduce((a, t) => a + t.tipCount, 0)}</div>
                  <div style={{ fontSize: "12px", color: "#6B7280", fontWeight: 600 }}>Tips pris au total</div>
                </div>
              </div>
              <button
                onClick={() => { setEditingTip(null); setTipForm(emptyTip()); setShowTipForm(true); }}
                style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 16px", borderRadius: "9px", border: "none", background: "#2563EB", color: "white", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}
              >
                <Plus size={15} /> Ajouter un contact
              </button>
            </div>

            {/* Form add/edit */}
            {showTipForm && (
              <div style={{ background: "white", border: "1.5px solid #BFDBFE", borderRadius: "14px", padding: "20px", marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>
                    {editingTip ? "Modifier le contact" : "Nouveau contact"}
                  </h3>
                  <button onClick={() => { setShowTipForm(false); setEditingTip(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF" }}><X size={18} /></button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={labelStyle}>Nom / Pseudo *</label>
                    <input style={inputStyle} placeholder="@pseudo ou Prénom Nom" value={tipForm.name} onChange={e => setTipForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email (optionnel)</label>
                    <input style={inputStyle} placeholder="email@exemple.com" type="email" value={tipForm.email} onChange={e => setTipForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Nb de tips pris</label>
                    <input style={inputStyle} type="number" min="0" value={tipForm.tipCount} onChange={e => setTipForm(f => ({ ...f, tipCount: parseInt(e.target.value) || 0 }))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Notes (optionnel)</label>
                    <input style={inputStyle} placeholder="Infos..." value={tipForm.notes} onChange={e => setTipForm(f => ({ ...f, notes: e.target.value }))} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", marginTop: "16px", justifyContent: "flex-end" }}>
                  <button onClick={() => { setShowTipForm(false); setEditingTip(null); }} style={{ padding: "9px 16px", borderRadius: "8px", border: "1px solid #E5E7EB", background: "white", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: "#374151" }}>
                    Annuler
                  </button>
                  <button onClick={editingTip ? handleUpdateTip : handleAddTip} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 16px", borderRadius: "8px", border: "none", background: "#2563EB", color: "white", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
                    <Check size={14} /> {editingTip ? "Mettre à jour" : "Ajouter"}
                  </button>
                </div>
              </div>
            )}

            {/* Table */}
            {tips.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#9CA3AF", background: "white", borderRadius: "14px", border: "1px solid #E5E7EB" }}>
                <Zap size={32} style={{ marginBottom: "8px", opacity: 0.4 }} />
                <p style={{ fontSize: "14px" }}>Aucun contact enregistré.</p>
              </div>
            ) : (
              <div style={{ background: "white", border: "1px solid #E5E7EB", borderRadius: "14px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                      {["Nom / Pseudo", "Email", "Tips pris", "Notes", "Actions"].map(h => (
                        <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...tips].sort((a, b) => b.tipCount - a.tipCount).map((t, i) => (
                      <tr key={t.id} style={{ borderBottom: i < tips.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                        <td style={{ padding: "12px 14px", fontWeight: 700, fontSize: "14px", color: "#111827" }}>{t.name}</td>
                        <td style={{ padding: "12px 14px", fontSize: "13px", color: "#374151" }}>{t.email || <span style={{ color: "#D1D5DB" }}>—</span>}</td>
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ fontSize: "20px", fontWeight: 800, color: "#2563EB" }}>{t.tipCount}</span>
                            <button onClick={() => incrementTip(t.id)} style={{ padding: "3px 10px", borderRadius: "6px", border: "1px solid #BFDBFE", background: "#EFF6FF", cursor: "pointer", fontSize: "13px", fontWeight: 700, color: "#2563EB" }}>
                              +1
                            </button>
                          </div>
                        </td>
                        <td style={{ padding: "12px 14px", fontSize: "13px", color: "#6B7280" }}>{t.notes || <span style={{ color: "#D1D5DB" }}>—</span>}</td>
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button onClick={() => startEditTip(t)} style={{ padding: "5px 8px", borderRadius: "7px", border: "1px solid #E5E7EB", background: "white", cursor: "pointer", color: "#374151" }}><Pencil size={13} /></button>
                            <button onClick={() => handleDeleteTip(t.id)} style={{ padding: "5px 8px", borderRadius: "7px", border: "1px solid #FEE2E2", background: "white", cursor: "pointer", color: "#DC2626" }}><Trash2 size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
