import * as SecureStore from 'expo-secure-store';

// When running on a physical device replace with your machine's local IP.
// On Android emulator use 10.0.2.2, on iOS simulator localhost works.
const BASE_URL = 'http://192.168.100.114:80';

const TOKEN_KEY = 'plantdoc_token';

export async function saveToken(token) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function removeToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.message ||
      (Array.isArray(data?.details)
        ? data.details.map((e) => e.message).join(', ')
        : 'Something went wrong');
    throw new ApiError(message, response.status, data);
  }

  return data;
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export const authApi = {
  register: (body) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),

  login: (body) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  me: async () => {
    const token = await getToken();
    return request('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
