/**
 * Unified API Transport Service
 * Handles credentials, double-submit CSRF headers, and structured error envelopes.
 */

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

let storedCsrfToken = null;

export function setCsrfToken(token) {
  if (token) storedCsrfToken = token;
}

export function getCsrfToken() {
  return storedCsrfToken || getCookie('csrf_token') || '';
}

async function request(endpoint, options = {}) {
  // Ensure endpoints use /api/v1 prefix
  const path = endpoint.startsWith('/api') ? endpoint : `/api/v1${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const csrf = getCsrfToken();
  const method = (options.method || 'GET').toUpperCase();
  if (csrf && !['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    headers['x-csrf-token'] = csrf;
  }

  const config = {
    ...options,
    method,
    headers,
    credentials: 'include', // Send and receive HTTP-only cookies
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  let response;
  try {
    response = await fetch(path, config);
  } catch (networkErr) {
    const error = new Error('Network connection error. Please check your internet and try again.');
    error.code = 'NETWORK_ERROR';
    error.status = 0;
    throw error;
  }

  const payload = await response.json().catch(() => ({}));

  // Automatically capture and store refreshed CSRF tokens
  if (payload.data && payload.data.csrfToken) {
    setCsrfToken(payload.data.csrfToken);
  } else if (payload.csrfToken) {
    setCsrfToken(payload.csrfToken);
  }

  if (!response.ok || payload.success === false) {
    const errorPayload = payload.error || {};
    const error = new Error(errorPayload.message || payload.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.code = errorPayload.code || 'REQUEST_FAILED';
    error.fields = errorPayload.fields || [];
    error.data = payload;
    throw error;
  }

  return payload;
}

export const api = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options) => request(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body, options) => request(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, body, options) => request(endpoint, { ...options, method: 'DELETE', body }),

  // Auth endpoints
  auth: {
    me: () => api.get('/auth/me'),
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout'),
    deleteAccount: (password) => api.delete('/auth/account', { password }),
  },

  // Roadmap discovery
  roadmaps: {
    getCatalogue: (params = {}) => {
      const query = new URLSearchParams();
      if (params.search) query.set('search', params.search);
      if (params.level && params.level !== 'All') query.set('level', params.level);
      if (params.page) query.set('page', params.page);
      if (params.limit) query.set('limit', params.limit);
      const queryString = query.toString() ? `?${query.toString()}` : '';
      return api.get(`/roadmaps${queryString}`);
    },
    getPreview: (slug) => api.get(`/roadmaps/${slug}`),
    getTopic: (slug, topicKey) => api.get(`/roadmaps/${slug}/topics/${topicKey}`),
  },

  // Progress and enrollment
  progress: {
    getDashboard: () => api.get('/progress/dashboard'),
    enroll: (slug, payload = {}) => api.post(`/progress/enrolments/${slug}`, payload),
    updateEnrolment: (slug, payload) => api.patch(`/progress/enrolments/${slug}`, payload),
    unenroll: (slug) => api.delete(`/progress/enrolments/${slug}`),
    updateTopicStatus: (slug, topicKey, status) => api.put(`/progress/roadmaps/${slug}/topics/${topicKey}`, { status }),
  },

  // Reports
  reports: {
    submit: (reportData) => api.post('/reports', reportData),
  },

  // Admin curation
  admin: {
    listRoadmaps: (status) => api.get(`/admin/roadmaps${status ? `?status=${status}` : ''}`),
    createRoadmap: (data) => api.post('/admin/roadmaps', data),
    updateRoadmap: (id, data) => api.patch(`/admin/roadmaps/${id}`, data),
    createModule: (roadmapId, data) => api.post(`/admin/roadmaps/${roadmapId}/modules`, data),
    updateModule: (id, data) => api.patch(`/admin/modules/${id}`, data),
    reorderModules: (roadmapId, orderedIds) => api.put(`/admin/roadmaps/${roadmapId}/modules/order`, { orderedIds }),
    createTopic: (moduleId, data) => api.post(`/admin/modules/${moduleId}/topics`, data),
    updateTopic: (id, data) => api.patch(`/admin/topics/${id}`, data),
    reorderTopics: (moduleId, orderedIds) => api.put(`/admin/modules/${moduleId}/topics/order`, { orderedIds }),
    archiveTopic: (id) => api.patch(`/admin/topics/${id}`, { status: 'archived' }),
    listReports: (status = 'open', page = 1) => api.get(`/admin/reports?status=${status}&page=${page}`),
    resolveReport: (id) => api.patch(`/admin/reports/${id}`, { status: 'resolved' }),
  },
};
