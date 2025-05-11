const API_BASE =
  import.meta.env.MODE === "development" ? import.meta.env.VITE_API_URL : "https://launchpad.sportia.dk/api";

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

export async function getOrganizationBySlug(slug: string) {
  const response = await fetch(`${API_BASE}/organizations/${slug}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 404) {
    const data = await response.json();
    const error = new Error(data.error || "Organization not found");
    // @ts-expect-error status
    error.status = 404;
    throw error;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch organization");
  }

  return response.json();
}
