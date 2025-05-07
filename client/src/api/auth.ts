const API_BASE = import.meta.env.MODE === "development" ? import.meta.env.VITE_API_URL : "";

export async function validateSession() {
  const response = await fetch(`${API_BASE}/api/auth/validate`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Invalid session");
  return await response.json();
}

export async function signIn(data: { email: string; password: string; rememberMe?: boolean }) {
  const response = await fetch(`${API_BASE}/api/auth/signin`, {
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

export async function signOut() {
  const response = await fetch(`${API_BASE}/api/auth/signout`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Logout failed");
  return await response.json();
}
