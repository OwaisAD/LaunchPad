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

export async function createOrganization(data: {
  name: string;
  description?: string;
  website?: string;
  location?: string;
}) {
  const response = await fetch(`${API_BASE}/organizations`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(response.statusText);
  return response.json();
}
