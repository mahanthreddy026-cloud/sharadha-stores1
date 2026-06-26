const BASE_URL = "https://sharadha-stores1-production-a4ec.up.railway.app";

// Get stored token
export function getToken() {
  return localStorage.getItem("authToken");
}

// Store token
export function setToken(token) {
  if (token) {
    localStorage.setItem("authToken", token);
  } else {
    localStorage.removeItem("authToken");
  }
}

// Check if user is admin
export function isAdmin() {
  const token = getToken();
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role === "admin";
  } catch {
    return false;
  }
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers,
    ...options,
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message || res.statusText || "Request failed");
  }

  return data;
}

export async function fetchProducts() {
  return request("/api/products");
}

export async function registerUser(user) {
  const res = await request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(user),
  });
  if (res.token) setToken(res.token);
  return res;
}

export async function loginUser(credentials) {
  const res = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  if (res.token) setToken(res.token);
  return res;
}

export function logout() {
  setToken(null);
}

export async function changePassword(oldPassword, newPassword) {
  return request("/api/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ oldPassword, newPassword }),
  });
}

// Admin endpoints
export async function fetchAdminProducts() {
  return request("/api/admin/products");
}

export async function fetchAdminCustomers() {
  return request("/api/admin/customers");
}

export async function fetchAdminOrders() {
  return request("/api/admin/orders");
}

export async function fetchAdminBulkOrders() {
  return request("/api/admin/bulk-orders");
}

export async function fetchAdminReports() {
  return request("/api/admin/reports");
}

export async function makeAdmin(userId) {
  return request("/api/admin/make-admin", {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
}

export async function removeAdmin(userId) {
  return request("/api/admin/remove-admin", {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
}

export async function sendContact(message) {
  return request("/api/contact", {
    method: "POST",
    body: JSON.stringify(message),
  });
}

export async function sendBulkOrder(order) {
  return request("/api/bulk-order", {
    method: "POST",
    body: JSON.stringify(order),
  });
}

export async function placeOrder(order) {
  return request("/api/orders", {
    method: "POST",
    body: JSON.stringify(order),
  });
}

export async function updateOrderStatus(orderId, status) {
  return request(`/api/admin/orders/${orderId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}
