const API_BASE = "/api";

export async function registerStudent(data) {
  const response = await fetch(`${API_BASE}/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return { ok: response.ok, data: result.data, message: result.message, errors: result.errors };
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

export async function confirmPayment(studentId, formData) {
  const response = await fetch(`${API_BASE}/students/${studentId}/payment-confirm`, {
    method: "POST",
    body: formData,
  });
  const result = await response.json();
  return { ok: response.ok, status: response.status, ...result };
}

export async function getAdminStudents(token) {
  const response = await fetch(`${API_BASE}/students`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await response.json();
  return { ok: response.ok, status: response.status, ...result };
}

export async function updatePaymentStatus(studentId, status, token) {
  const response = await fetch(`${API_BASE}/students/${studentId}/payment-status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  const result = await response.json();
  return { ok: response.ok, status: response.status, ...result };
}
