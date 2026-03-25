"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { categoryConfig } from '@/data/categoryConfig';
import { api } from '@/utils/api';

export default function AddProductPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    mainCategory: '',
    category: '',
    subcategory: '',
    price: '',
    stock: '',
    image: '',
    description: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{title: string, type: 'success' | 'error'} | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.mainCategory.trim()) newErrors.mainCategory = 'Main category is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.subcategory.trim()) newErrors.subcategory = 'Subcategory is required';
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid positive price';
    }
    if (!formData.stock || isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = 'Please enter a valid stock integer, 0 or above';
    }
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      if (name === 'mainCategory') {
        return { ...prev, [name]: value, category: '', subcategory: '' };
      }
      if (name === 'category') {
        return { ...prev, [name]: value, subcategory: '' };
      }
      return { ...prev, [name]: value };
    });

    // Clear error for field on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined as any }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // NOTE: Ensure these exist in your .env.local file in production!
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo'; 
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'docs_upload_example_us_preset'; 
      
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: data,
      });

      if (!res.ok) {
        throw new Error('Image upload failed. Ensure your Cloudinary credentials are valid.');
      }

      const json = await res.json();
      setFormData(prev => ({ ...prev, image: json.secure_url }));
      setToastMessage({ title: 'Image securely uploaded!', type: 'success' });
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err: any) {
      setToastMessage({ title: err.message, type: 'error' });
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setIsUploading(false);
      // Reset input value so same file can be selected again if removed
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setToastMessage({ title: 'Please fix the errors in the form.', type: 'error' });
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: parseInt(formData.stock, 10),
      };

      await api.post('/products', payload);

      setToastMessage({ title: 'Product successfully added!', type: 'success' });
      
      // Reset form
      setFormData({
        name: '',
        mainCategory: '',
        category: '',
        subcategory: '',
        price: '',
        stock: '',
        image: '',
        description: ''
      });
      setErrors({});
      
      setTimeout(() => setToastMessage(null), 3500);

    } catch (err: any) {
      setToastMessage({ title: err.message || 'An unexpected error occurred', type: 'error' });
      setTimeout(() => setToastMessage(null), 3500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in relative min-h-[calc(100vh-140px)] pb-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-8 right-8 z-[100] px-6 py-4 rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center gap-3 animate-fade-up ${toastMessage.type === 'success' ? 'bg-stone-900 text-white' : 'bg-red-50 border border-red-200 text-red-600'}`}>
          {toastMessage.type === 'success' ? (
            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
             <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span className="text-sm font-medium tracking-wide">{toastMessage.title}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-serif tracking-tight text-stone-900 mb-2">Add New Product</h1>
          <p className="text-sm text-stone-500 font-normal">Create a new product listing in your catalog.</p>
        </div>
        <button 
          onClick={() => router.push('/admin/products')}
          className="text-[11px] font-medium uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors py-2"
        >
          &larr; Back to Products
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column: Basic Details */}
        <div className="w-full lg:w-2/3 bg-white rounded-xl border border-stone-200/60 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] p-8">
          <h2 className="text-lg font-serif text-stone-900 mb-8 pb-4 border-b border-stone-100">Basic Details</h2>
          
          <div className="space-y-8">
            <div>
              <label htmlFor="name" className="block text-[11px] font-medium uppercase tracking-[0.2em] text-stone-500 mb-3">Product Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange}
                placeholder="e.g. Cashmere Crew Sweater"
                className={`w-full px-4 py-3.5 bg-stone-50 border ${errors.name ? 'border-red-300 ring-1 ring-red-300' : 'border-stone-200/80'} rounded-lg text-sm outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-all font-normal placeholder:text-stone-400`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-2 font-medium">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-[11px] font-medium uppercase tracking-[0.2em] text-stone-500 mb-3">Description <span className="text-red-500">*</span></label>
              <textarea 
                id="description" 
                name="description" 
                rows={5}
                value={formData.description} 
                onChange={handleChange}
                placeholder="Detailed description of the product..."
                className={`w-full px-4 py-3.5 bg-stone-50 border ${errors.description ? 'border-red-300 ring-1 ring-red-300' : 'border-stone-200/80'} rounded-lg text-sm outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-all font-normal placeholder:text-stone-400 resize-none`}
              />
              {errors.description && <p className="text-red-500 text-xs mt-2 font-medium">{errors.description}</p>}
            </div>
            
            <div className="flex flex-col gap-6">
              {/* Main Category */}
              <div>
                <label htmlFor="mainCategory" className="block text-[11px] font-medium uppercase tracking-[0.2em] text-stone-500 mb-3">Main Category <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select 
                    id="mainCategory" 
                    name="mainCategory" 
                    value={formData.mainCategory} 
                    onChange={handleChange}
                    className={`appearance-none w-full px-4 py-3.5 bg-stone-50 border ${errors.mainCategory ? 'border-red-300 ring-1 ring-red-300' : 'border-stone-200/80'} rounded-lg text-sm outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-all font-normal ${formData.mainCategory ? 'text-stone-900' : 'text-stone-400'}`}
                  >
                    <option value="" disabled>Select main category</option>
                    {Object.keys(categoryConfig).map(mainCat => (
                      <option key={mainCat} value={mainCat}>{mainCat.charAt(0).toUpperCase() + mainCat.slice(1)}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-stone-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
                {errors.mainCategory && <p className="text-red-500 text-xs mt-2 font-medium">{errors.mainCategory}</p>}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-[11px] font-medium uppercase tracking-[0.2em] text-stone-500 mb-3">Category <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select 
                    id="category" 
                    name="category" 
                    value={formData.category} 
                    onChange={handleChange}
                    disabled={!formData.mainCategory}
                    className={`appearance-none w-full px-4 py-3.5 bg-stone-50 border ${errors.category ? 'border-red-300 ring-1 ring-red-300' : 'border-stone-200/80'} rounded-lg text-sm outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-all font-normal ${!formData.mainCategory ? 'opacity-50 cursor-not-allowed' : ''} ${formData.category ? 'text-stone-900' : 'text-stone-400'}`}
                  >
                    <option value="" disabled>Select category</option>
                    {formData.mainCategory && Object.keys((categoryConfig as any)[formData.mainCategory] || {}).map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-stone-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
                {errors.category && <p className="text-red-500 text-xs mt-2 font-medium">{errors.category}</p>}
              </div>

              {/* Subcategory */}
              <div>
                <label htmlFor="subcategory" className="block text-[11px] font-medium uppercase tracking-[0.2em] text-stone-500 mb-3">Subcategory <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select 
                    id="subcategory" 
                    name="subcategory" 
                    value={formData.subcategory} 
                    onChange={handleChange}
                    disabled={!formData.category}
                    className={`appearance-none w-full px-4 py-3.5 bg-stone-50 border ${errors.subcategory ? 'border-red-300 ring-1 ring-red-300' : 'border-stone-200/80'} rounded-lg text-sm outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-all font-normal ${!formData.category ? 'opacity-50 cursor-not-allowed' : ''} ${formData.subcategory ? 'text-stone-900' : 'text-stone-400'}`}
                  >
                    <option value="" disabled>Select subcategory</option>
                    {formData.mainCategory && formData.category && (categoryConfig as any)[formData.mainCategory]?.[formData.category]?.map((subcat: string) => (
                      <option key={subcat} value={subcat}>{subcat.charAt(0).toUpperCase() + subcat.slice(1)}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-stone-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
                {errors.subcategory && <p className="text-red-500 text-xs mt-2 font-medium">{errors.subcategory}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Inventory */}
        <div className="w-full lg:w-1/3 flex flex-col gap-8">
          
          <div className="bg-white rounded-xl border border-stone-200/60 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] p-8">
            <h2 className="text-lg font-serif text-stone-900 mb-8 pb-4 border-b border-stone-100">Media</h2>
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-[0.2em] text-stone-500 mb-3">Product Image</label>
              
              <label className={`cursor-pointer flex justify-center items-center py-4 px-4 bg-stone-50 border border-dashed border-stone-300 rounded-lg text-xs font-medium uppercase tracking-widest text-stone-500 hover:bg-stone-100 hover:border-stone-400 hover:text-stone-900 transition-all ${isUploading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="hidden" 
                  disabled={isUploading}
                />
                <span className="flex items-center gap-2">
                  {isUploading ? (
                    <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Uploading via Cloudinary...</>
                  ) : 'Select Image File'}
                </span>
              </label>

              {formData.image ? (
                <div className="relative mt-6 aspect-square w-full rounded-xl overflow-hidden border border-stone-200/60 shadow-inner group bg-stone-100">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      className="text-[10px] font-medium uppercase tracking-widest text-white bg-black/80 px-5 py-2.5 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-6 aspect-square w-full rounded-xl border border-stone-200/60 border-dashed bg-stone-50 flex items-center justify-center">
                  <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium">No Image Uploaded</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200/60 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] p-8">
            <h2 className="text-lg font-serif text-stone-900 mb-8 pb-4 border-b border-stone-100">Attributes</h2>
            
            <div className="space-y-8">
              <div>
                <label htmlFor="price" className="block text-[11px] font-medium uppercase tracking-[0.2em] text-stone-500 mb-3">Price (₹) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-stone-400 font-medium">₹</span>
                  </div>
                  <input 
                    type="number" 
                    step="0.01"
                    id="price" 
                    name="price" 
                    value={formData.price} 
                    onChange={handleChange}
                    placeholder="0.00"
                    className={`w-full pl-9 pr-4 py-3.5 bg-stone-50 border ${errors.price ? 'border-red-300 ring-1 ring-red-300' : 'border-stone-200/80'} rounded-lg text-sm outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-all font-normal placeholder:text-stone-400`}
                  />
                </div>
                {errors.price && <p className="text-red-500 text-xs mt-2 font-medium">{errors.price}</p>}
              </div>

              <div>
                <label htmlFor="stock" className="block text-[11px] font-medium uppercase tracking-[0.2em] text-stone-500 mb-3">Stock Quantity <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  id="stock" 
                  name="stock" 
                  value={formData.stock} 
                  onChange={handleChange}
                  placeholder="e.g. 50"
                  className={`w-full px-4 py-3.5 bg-stone-50 border ${errors.stock ? 'border-red-300 ring-1 ring-red-300' : 'border-stone-200/80'} rounded-lg text-sm outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-all font-normal placeholder:text-stone-400`}
                />
                {errors.stock && <p className="text-red-500 text-xs mt-2 font-medium">{errors.stock}</p>}
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting || isUploading}
            className="w-full bg-stone-900 text-white px-6 py-4.5 text-[11px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-stone-800 transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.39)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Publishing...
              </>
            ) : 'Publish Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
