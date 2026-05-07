'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (adminOnly) {
        // Simple admin check: Check if email is a specific admin email
        // In a real app, you'd use custom claims or a database role
        const isAdmin =
          user.email === 'admin@prinsora.com' || user.email === 'poovarasanj@gmail.com'; // Add your admin emails here
        if (!isAdmin) {
          router.push('/');
        }
      }
    }
  }, [user, loading, router, adminOnly]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <Loader2 className="w-10 h-10 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) return null;

  if (adminOnly) {
    const isAdmin = user.email === 'admin@prinsora.com' || user.email === 'poovarasanj@gmail.com';
    if (!isAdmin) return null;
  }

  return <>{children}</>;
}
