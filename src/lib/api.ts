// lib/api.ts — Client HTTP vers le backend Railway

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
}

// ─── Helper authentifié ───────────────────────────────────────────────────────
function authHeaders(token: string) {
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

// ─── Contact ──────────────────────────────────────────────────────────────────
export async function sendContactForm(formData: ContactFormData): Promise<ApiResponse> {
  const res = await fetch(`${API_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Erreur réseau" }));
    throw new Error(error.message || "Une erreur est survenue");
  }
  return res.json();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export async function register(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<ApiResponse> {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json;
}

export async function getMe(token: string): Promise<ApiResponse> {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json;
}

// ─── Bets (VIP) ───────────────────────────────────────────────────────────────
export async function getBets(token: string): Promise<ApiResponse> {
  const res = await fetch(`${API_URL}/api/bets`, { headers: authHeaders(token) });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json;
}

export async function toggleFollow(token: string, betId: string, followed: boolean): Promise<ApiResponse> {
  const res = await fetch(`${API_URL}/api/bets/${betId}/follow`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({ followed }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json;
}

// ─── Admin ────────────────────────────────────────────────────────────────────
export async function adminGetUsers(token: string): Promise<ApiResponse> {
  const res = await fetch(`${API_URL}/api/admin/users`, { headers: authHeaders(token) });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json;
}

export async function adminApproveUser(token: string, userId: string): Promise<ApiResponse> {
  const res = await fetch(`${API_URL}/api/admin/users/${userId}/approve`, {
    method: "PUT",
    headers: authHeaders(token),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json;
}

export async function adminRejectUser(token: string, userId: string): Promise<ApiResponse> {
  const res = await fetch(`${API_URL}/api/admin/users/${userId}/reject`, {
    method: "PUT",
    headers: authHeaders(token),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json;
}

export async function adminGetBets(token: string): Promise<ApiResponse> {
  const res = await fetch(`${API_URL}/api/admin/bets`, { headers: authHeaders(token) });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json;
}

export async function adminCreateBet(
  token: string,
  bet: { sport: string; description: string; odds: number; unit: number }
): Promise<ApiResponse> {
  const res = await fetch(`${API_URL}/api/admin/bets`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(bet),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json;
}

export async function adminSetResult(
  token: string,
  betId: string,
  result: "WON" | "LOST"
): Promise<ApiResponse> {
  const res = await fetch(`${API_URL}/api/admin/bets/${betId}/result`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({ result }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json;
}

export async function adminDeleteBet(token: string, betId: string): Promise<ApiResponse> {
  const res = await fetch(`${API_URL}/api/admin/bets/${betId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json;
}

// ─── Health check ─────────────────────────────────────────────────────────────
export async function checkApiHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/health`, { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
}
