'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

type AuthMode = 'login' | 'signup' | 'forgot';

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    if (mode === 'forgot') {
      setMode('login');
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary">
        <div className="absolute inset-0">
          <AppImage
            src="https://img.rocket.new/generatedImages/rocket_gen_img_19d2be207-1777786856288.png"
            alt="Prinsora fashion collection — elegant women's clothing"
            fill
            className="object-cover opacity-40" />
          
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-transparent" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link href="/" className="flex items-center gap-3">
            <AppLogo size={40} />
            <span className="font-display text-2xl font-semibold">Prinsora</span>
          </Link>
          <div>
            <h2 className="font-display text-4xl font-semibold leading-tight mb-4">
              Grace in<br />Every Thread
            </h2>
            <p className="text-white/70 text-lg leading-relaxed max-w-sm">
              Discover curated ethnic and western wear crafted for the modern Indian woman.
            </p>
            <div className="mt-8 flex items-center gap-4">
              {[
              { label: '50K+', desc: 'Happy Customers' },
              { label: '2K+', desc: 'Products' },
              { label: '4.8★', desc: 'Rating' }].
              map((stat) =>
              <div key={stat.label} className="text-center">
                  <p className="font-display text-2xl font-bold text-accent">{stat.label}</p>
                  <p className="text-xs text-white/60 mt-0.5">{stat.desc}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10">
        {/* Mobile Logo */}
        <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
          <AppLogo size={32} />
          <span className="font-display text-xl font-semibold text-primary">Prinsora</span>
        </Link>

        <div className="w-full max-w-md">
          {/* Mode Switcher */}
          {mode !== 'forgot' &&
          <div className="flex bg-secondary rounded-full p-1 mb-8">
              <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              mode === 'login' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`
              }>
              
                Sign In
              </button>
              <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              mode === 'signup' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'}`
              }>
              
                Create Account
              </button>
            </div>
          }

          <div className="animate-fade-in-up">
            <h1 className="font-display text-3xl font-semibold text-primary mb-1">
              {mode === 'login' ? 'Welcome back' : mode === 'signup' ? 'Join Prinsora' : 'Reset Password'}
            </h1>
            <p className="text-muted-foreground text-sm mb-8">
              {mode === 'login' ? 'Sign in to your account to continue shopping' :
              mode === 'signup' ? 'Create your account and start exploring' : "Enter your email and we'll send you a reset link"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' &&
              <div>
                  <label className="block text-sm font-medium mb-1.5">Full Name</label>
                  <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Priya Sharma"
                  className="w-full px-4 py-3.5 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all" />
                
                </div>
              }

              <div>
                <label className="block text-sm font-medium mb-1.5">Email Address</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="priya@example.com"
                  className="w-full px-4 py-3.5 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all" />
                
              </div>

              {mode === 'signup' &&
              <div>
                  <label className="block text-sm font-medium mb-1.5">Phone Number</label>
                  <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3.5 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all" />
                
                </div>
              }

              {mode !== 'forgot' &&
              <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium">Password</label>
                    {mode === 'login' &&
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs text-accent hover:underline">
                    
                        Forgot password?
                      </button>
                  }
                  </div>
                  <div className="relative">
                    <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-3.5 pr-12 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all" />
                  
                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    
                      <Icon name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={18} />
                    </button>
                  </div>
                </div>
              }

              {mode === 'signup' &&
              <div>
                  <label className="block text-sm font-medium mb-1.5">Confirm Password</label>
                  <input
                  required
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all" />
                
                </div>
              }

              {mode === 'signup' &&
              <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" required className="mt-0.5 accent-accent" />
                  <span className="text-xs text-muted-foreground leading-relaxed">
                    I agree to the{' '}
                    <Link href="/" className="text-accent hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/" className="text-accent hover:underline">Privacy Policy</Link>
                  </span>
                </label>
              }

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 mt-2">
                
                {isLoading ?
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> :
                mode === 'login' ? 'Sign In' :
                mode === 'signup'? 'Create Account': 'Send Reset Link'
                }
              </button>

              {mode === 'forgot' &&
              <button
                type="button"
                onClick={() => setMode('login')}
                className="w-full py-3 border border-border rounded-full text-sm font-medium hover:bg-secondary transition-colors flex items-center justify-center gap-2">
                
                  <Icon name="ArrowLeftIcon" size={16} />
                  Back to Sign In
                </button>
              }
            </form>

            {mode !== 'forgot' &&
            <>
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">or continue with</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2.5 py-3 border border-border rounded-xl text-sm font-medium hover:bg-secondary transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                  </button>
                  <button className="flex items-center justify-center gap-2.5 py-3 border border-border rounded-xl text-sm font-medium hover:bg-secondary transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                    Facebook
                  </button>
                </div>
              </>
            }
          </div>
        </div>
      </div>
    </div>);

}