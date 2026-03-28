"use client";

import { useCart } from '@/context/CartContext';
import { useAuth, Address } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api } from '@/utils/api';
import { RAZORPAY_KEY_ID } from '@/utils/config';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Plus, CheckCircle2 } from 'lucide-react';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated, isLoading: authLoading, getAddresses } = useAuth();
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/checkout');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!isAuthenticated) return;
      try {
        const data = await getAddresses();
        setAddresses(data);
        if (data.length === 0) {
          router.push('/account/addresses?redirect=/checkout&message=Please add a shipping address to continue');
        } else {
          const defaultAddr = data.find(addr => addr.isDefault) || data[0];
          setSelectedAddress(defaultAddr);
        }
      } catch (err) {
        console.error('Failed to fetch addresses', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [isAuthenticated, getAddresses, router]);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('[Checkout] Razorpay SDK loaded successfully');
      setScriptLoaded(true);
    };
    script.onerror = () => {
      console.error('[Checkout] Razorpay SDK failed to load. Ad-blocker might be active.');
      setScriptLoaded(false);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !selectedAddress) return;
    if (cart.length === 0) return;

    setIsProcessing(true);

    try {
      // 0. Check if script is loaded
      if (!scriptLoaded || !(window as any).Razorpay) {
        throw new Error('Payment gateway (Razorpay) failed to initialize. Please disable your ad-blocker and refresh the page.');
      }

      // 1. Create Order in DB
      console.log('[Checkout] Creating order in database...');
      const orderData = {
        orderItems: cart.map(item => {
          const effectivePrice = item.onSale && item.discountPrice ? item.discountPrice : item.price;
          return {
            name: item.name,
            qty: item.quantity,
            image: item.image || '/images/fallback.png',
            price: effectivePrice,
            product: item.id
          };
        }),
        shippingAddress: { 
          address: selectedAddress.addressLine, 
          city: selectedAddress.city, 
          postalCode: selectedAddress.pincode, 
          country: selectedAddress.country 
        },
        paymentMethod: 'Razorpay',
        itemsPrice: cartTotal,
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: cartTotal,
      };

      const dbOrder = await api.post('/orders', orderData);
      console.log('[Checkout] DB Order Created:', dbOrder._id);

      // 2. Create Razorpay Order in Backend
      console.log('[Checkout] Creating Razorpay order...');
      const razorpayOrder = await api.post('/payment/order', {
        amount: cartTotal,
        currency: 'INR',
        receipt: dbOrder._id
      });
      console.log('[Checkout] Razorpay Order ID:', razorpayOrder.id);

      // 3. Open Razorpay Modal
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'DigiMart',
        description: 'Premium Collection Purchase',
        order_id: razorpayOrder.id,
        handler: async function (response: any) {
          console.log('[Checkout] Payment Success Modal Closed, verifying...');
          try {
            // 4. Verify Payment after success
            const verifyData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              db_order_id: dbOrder._id
            };

            await api.post('/payment/verify', verifyData);
            console.log('[Checkout] Payment Verified Successfully');
            
            clearCart();
            router.push(`/orders?success=true`);
          } catch (err) {
            console.error('[Checkout] Verification failed', err);
            alert('Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            console.log('[Checkout] Payment modal dismissed by user');
          }
        },
        prefill: {
          name: selectedAddress.fullName,
          email: user?.email,
          contact: selectedAddress.phone
        },
        theme: {
          color: '#1C1917',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      
      // Explicitly catch open() failures (unusual but possible if script is partially blocked)
      try {
        rzp.open();
      } catch (openError: any) {
        console.error('[Checkout] rzp.open() failed:', openError);
        throw new Error('Could not open the payment window. This is usually caused by an ad-blocker or tracker-blocker (uBlock, etc.). Please disable it and try again.');
      }

    } catch (error: any) {
      console.error('[Checkout] Error during sequence:', error);
      const isAdblockError = error.message?.toLowerCase().includes('ad-blocker') || 
                            error.message?.toLowerCase().includes('gateway') ||
                            error.message?.toLowerCase().includes('load');
      
      if (isAdblockError) {
        alert('PAYMENT BLOCKED: Your browser or an extension is blocking the payment gateway (Razorpay). Please disable your Ad-Blocker/Tracker-Blocker and refresh the page to continue.');
      } else {
        alert(error.message || 'Something went wrong during checkout. Check your connection or payment settings.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (authLoading || loading || (!isAuthenticated && !authLoading)) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-8 lg:px-12 py-12 lg:py-20">
        <h1 className="text-4xl font-serif text-foreground mb-12 text-center uppercase tracking-tight">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Shipping Form */}
          <div className="lg:col-span-7 space-y-12">
            <div className="bg-background p-10 lg:p-12 rounded-[2.5rem] border border-stone-300 shadow-sm">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-2xl font-serif text-foreground mb-1">Shipping Destination</h2>
                        <p className="text-[13px] uppercase tracking-[0.2em] text-stone-600 font-medium whitespace-nowrap">Choose your delivery address</p>
                    </div>
                    <button 
                      onClick={() => router.push('/account/addresses?redirect=/checkout')}
                      className="p-3 bg-background-alt rounded-full hover:bg-stone-100 transition-colors"
                    >
                      <Plus className="w-5 h-5 text-foreground" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((addr) => (
                        <div 
                          key={addr._id}
                          onClick={() => setSelectedAddress(addr)}
                          className={`relative p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer group hover:shadow-md ${
                            selectedAddress?._id === addr._id 
                              ? 'border-stone-900 bg-background-alt' 
                              : 'border-stone-200 hover:border-stone-300'
                          }`}
                        >
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <p className="text-[14px] font-bold uppercase tracking-[0.1em] text-foreground">{addr.fullName}</p>
                                    {selectedAddress?._id === addr._id && (
                                        <CheckCircle2 className="w-5 h-5 text-foreground fill-white" strokeWidth={1.5} />
                                    )}
                                </div>
                                <div className="space-y-1 text-sm text-stone-600 font-normal leading-relaxed">
                                    <p>{addr.addressLine}</p>
                                    <p>{addr.city}, {addr.state} {addr.pincode}</p>
                                    <p className="pt-2 font-medium text-stone-500">{addr.phone}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button 
                    onClick={handlePayment}
                    disabled={isProcessing || !selectedAddress || cart.length === 0 || cartTotal < 1}
                    className="w-full mt-12 bg-primary text-white py-6 rounded-full text-[13px] font-bold uppercase tracking-[0.3em] hover:bg-stone-800 disabled:opacity-50 transition-all shadow-xl shadow-stone-900/10 active:scale-[0.98]"
                >
                    {isProcessing ? 'Processing Securely...' : 
                     cartTotal < 1 ? 'Minimum Order ₹1.00 Required' :
                     `Proceed to Payment — ₹${cartTotal.toFixed(2)}`}
                </button>
            </div>
            
            <div className="px-10 flex gap-4 items-start text-stone-500">
                <MapPin className="w-4 h-4 shrink-0 mt-1" />
                <p className="text-[11px] leading-relaxed uppercase tracking-widest font-medium">
                    All orders are handled by our global logistics partners. Premium packaging and insurance included for all international shipments.
                </p>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-background-alt p-10 lg:p-12 rounded-[2.5rem] border border-stone-300 sticky top-32">
                <h2 className="text-2xl font-serif text-foreground mb-10 text-center uppercase tracking-widest">Bag Summary</h2>
                <div className="space-y-8 mb-10 max-h-[400px] overflow-y-auto pr-4 scrollbar-hide">
                    {cart.map(item => (
                        <div key={item.id} className="flex gap-6 group">
                            <div className="w-24 h-32 bg-background border border-stone-300 rounded-2xl overflow-hidden shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                                <img src={item.image || '/images/fallback.png'} alt={item.name} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" />
                            </div>
                            <div className="flex flex-col justify-between py-2 flex-1">
                                <div>
                                    <h3 className="text-sm font-bold text-foreground uppercase tracking-widest leading-tight">{item.name}</h3>
                                    <p className="text-[11px] text-stone-500 font-bold uppercase tracking-[0.2em] mt-2">Qty: {item.quantity}</p>
                                </div>
                                <div className="flex flex-col">
                                    {item.onSale && item.discountPrice ? (
                                        <>
                                            <span className="font-serif text-lg text-red-600">₹{(item.discountPrice * item.quantity).toFixed(2)}</span>
                                            <span className="text-[10px] text-stone-500 line-through font-normal">₹{(item.price * item.quantity).toFixed(2)}</span>
                                        </>
                                    ) : (
                                        <span className="font-serif text-lg text-foreground">₹{(item.price * item.quantity).toFixed(2)}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="border-t border-stone-300 pt-10 space-y-6">
                    <div className="flex justify-between text-sm">
                        <span className="text-stone-500 font-bold uppercase tracking-widest">Subtotal</span>
                        <span className="font-serif text-foreground">₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-stone-500 font-bold uppercase tracking-widest">Shipping</span>
                        <span className="text-foreground font-bold uppercase tracking-widest text-[10px]">Complimentary</span>
                    </div>
                    <div className="flex justify-between items-end border-t border-stone-300 pt-8 mt-4">
                        <span className="font-bold uppercase tracking-[0.4em] text-[11px] text-foreground">Total</span>
                        <span className="font-serif text-3xl text-foreground leading-none">₹{cartTotal.toFixed(2)}</span>
                    </div>
                </div>
                
                <p className="mt-12 text-[10px] text-center text-stone-500 font-bold uppercase tracking-[0.15em] leading-relaxed">
                    By purchasing, you agree to our terms. Your transaction is encrypted and secured by Razorpay.
                </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
