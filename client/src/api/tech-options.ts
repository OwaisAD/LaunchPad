const API_BASE =
  import.meta.env.MODE === "development" ? import.meta.env.VITE_API_URL : "https://launchpad.sportia.dk/api";

export async function getTechOptions() {
  const response = await fetch(`${API_BASE}/tech-options`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Not authenticated");
  return response.json();
}
