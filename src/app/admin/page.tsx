export const dynamic = 'force-dynamic';
import { BASE_URL } from "@/utils/config";

export default async function AdminDashboard() {
  let products = [];
  let error = null;

  try {
    const res = await fetch(`${BASE_URL}/products`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch products from backend');
    products = await res.json();
  } catch (err: any) {
    error = err.message;
  }

  const totalProducts = products.length;
  const totalStock = products.reduce((acc: number, p: any) => acc + (p.stock || 0), 0);

  return (
    <div className="animate-fade-in">
      <div className="mb-10">
        <h1 className="text-3xl font-serif tracking-tight text-stone-900 mb-2">Overview</h1>
        <p className="text-sm text-stone-500 font-normal">Welcome back. Here's what's happening with your store today.</p>
      </div>

      {error && (
        <div className="bg-red-50/50 border border-red-200 text-red-600 px-6 py-4 rounded-lg mb-10 text-sm font-medium">
          Error loading dashboard data: {error}. Are you sure your backend is running?
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl border border-stone-200/60 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]">
          <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-stone-400 mb-3">Total Products</div>
          <div className="text-4xl font-normal text-stone-900 tracking-tight">{totalProducts}</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-stone-200/60 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]">
          <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-stone-400 mb-3">Total Stock Units</div>
          <div className="text-4xl font-normal text-stone-900 tracking-tight">{totalStock}</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-stone-200/60 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]">
          <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-stone-400 mb-3">Active Sales</div>
          <div className="text-4xl font-normal text-stone-900 tracking-tight">0</div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-xl border border-stone-200/60 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="px-8 py-6 border-b border-stone-100 flex justify-between items-center">
          <h2 className="text-sm font-medium text-stone-900 tracking-wide">Recent Products</h2>
          <a href="/admin/products" className="text-xs uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors font-medium">View All</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-stone-50/50 text-[#888888] font-medium text-xs tracking-wide">
              <tr>
                <th className="px-8 py-4 font-medium uppercase tracking-wider">Product Name</th>
                <th className="px-8 py-4 font-medium uppercase tracking-wider">Category</th>
                <th className="px-8 py-4 font-medium uppercase tracking-wider">Price</th>
                <th className="px-8 py-4 font-medium uppercase tracking-wider">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 bg-white">
              {products.slice(0, 5).map((p: any) => (
                <tr key={p._id || p.id} className="hover:bg-stone-50/50 transition-colors group">
                  <td className="px-8 py-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-md bg-stone-100 overflow-hidden flex-shrink-0 border border-stone-200/60">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-stone-100"></div>
                      )}
                    </div>
                    <span className="font-medium text-stone-900 tracking-tight">{p.name}</span>
                  </td>
                  <td className="px-8 py-4 text-stone-500 font-normal">{p.category}</td>
                  <td className="px-8 py-4 text-stone-900 font-normal">₹{p.price}</td>
                  <td className="px-8 py-4 text-stone-500 font-normal">{p.stock || 0}</td>
                </tr>
              ))}
              {products.length === 0 && !error && (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-stone-400 font-normal">No products registered in the database yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
