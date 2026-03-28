"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BASE_URL } from '@/utils/config';
import { Package, ChevronDown, ChevronUp, ChevronRight, ExternalLink, Calendar, CreditCard, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { generateInvoice } from '@/utils/invoiceGenerator';

interface OrderItem {
  _id: string;
  name: string;
  qty: number;
  image: string;
  price: number;
  product: string;
}

interface Order {
  _id: string;
  createdAt: string;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  orderItems: OrderItem[];
  paymentMethod: string;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

function OrdersContent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (success === 'true') {
      setShowSuccess(true);
      // Remove success param from URL without refreshing
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.token) return;
      
      try {
        const response = await fetch(`${BASE_URL}/orders/my-orders`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          const paidOrders = data.filter((order: Order) => order.isPaid);
          setOrders(paidOrders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoadingOrders(false);
      }
    };

    if (mounted && isAuthenticated) {
      fetchOrders();
    }
  }, [mounted, isAuthenticated, user?.token]);

  const toggleOrder = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleDownloadInvoice = (order: Order) => {
    generateInvoice({
      orderId: order._id,
      date: formatDate(order.createdAt),
      customerName: user?.name || 'Customer',
      shippingAddress: order.shippingAddress,
      items: order.orderItems,
      totalPrice: order.totalPrice,
      paymentMethod: order.paymentMethod
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!mounted || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1240px] mx-auto w-full px-8 lg:px-12 py-12 lg:py-20">
        <div className="flex flex-col gap-12">
          
          <div className="flex flex-col gap-2 relative">
            <h1 className="text-4xl font-serif text-foreground tracking-tight">Orders</h1>
            <p className="text-[11px] uppercase tracking-[0.3em] text-stone-500 font-medium">History of your premium essentials</p>
            
            {showSuccess && (
              <div className="absolute top-0 right-0 flex items-center gap-3 bg-primary text-white px-6 py-3 rounded-full shadow-2xl animate-in fade-in slide-in-from-right-8 duration-500">
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Order Placed Successfully</span>
              </div>
            )}
          </div>

          {loadingOrders ? (
            <div className="py-20 flex justify-center">
              <div className="w-6 h-6 border border-stone-300 border-t-stone-900 rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-background border border-stone-200 rounded-[2.5rem] p-16 text-center flex flex-col items-center gap-6">
              <div className="w-16 h-16 bg-background-alt rounded-full flex items-center justify-center">
                <Package className="w-8 h-8 text-stone-400" strokeWidth={1} />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-serif text-foreground">Your orders will appear here</h2>
                <p className="text-sm text-stone-500 font-normal max-w-xs mx-auto">You haven't placed any orders yet. Explore our collections to find your next essential.</p>
              </div>
              <Link href="/collection/all" className="mt-4 px-8 py-3.5 bg-primary text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-stone-800 transition-all active:scale-95 shadow-lg">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {orders.map((order) => (
                <div 
                  key={order._id}
                  className={`bg-background border transition-all duration-500 rounded-3xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${expandedOrder === order._id ? 'border-stone-300 shadow-[0_8px_30px_rgb(0,0,0,0.06)]' : 'border-stone-200 shadow-sm'}`}
                >
                  {/* Order Header Card */}
                  <div 
                    className="p-8 lg:p-10 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-8"
                    onClick={() => toggleOrder(order._id)}
                  >
                    <div className="grid grid-cols-2 lg:flex lg:items-center gap-8 lg:gap-16">
                      <div className="flex flex-col gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-stone-500">Order ID</span>
                        <span className="text-[13px] font-medium text-foreground font-mono tracking-tighter">#{order._id.slice(-8).toUpperCase()}</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-stone-500">Date</span>
                        <div className="flex items-center gap-2 text-foreground">
                           <Calendar className="w-3.5 h-3.5 text-stone-400" strokeWidth={1.5} />
                           <span className="text-[13px] font-medium">{formatDate(order.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-stone-500">Total</span>
                        <span className="text-[13px] font-medium text-foreground">₹{order.totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-stone-500">Status</span>
                        <div className="flex items-center gap-2">
                          {order.isPaid ? (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full border border-green-100">
                               <CheckCircle2 className="w-3 h-3" />
                               <span className="text-[9px] font-bold uppercase tracking-wider">Paid</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full border border-amber-100">
                               <Clock className="w-3 h-3" />
                               <span className="text-[9px] font-bold uppercase tracking-wider">Pending</span>
                            </div>
                          )}
                           {order.isDelivered ? (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                               <Package className="w-3 h-3" />
                               <span className="text-[9px] font-bold uppercase tracking-wider">Delivered</span>
                            </div>
                          ) : (
                             <div className="flex items-center gap-1.5 px-3 py-1 bg-background-alt text-stone-500 rounded-full border border-stone-200">
                               <Clock className="w-3 h-3" />
                               <span className="text-[9px] font-bold uppercase tracking-wider">Processing</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 border-stone-50 pt-6 lg:pt-0">
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           handleDownloadInvoice(order);
                         }}
                         className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 hover:text-foreground transition-colors flex items-center gap-2 group"
                       >
                          Invoice
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-y-1 transition-all" />
                       </button>
                       <div className="w-10 h-10 border border-stone-200 rounded-full flex items-center justify-center bg-background-alt/50 text-stone-500 group-hover:bg-stone-100 transition-all">
                          {expandedOrder === order._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                       </div>
                    </div>
                  </div>

                  {/* Expandable Content */}
                  <div className={`transition-all duration-700 ease-in-out ${expandedOrder === order._id ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden bg-background-alt/30`}>
                    <div className="px-8 lg:px-12 pb-10 border-t border-stone-200/50 pt-10">
                      <div className="flex flex-col gap-10">
                        {/* Summary Bar */}
                        <div className="flex flex-wrap items-center gap-x-12 gap-y-4 text-[11px] font-medium text-stone-500 uppercase tracking-widest">
                           <div className="flex items-center gap-2.5">
                              <CreditCard className="w-3.5 h-3.5 text-stone-400" />
                              <span>Paid via {order.paymentMethod}</span>
                           </div>
                        </div>

                        {/* Items Grid */}
                        <div className="flex flex-col gap-6">
                          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground mb-2">Order Items ({order.orderItems.length})</p>
                          {order.orderItems.map((item) => (
                            <div key={item._id} className="flex items-center gap-8 bg-background p-4 lg:p-6 rounded-2xl border border-stone-200/50 group hover:border-stone-300 transition-all shadow-sm">
                              <div className="relative w-20 h-24 lg:w-24 lg:h-32 bg-stone-100 rounded-xl overflow-hidden shadow-inner">
                                <Image 
                                  src={item.image} 
                                  alt={item.name} 
                                  fill 
                                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                              </div>
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 items-center gap-6">
                                <div className="flex flex-col gap-1.5">
                                  <Link href={`/product/${item.product}`} className="text-sm font-serif text-foreground hover:opacity-60 transition-opacity capitalize leading-tight">{item.name}</Link>
                                  <p className="text-[10px] uppercase tracking-widest text-stone-500 font-medium">Qty: {item.qty}</p>
                                </div>
                                <div className="flex flex-col md:items-end gap-1.5">
                                   <p className="text-[13px] font-medium text-foreground">₹{(item.price * item.qty).toFixed(2)}</p>
                                   <span className="text-[10px] text-stone-500 font-normal">₹{item.price.toFixed(2)} per unit</span>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-stone-200 lg:hidden" />
                            </div>
                          ))}
                        </div>

                        {/* Order Summary Footer */}
                        <div className="mt-4 pt-10 border-t border-stone-300/50 flex flex-col lg:flex-row justify-between gap-12">
                           <div className="flex flex-col gap-4">
                              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-foreground">Shipment details</p>
                              <div className="text-[12px] text-stone-500 font-normal leading-relaxed tracking-wide">
                                 Standard Shipping <br />
                                 Tracking: <span className="text-foreground font-mono">DGM-{order._id.slice(-6).toUpperCase()}</span>
                              </div>
                           </div>
                           <div className="lg:w-80 space-y-4">
                              <div className="flex justify-between text-[11px] uppercase tracking-widest text-stone-500 font-medium">
                                 <span>Subtotal</span>
                                  <span className="text-foreground">₹{order.totalPrice.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-[11px] uppercase tracking-widest text-stone-500 font-medium">
                                 <span>Shipping</span>
                                 <span className="text-foreground">Complimentary</span>
                              </div>
                              <div className="pt-4 border-t border-stone-300 flex justify-between items-end">
                                 <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-foreground">Total</span>
                                  <span className="text-2xl font-serif text-foreground">₹{order.totalPrice.toFixed(2)}</span>
                              </div>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-900 rounded-full animate-spin" />
      </div>
    }>
      <OrdersContent />
    </Suspense>
  );
}
