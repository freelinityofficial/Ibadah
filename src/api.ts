/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/api.ts
export const BASE_URL = "https://api.ibadah.xyz/api";

// ========== AUTH ========== //
export async function login(username: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.detail || "Login failed");
  }

  return res.json();
}

export async function register(
  first_name: string,
  last_name: string,
  phone: string,
  username: string,
  password: string
) {
  const res = await fetch(`${BASE_URL}/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ first_name, last_name, phone, username, password }),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.detail || "Register failed");
  }

  return res.json();
}

// ========== PRAYERS ========== //
export async function getDailyPrayers() {
  const token = localStorage.getItem("access");
  const res = await fetch(`${BASE_URL}/prayers/day/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch daily prayers");

  const data = await res.json();
  return data; // اليوم مفيهوش count، فنعد الـ array
}

export async function getWeeklyPrayers() {
  const token = localStorage.getItem("access");
  const res = await fetch(`${BASE_URL}/prayers/week/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch weekly prayers");

  const data = await res.json();
  return data; // الأسبوع بيرجع count جاهز
}

export async function getMonthlyPrayers() {
  const token = localStorage.getItem("access");
  const res = await fetch(`${BASE_URL}/prayers/month/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch monthly prayers");

  const data = await res.json();
  return data; // الشهر بيرجع count جاهز
}

export async function getAllBadges() {
  const res = await fetch(`${BASE_URL}/badges/`);
  const data = await res.json();
  return data;
}

export async function getUserBadges() {
  const userId = localStorage.getItem("userId");
  const res = await fetch(`${BASE_URL}/badges/user/${userId}`);
  const data = await res.json();
  return data;
}

// update The Prayer
export async function updatePrayer(prayer: string, prayed: boolean) {
  const token = localStorage.getItem("access");
  const res = await fetch(`${BASE_URL}/prayers/log/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ prayer, prayed }),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.detail || "Failed to update prayer");
  }

  return res.json();
}

// ========== LEADERBOARD ========== //
export async function getUserRank() {
  const token = localStorage.getItem("access");
  const username = localStorage.getItem("username");
  if (!token || !username) throw new Error("No access token or username");

  const res = await fetch(`${BASE_URL}/groups/me/leaderboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch leaderboard");

  const data = await res.json();
  const leaderboard = data.leaderboard;

  // ترتيب حسب الأسبوع (week_count)
  const sorted = leaderboard
    .slice()
    .sort((a: any, b: any) => b.week_count - a.week_count);

  const index = sorted.findIndex((u: any) => u.username === username);

  return {
    rank: index >= 0 ? index + 1 : null,
    leaderboard: sorted,
  };
}