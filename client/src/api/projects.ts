const API_BASE =
  import.meta.env.MODE === "development" ? import.meta.env.VITE_API_URL : "https://launchpad.sportia.dk/api";

export async function createProject(data: {
  orgSlug: string;
  projectName: string;
  description?: string;
  frontend: string;
  backend: string;
  databases: string[];
  repo: string;
  dbConnector?: string[];
  logging?: string[];
  monitoring?: string[];
  testing?: string[];
  auth?: string;
}) {
  const response = await fetch(`${API_BASE}/projects`, {
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

export async function getProjects() {
  const response = await fetch(`${API_BASE}/projects`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Not authenticated");
  return response.json();
}
