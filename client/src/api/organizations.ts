const API_BASE = import.meta.env.MODE === "development" ? import.meta.env.VITE_API_URL : "api";

export async function getOrganizations() {
  const response = await fetch(`${API_BASE}/organizations`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Not authenticated");
  return response.json();
}
