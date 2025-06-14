import { API_URL } from "@/utils/constants";

const API_BASE = import.meta.env.MODE === "development" ? import.meta.env.VITE_API_URL : API_URL;

export async function validateSession() {
  const response = await fetch(`${API_BASE}/auth/validate`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Not authenticated");
  return response.json();
}

export async function signIn(data: { email: string; password: string; rememberMe?: boolean }) {
  const response = await fetch(`${API_BASE}/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Login failed");
  }

  return await response.json();
}

export async function signUp(data: {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  password: string;
}) {
  const response = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Sign up failed");
  }

  return await response.json();
}

export async function signOut() {
  const response = await fetch(`${API_BASE}/auth/signout`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Sign out failed");
  return response.json();
}
