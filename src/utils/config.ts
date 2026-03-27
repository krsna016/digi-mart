const getBaseUrl = () => {
  // Priority: 
  // 1. Environment variable
  // 2. Production detection
  // 3. Localhost fallback
  let url = process.env.NEXT_PUBLIC_API_URL;
  
  if (!url) {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname;
      if (host.includes('vercel.app') || !host.includes('localhost')) {
         // Auto-detect production backend if variable is missing
         // Usually if frontend is on Vercel, backend might be on Render or similar
         console.warn('[Config] NEXT_PUBLIC_API_URL missing, attempting to use relative /api');
         return '/api'; 
      }
    }
    url = 'http://localhost:5001/api';
  }
  
  // Ensure it's absolute for SSR if not a relative path
  if (typeof window === 'undefined' && !url.startsWith('http')) {
    console.error(`[Critical] NEXT_PUBLIC_API_URL is relative or missing in SSR environment: ${url}`);
  }
  return url;
};

export const BASE_URL = getBaseUrl();
export const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
