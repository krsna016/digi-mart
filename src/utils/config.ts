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
         // Use the confirmed Render backend URL for production
         return 'https://digi-mart-szts.onrender.com/api'; 
      }
    }
    // SSR Fallback for production (Vercel server)
    if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
      return 'https://digi-mart-szts.onrender.com/api';
    }
    url = 'http://localhost:5001/api';
  }
  
  // Ensure it's absolute for SSR if not a relative path
  if (typeof window === 'undefined' && url && !url.startsWith('http')) {
    console.error(`[Critical] NEXT_PUBLIC_API_URL is relative or missing in SSR environment: ${url}`);
  }
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

export const BASE_URL = getBaseUrl();
export const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_SVSX92P5PDLcra';
