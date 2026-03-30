const getBaseUrl = () => {
  // Priority: 
  // 1. Environment variable
  // 2. Production detection (Vercel/Render)
  // 3. Localhost fallback
  let url = process.env.NEXT_PUBLIC_API_URL;
  
  if (!url) {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname;
      if (host.includes('vercel.app') || !host.includes('localhost')) {
         // Use the confirmed Render backend URL for production
         url = 'https://digi-mart-szts.onrender.com/api'; 
      }
    } else if (process.env.NODE_ENV === 'production') {
      // Server-side fallback for production
      url = 'https://digi-mart-szts.onrender.com/api';
    }
  }

  // Final fallback if still unset
  if (!url) {
    url = 'http://localhost:5001/api';
  }
  
  const finalUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  
  // Browser-side logging for diagnostics
  if (typeof window !== 'undefined') {
    console.log(`[Diagnostic] Resolved API URL: ${finalUrl}`);
  }
  
  return finalUrl;
};

export const BASE_URL = getBaseUrl();
export const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_SVSX92P5PDLcra';
