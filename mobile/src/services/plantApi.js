import { getToken } from './authApi';

const BASE_URL = 'http://192.168.100.114:80';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, options = {}) {
  const token = await getToken();
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    ...options,
  });

  if (response.status === 204) return null;

  const data = await response.json();

  if (!response.ok) {
    const message = data?.detail || data?.message || 'Something went wrong';
    throw new ApiError(message, response.status);
  }

  return data;
}

export const plantApi = {
  getAll: () => request('/plants'),

  create: (body) =>
    request('/plants', { method: 'POST', body: JSON.stringify(body) }),

  update: (id, body) =>
    request(`/plants/${id}`, { method: 'PUT', body: JSON.stringify(body) }),

  delete: (id) =>
    request(`/plants/${id}`, { method: 'DELETE' }),
};

export const scanApi = {
  getAll: () => request('/scans'),

  getById: (id) => request(`/scans/${id}`),

  create: (body) =>
    request('/scans', { method: 'POST', body: JSON.stringify(body) }),
};
