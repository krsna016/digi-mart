import { BASE_URL } from '@/utils/config';

interface RequestOptions extends RequestInit {
  body?: any;
}

export const apiRequest = async (endpoint: string, options: RequestOptions = {}) => {
  let token = null;
  const savedUser = typeof window !== 'undefined' ? localStorage.getItem('digimart_user') : null;
  
  if (savedUser) {
    try {
      token = JSON.parse(savedUser).token;
    } catch (e) {
      console.error('[API] Failed to parse user token from localStorage');
    }
  }
  
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
    console.log(`[API] ${options.method || 'GET'} ${endpoint} - Sending with token`);
  } else {
    console.warn(`[API] ${options.method || 'GET'} ${endpoint} - Sending WITHOUT token (User might be logged out)`);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  const config: RequestInit = {
    ...options,
    headers,
    signal: controller.signal
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const startTime = Date.now();
  let response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, config);
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      console.error(`[API ERROR] Request to ${endpoint} timed out after 10s`);
      throw new Error('Server request timed out. Please try again.');
    }
    console.error(`[API ERROR] Fetch failed for ${endpoint}:`, err.message);
    throw new Error(`Network error: ${err.message}. Please check your connection.`);
  } finally {
    clearTimeout(timeoutId);
  }

  const duration = Date.now() - startTime;
  
  if (duration > 1000) {
    console.warn(`[API] SLOW RESPONSE: ${options.method || 'GET'} ${endpoint} took ${duration}ms`);
  } else {
    console.log(`[API] ${options.method || 'GET'} ${endpoint} took ${duration}ms`);
  }
  
  // Check if response is JSON
  const contentType = response.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    // If not JSON, it could be an HTML error page or something else
    const text = await response.text();
    console.error('Non-JSON response received:', text.substring(0, 100));
    throw new Error(`Server returned a non-JSON response (${response.status}). Please check if the backend is running correctly.`);
  }

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
