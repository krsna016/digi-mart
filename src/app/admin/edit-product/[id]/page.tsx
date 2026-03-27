"use client";

import { api } from '@/utils/api';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [product, setProduct] = useState<any>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState('');
  const [gender, setGender] = useState('');
  const [category, setCategory] = useState('');
  const [onSale, setOnSale] = useState(false);
  const [discountPrice, setDiscountPrice] = useState('');

  
  const [categories, setCategories] = useState<any>({ men: {}, women: {}, kids: {} });
  const [isCatLoading, setIsCatLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{title: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const data = await api.get(`/products/${id}`);
        
        if (data) {
          setProduct(data);
        }
      } catch (err: any) {
        setToastMessage({ title: `Error: ${err.message}`, type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.get('/categories');
        const transformed: any = { men: {}, women: {}, kids: {} };
        data.forEach((cat: any) => {
          if (transformed[cat.gender]) {
            transformed[cat.gender][cat.group] = cat.items;
          }
        });
        setCategories(transformed);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setIsCatLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setDescription(product.description || '');
      setPrice(product.price !== undefined ? String(product.price) : '');
      setStock(product.stock !== undefined ? String(product.stock) : '');
      setImage(product.image || '');
      setGender(product.gender || '');
      setCategory(product.category || '');
      setOnSale(product.onSale || false);
      setDiscountPrice(product.discountPrice !== undefined && product.discountPrice !== null ? String(product.discountPrice) : '');

    }
  }, [product]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Product name is required';
    if (!gender.trim()) newErrors.gender = 'Gender is required';
    if (!category.trim()) newErrors.category = 'Category is required';
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = 'Please enter a valid positive price';
    }
    if (onSale && (!discountPrice || isNaN(Number(discountPrice)) || Number(discountPrice) >= Number(price))) {
      newErrors.discountPrice = 'Discount price must be less than regular price';
    }
    if (!stock || isNaN(Number(stock)) || Number(stock) < 0) {
      newErrors.stock = 'Please enter a valid stock integer, 0 or above';
    }
    if (!description.trim()) newErrors.description = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleInputChange = (field: string, val: string) => {
    if (field === 'name') setName(val);
    else if (field === 'description') setDescription(val);
    else if (field === 'price') setPrice(val);
    else if (field === 'stock') setStock(val);
    
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined as any }));
  };

  const handleGenderChange = (val: string) => {
    setGender(val);
    setCategory('');
    if (errors.gender) setErrors(prev => ({ ...prev, gender: undefined as any }));
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
      setImage(json.secure_url);
      setToastMessage({ title: 'Image securely uploaded!', type: 'success' });
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err: any) {
      setToastMessage({ title: err.message, type: 'error' });
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setToastMessage({ title: 'Please fix the errors in the form.', type: 'error' });
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        name: name.trim(),
        price: Number(price) || 0,
        description: description.trim(),
        image,
        gender,
        category,
        onSale,
        discountPrice: onSale ? Number(discountPrice) : null,
        stock: parseInt(stock, 10) || 0,
      };


      const updatedData = await api.put(`/products/${id}`, payload);
      console.log('Update Success Data:', updatedData);
      console.log('Update Success Data:', updatedData);

      setToastMessage({ title: 'Product successfully updated!', type: 'success' });
      
      setTimeout(() => {
        router.push('/admin/products');
      }, 1500);

    } catch (err: any) {
      setToastMessage({ title: err.message || 'An unexpected error occurred', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-8 w-8 text-stone-900" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-xs uppercase tracking-widest text-stone-400 font-medium">Fetching details...</span>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-serif tracking-tight text-stone-900 mb-2">Edit Product</h1>
          <p className="text-sm text-stone-500 font-normal">Make changes to the existing product data map.</p>
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
                value={name} 
                onChange={(e) => handleInputChange('name', e.target.value)}
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
                value={description} 
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Detailed description of the product..."
                className={`w-full px-4 py-3.5 bg-stone-50 border ${errors.description ? 'border-red-300 ring-1 ring-red-300' : 'border-stone-200/80'} rounded-lg text-sm outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-all font-normal placeholder:text-stone-400 resize-none`}
              />
              {errors.description && <p className="text-red-500 text-xs mt-2 font-medium">{errors.description}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gender */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-3">Gender</label>
                <div className="relative">
                  <select 
                    value={gender} 
                    onChange={(e) => handleGenderChange(e.target.value)}
                    className="w-full px-4 py-4 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:ring-1 focus:ring-stone-900 outline-none appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                  </select>
                </div>
                {errors.gender && <p className="text-red-500 text-xs mt-2">{errors.gender}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-3">Category</label>
                <div className="relative">
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    disabled={!gender || isCatLoading}
                    className="w-full px-4 py-4 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:ring-1 focus:ring-stone-900 outline-none appearance-none cursor-pointer disabled:opacity-50"
                  >
                    <option value="" disabled>{isCatLoading ? 'Loading...' : 'Select Category'}</option>
                    {gender && categories[gender] && Object.entries(categories[gender]).map(([group, cats]: [string, any]) => (
                      <optgroup key={group} label={group} className="font-bold text-stone-900 bg-stone-100">
                        {cats.map((cat: string) => (
                          <option key={cat} value={cat.toLowerCase().replace(/\s+/g, '')} className="font-normal bg-white">{cat}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                {errors.category && <p className="text-red-500 text-xs mt-2">{errors.category}</p>}
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Pricing & Inventory */}
        <div className="w-full lg:w-1/3 flex flex-col gap-8">
          
          <div className="bg-white rounded-xl border border-stone-200/60 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] p-8">
            <h2 className="text-lg font-serif text-stone-900 mb-8 pb-4 border-b border-stone-100">Media</h2>
            <div className="mb-6 p-4 bg-stone-50 rounded-lg border border-stone-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-900 mb-2 flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Image Guidelines
              </p>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                For a premium look, use portrait images with a <span className="text-stone-900 font-bold">3:4 aspect ratio</span> (e.g., 1200 x 1600 px). Other sizes will be automatically cropped to fit.
              </p>
            </div>
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

              {image ? (
                <div className="relative mt-6 aspect-square w-full rounded-xl overflow-hidden border border-stone-200/60 shadow-inner bg-stone-100 group">
                  <img src={image} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button"
                      onClick={() => setImage('')}
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
            <h2 className="text-lg font-serif text-stone-900 mb-8 pb-4 border-b border-stone-100">Pricing & Stock</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="price" className="block text-[11px] font-medium uppercase tracking-[0.2em] text-stone-500 mb-3">Regular Price (₹) <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  step="0.01"
                  id="price" 
                  name="price" 
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className={`w-full px-4 py-3.5 bg-stone-50 border ${errors.price ? 'border-red-300 ring-1 ring-red-300' : 'border-stone-200/80'} rounded-lg text-sm outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-all font-normal placeholder:text-stone-400`}
                />
                {errors.price && <p className="text-red-500 text-xs mt-2 font-medium">{errors.price}</p>}
              </div>

              <div className="flex items-center gap-3 py-2">
                <input 
                  type="checkbox" 
                  id="onSale" 
                  checked={onSale}
                  onChange={(e) => setOnSale(e.target.checked)}
                  className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                />
                <label htmlFor="onSale" className="text-[11px] font-medium uppercase tracking-[0.2em] text-stone-700 cursor-pointer">This product is on sale</label>
              </div>

              {onSale && (
                <div className="animate-fade-down duration-300">
                  <label htmlFor="discountPrice" className="block text-[11px] font-medium uppercase tracking-[0.2em] text-stone-500 mb-3">Discount Price (₹) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    step="0.01"
                    id="discountPrice" 
                    name="discountPrice" 
                    value={discountPrice} 
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    placeholder="0.00"
                    className={`w-full px-4 py-3.5 bg-stone-50 border ${errors.discountPrice ? 'border-red-300 ring-1 ring-red-300' : 'border-stone-200/80'} rounded-lg text-sm outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900 transition-all font-normal placeholder:text-stone-400`}
                  />
                  {errors.discountPrice && <p className="text-red-500 text-xs mt-2 font-medium">{errors.discountPrice}</p>}
                </div>
              )}

              <div>
                <label htmlFor="stock" className="block text-[11px] font-medium uppercase tracking-[0.2em] text-stone-500 mb-3">Stock Quantity <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  id="stock" 
                  name="stock" 
                  value={stock} 
                  onChange={(e) => setStock(e.target.value)}
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
            className="w-full bg-stone-900 text-white px-6 py-4.5 text-[11px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-stone-800 transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.39)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
          </button>

        </div>
      </form>
    </div>
  );
}
