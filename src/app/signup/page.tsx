'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Gem, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const GOLD = 'linear-gradient(135deg, #8B5E1A 0%, #D4A843 28%, #F5D47A 50%, #C8881E 72%, #8B5E1A 100%)';
const BTN_GOLD = 'linear-gradient(135deg, hsl(38 70% 42%) 0%, hsl(45 80% 55%) 100%)';

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    const res = await signup(name, email, password, phone);
    setLoading(false);
    if (res.success) {
      router.push('/');
    } else {
      setError(res.error || 'Signup failed');
    }
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid hsl(45 70% 55% / 0.3)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#f5f0e8',
    fontSize: '15px',
    outline: 'none',
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-10" style={{ background: '#0f0805' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 40%, hsl(38 60% 25% / 0.15), transparent)' }} />

      <motion.div
        className="w-full max-w-md mx-4"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div
          className="rounded-2xl p-10"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid hsl(45 70% 55% / 0.2)',
            boxShadow: '0 0 60px hsl(45 70% 55% / 0.06)',
          }}
        >
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <Gem className="w-7 h-7" style={{ color: 'hsl(45 70% 55%)' }} />
              <span className="font-serif text-2xl font-semibold" style={{ color: 'hsl(45 70% 55%)' }}>Prinsora</span>
            </Link>
            <h1 className="text-3xl font-serif font-medium mb-2" style={{ background: GOLD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Join Prinsora
            </h1>
            <p className="text-sm" style={{ color: 'hsl(38 30% 60%)' }}>Create your account and discover luxury</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs tracking-widest uppercase mb-2 font-medium" style={{ color: 'hsl(45 70% 55%)' }}>Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Aanya Sharma" style={inputStyle} required />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase mb-2 font-medium" style={{ color: 'hsl(45 70% 55%)' }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle} required />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase mb-2 font-medium" style={{ color: 'hsl(45 70% 55%)' }}>Phone Number</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" style={inputStyle} required />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase mb-2 font-medium" style={{ color: 'hsl(45 70% 55%)' }}>Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  style={{ ...inputStyle, paddingRight: '44px' }}
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'hsl(45 70% 55% / 0.6)' }}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase mb-2 font-medium" style={{ color: 'hsl(45 70% 55%)' }}>Confirm Password</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" style={inputStyle} required />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg" style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', color: '#f87171' }}>
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full font-semibold text-sm tracking-wider mt-2"
              style={{ background: BTN_GOLD, color: '#1a0f08' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Creating Account…' : 'Create Account'}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm" style={{ color: 'hsl(38 30% 55%)' }}>
              Already have an account?{' '}
              <Link href="/login" className="font-medium underline underline-offset-4" style={{ color: 'hsl(45 70% 60%)' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
