import { getToken } from './authApi';

const BASE_URL = 'http://192.168.100.114:80';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function authedFetch(path, options = {}) {
  const token = await getToken();
  const { headers, ...rest } = options;
  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: { Authorization: `Bearer ${token}`, ...headers },
  });
  const data = await response.json();
  if (!response.ok) throw new ApiError(data?.detail || 'Request failed', response.status);
  return data;
}

export async function uploadImage(imageUri) {
  const token = await getToken();
  const formData = new FormData();
  formData.append('file', { uri: imageUri, name: 'plant.jpg', type: 'image/jpeg' });

  const response = await fetch(`${BASE_URL}/images/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) throw new ApiError(data?.detail || 'Upload failed', response.status);
  return data.url;
}

export async function uploadBase64Image(base64Data) {
  return authedFetch('/images/upload-base64', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: base64Data }),
  });
}

export async function getAdvice(plant, disease, severity) {
  return authedFetch('/advice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plant, disease, severity }),
  });
}

export async function analyzePlant(imageUri) {
  const token = await getToken();
  const formData = new FormData();
  formData.append('file', { uri: imageUri, name: 'plant.jpg', type: 'image/jpeg' });

  const response = await fetch(`${BASE_URL}/predict`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) throw new ApiError(data?.detail || 'Inference failed', response.status);
  return data;
}
