import { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  name: string;
  email: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, phone: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('prinsora_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const login = async (email: string, password: string) => {
    if (!email || !password) return { success: false, error: 'Please fill all fields' };
    if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters' };
    await new Promise(r => setTimeout(r, 800));
    const name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const u: User = { name, email };
    
    // Sync with Google Sheets
    try {
      fetch('/api/auth/sync-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(u),
      });
    } catch (e) { console.error('Sync failed', e); }

    setUser(u);
    localStorage.setItem('prinsora_user', JSON.stringify(u));
    return { success: true };
  };

  const signup = async (name: string, email: string, password: string, phone: string) => {
    if (!name || !email || !password || !phone) return { success: false, error: 'Please fill all fields' };
    if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters' };
    await new Promise(r => setTimeout(r, 800));
    const u: User = { name, email, phone };

    // Sync with Google Sheets
    try {
      await fetch('/api/auth/sync-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(u),
      });
    } catch (e) { console.error('Sync failed', e); }

    setUser(u);
    localStorage.setItem('prinsora_user', JSON.stringify(u));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('prinsora_user');
    localStorage.removeItem('prinsora_cart');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
