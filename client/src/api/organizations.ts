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

export const inviteMember = async (organizationId: string, email: string) => {
  const response = await fetch(`${API_BASE}/organizations/${organizationId}/invite`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to invite member");
  }

  return response.json();
};

export const changeRole = async ({
  organizationId,
  email,
  role,
}: {
  organizationId: string;
  email: string;
  role: string;
}) => {
  const response = await fetch(`${API_BASE}/organizations/${organizationId}/role`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, role }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to change role");
  }

  return response.json();
};
