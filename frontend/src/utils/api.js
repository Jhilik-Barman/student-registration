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

export async function selectCourse(studentId, courseData) {
  const response = await fetch(`${API_BASE}/students/${studentId}/course`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(courseData),
  });
  const result = await response.json();
  return { ok: response.ok, status: response.status, ...result };
}

export async function confirmPayment(studentId) {
  const response = await fetch(`${API_BASE}/students/${studentId}/payment-confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  const result = await response.json();
  return { ok: response.ok, status: response.status, ...result };
}