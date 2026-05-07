'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export interface User {
  name: string;
  email: string;
  uid: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (
    name: string,
    email: string,
    password: string,
    phone: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      if (!email || !password) return { success: false, error: 'Please fill all fields' };

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const u = userCredential.user;

      setUser({
        uid: u.uid,
        name: u.displayName || 'User',
        email: u.email || '',
      });

      return { success: true };
    } catch (error: any) {
      console.error('Login Error:', error);
      let message = 'Login failed';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = 'Invalid email or password';
      } else if (error.code === 'auth/invalid-credential') {
        message = 'Invalid credentials';
      }
      return { success: false, error: message };
    }
  };

  const signup = async (name: string, email: string, password: string, phone: string) => {
    try {
      if (!name || !email || !password || !phone)
        return { success: false, error: 'Please fill all fields' };
      if (password.length < 6)
        return { success: false, error: 'Password must be at least 6 characters' };

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const u = userCredential.user;

      // Update Firebase profile with name
      await updateProfile(u, { displayName: name });

      const userData: User = { uid: u.uid, name, email, phone };

      // Sync with Google Sheets (Optional but keeping since it was there)
      try {
        fetch('/api/auth/sync-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });
      } catch (e) {
        console.error('Sync failed', e);
      }

      setUser(userData);
      return { success: true };
    } catch (error: any) {
      console.error('Signup Error:', error);
      let message = 'Signup failed';
      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already registered';
      }
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('prinsora_cart');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
