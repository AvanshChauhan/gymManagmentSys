import api from "./axios";

export const authApi = {
  login: (payload) => api.post("/auth/login", payload),
  getMe: () => api.get("/auth/getMe"),
  imageKitAuth: () => api.get("/auth/imagekit-auth"),
  logout: () => api.post("/auth/logout"),
};

export const dashboardApi = {
  stats: () => api.get("/dashboard/stats"),
  revenue: (params) => api.get("/dashboard/revenue", { params }),
  pendingDues: (params) => api.get("/dashboard/pending-dues", { params }),
  expiringMemberships: (params) =>
    api.get("/dashboard/expiring-memberships", { params }),
};

export const membersApi = {
  list: (params) => api.get("/members", { params }),
  search: (params) => api.get("/members/search", { params }),
  create: (payload) => api.post("/members", payload),
  update: (id, payload) => api.patch(`/members/${id}`, payload),
  remove: (id) => api.delete(`/members/${id}`),
  get: (id) => api.get(`/members/${id}`),
};

export const memberSelfApi = {
  profile: () => api.get("/members/me/profile"),
  updateProfile: (payload) => api.patch("/members/me/profile", payload),
  summary: () => api.get("/members/me/summary"),
  membership: () => api.get("/members/me/membership"),
  payments: () => api.get("/members/me/payments"),
};

export const plansApi = {
  list: (params) => api.get("/plan", { params }),
  create: (payload) => api.post("/plan", payload),
  update: (id, payload) => api.put(`/plan/${id}`, payload),
  remove: (id) => api.delete(`/plan/${id}`),
};

export const membershipsApi = {
  list: (params) => api.get("/membership", { params }),
  create: (payload) => api.post("/membership", payload),
  renew: (id) => api.patch(`/membership/${id}/renew`),
  cancel: (id) => api.patch(`/membership/${id}/cancel`),
  remove: (id) => api.delete(`/membership/${id}`),
};

export const paymentsApi = {
  list: (params) => api.get("/payments", { params }),
  create: (membershipId, payload) => api.post(`/payments/${membershipId}`, payload),
  byMember: (memberId, params) => api.get(`/payments/member/${memberId}`, { params }),
  remove: (id) => api.delete(`/payments/${id}`),
};
