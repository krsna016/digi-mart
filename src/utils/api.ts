import { BASE_URL } from '@/utils/config';

interface RequestOptions extends RequestInit {
  body?: any;
}

export const apiRequest = async (endpoint: string, options: RequestOptions = {}) => {
  const token = localStorage.getItem('digimart_user') 
    ? JSON.parse(localStorage.getItem('digimart_user')!).token 
    : null;

  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

export const api = {
  get: (endpoint: string, options?: RequestOptions) => apiRequest(endpoint, { ...options, method: 'GET' }),
  post: (endpoint: string, body: any, options?: RequestOptions) => apiRequest(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint: string, body: any, options?: RequestOptions) => apiRequest(endpoint, { ...options, method: 'PUT', body }),
  delete: (endpoint: string, options?: RequestOptions) => apiRequest(endpoint, { ...options, method: 'DELETE' }),
};
