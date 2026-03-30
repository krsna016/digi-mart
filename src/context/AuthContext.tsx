"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/utils/api';

export interface User {
  _id: string; // Match MongoDB _id
  name: string;
  email: string;
  role?: 'user' | 'admin';
  token?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  error: string | null;
  isLoading: boolean;
  getUserProfile: () => Promise<void>;
  updateProfile: (data: { name?: string; email?: string; password?: string }) => Promise<void>;
  addAddress: (addressData: Partial<Address>) => Promise<Address[]>;
  getAddresses: () => Promise<Address[]>;
  updateAddress: (id: string, addressData: Partial<Address>) => Promise<Address[]>;
  deleteAddress: (id: string) => Promise<Address[]>;
}

export interface Address {
  _id: string;
  fullName: string;
  phone: string;
  pincode: string;
  addressLine: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('digimart_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        
        // Restore admin cookie for middleware if it's missing but user is admin
        if (parsedUser.role === 'admin' && parsedUser.token) {
          const hasCookie = document.cookie.includes('admin_token=');
          if (!hasCookie) {
            document.cookie = `admin_token=${parsedUser.token}; path=/; max-age=86400; SameSite=None; Secure`;
          }
        }
      } catch (e) {
        console.error('Failed to parse user from local storage');
      }
    }
    setIsLoaded(true);
  }, []);

  // Persist user to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      if (user) {
        console.log(`[Auth] Persisting user to storage: ${user.email}`);
        localStorage.setItem('digimart_user', JSON.stringify(user));
      } else if (isLoaded && !user) {
        // Only remove if we are sure the user is explicitly logged out
        // and we are not in a loading/initializing state
        console.warn('[Auth] No user in state, storage remains as-is unless explicitly cleared');
      }
    }
  }, [user, isLoaded]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(`[Auth] Attempting login for: ${email}`);
      const data = await api.post('/auth/login', { email, password });
      console.log('[Auth] Login successful');
      setUser(data);
      
      // Set admin cookie if user is admin for middleware protection
      if (data.role === 'admin') {
        document.cookie = `admin_token=${data.token}; path=/; max-age=86400; SameSite=None; Secure`;
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('digimart_user');
    // Clear admin cookie
    document.cookie = 'admin_token=; path=/; max-age=0; SameSite=None; Secure';
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.post('/auth/signup', { name, email, password });
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserProfile = async () => {
    if (!user?.token) return;
    
    setIsLoading(true);
    try {
      const data = await api.get('/auth/profile');
      // Merge current token with fetched data
      setUser({ ...data, token: user.token });
    } catch (err: any) {
      console.warn('[Auth] Profile fetch error:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: { name?: string; email?: string; password?: string }) => {
    if (!user?.token) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.put('/auth/profile', profileData);
      // Update local storage and state with new details (keeping token)
      const updatedUser = { ...data, token: user.token };
      setUser(updatedUser);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const addAddress = async (addressData: Partial<Address>) => {
    if (!user?.token) return [];
    try {
      const data = await api.post('/user/address', addressData);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const getAddresses = async (): Promise<Address[]> => {
    if (!user?.token) return [];
    try {
      const data = await api.get('/user/address');
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateAddress = async (id: string, addressData: Partial<Address>) => {
    if (!user?.token) return [];
    try {
      const data = await api.put(`/user/address/${id}`, addressData);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteAddress = async (id: string) => {
    if (!user?.token) return [];
    try {
      const data = await api.delete(`/user/address/${id}`);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ 
      user, login, logout, register, isAuthenticated, isAdmin, error, isLoading, getUserProfile, updateProfile,
      addAddress, getAddresses, updateAddress, deleteAddress
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
