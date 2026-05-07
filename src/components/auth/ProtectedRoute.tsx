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
        console.log('ProtectedRoute: No user found, redirecting to login');
        router.push('/login');
      } else if (adminOnly) {
        const adminEmails = ['admin@prinsora.com', 'poovarasanj@gmail.com'];
        const userEmail = user.email.toLowerCase();
        const isAdmin = adminEmails.includes(userEmail);
        
        console.log(`ProtectedRoute: User ${userEmail}, isAdmin: ${isAdmin}`);
        if (!isAdmin) {
          console.log('ProtectedRoute: Access denied, redirecting to home');
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
    const adminEmails = ['admin@prinsora.com', 'poovarasanj@gmail.com'];
    const isAdmin = adminEmails.includes(user.email.toLowerCase());
    if (!isAdmin) return null;
  }

  return <>{children}</>;
}
