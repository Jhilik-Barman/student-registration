const API_BASE = "/api";

export async function registerStudent(data) {
  const response = await fetch(`${API_BASE}/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return { ok: response.ok, status: response.status, ...result };
}
