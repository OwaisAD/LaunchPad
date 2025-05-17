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

export async function getProjectBySlug(slug: string) {
  const response = await fetch(`${API_BASE}/projects/${slug}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 404) {
    const data = await response.json();
    const error = new Error(data.error || "Project not found");
    // @ts-expect-error status
    error.status = 404;
    throw error;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch project");
  }

  return response.json();
}
