'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Smartphone, CheckCircle2, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/data/products';
import AppImage from '@/components/ui/AppImage';

const GOLD =
  'linear-gradient(135deg, #8B5E1A 0%, #D4A843 28%, #F5D47A 50%, #C8881E 72%, #8B5E1A 100%)';
const BTN_GOLD = 'linear-gradient(135deg, hsl(38 70% 42%) 0%, hsl(45 80% 55%) 100%)';

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid hsl(45 70% 55% / 0.3)',
  borderRadius: '8px',
  padding: '12px 14px',
  color: '#f5f0e8',
  fontSize: '14px',
  outline: 'none',
};

declare global {
  interface Window {
    Cashfree: any;
  }
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [payMethod, setPayMethod] = useState<'card' | 'upi'>('card');
  const [step, setStep] = useState<'address' | 'payment' | 'success'>('address');
  const [placing, setPlacing] = useState(false);
  const [orderId] = useState(() => 'PRN-' + Math.floor(2600 + Math.random() * 100));

  const [address, setAddress] = useState({
    name: user?.name || '',
    phone: '',
    line1: '',
    city: '',
    state: '',
    pin: '',
  });
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', holder: user?.name || '' });
  const [upi, setUpi] = useState('');
  const [cashfree, setCashfree] = useState<any>(null);

  // Coupon States
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');


  const shipping = total >= 25000 ? 0 : 499;
  const tax = Math.round(total * 0.18);
  
  // Calculate discount
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discountAmount = Math.round(total * (appliedCoupon.value / 100));
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  const grandTotal = Math.max(0, total + shipping + tax - discountAmount);


  useEffect(() => {
    if (typeof window !== 'undefined' && window.Cashfree) {
      setCashfree(window.Cashfree({ mode: 'sandbox' }));
    }
  }, []);

  if (!user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#0f0805' }}
      >
        <div className="text-center">
          <p className="text-xl font-serif mb-4" style={{ color: 'hsl(45 70% 55%)' }}>
            Please sign in to checkout
          </p>
          <Link href="/login">
            <button
              className="px-6 py-3 rounded-full text-sm font-semibold"
              style={{ background: BTN_GOLD, color: '#1a0f08' }}
            >
              Sign In
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0 && step !== 'success') {
    router.push('/cart');
    return null;
  }

  const handlePlaceOrder = async () => {
    if (!address.phone || !address.line1 || !address.city) {
      alert('Please fill in all delivery details');
      return;
    }

    setPlacing(true);
    try {
      // 1. Create Cashfree Order on Backend
      const createOrderRes = await fetch('/api/checkout/create-cashfree-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: grandTotal,
          customerName: address.name,
          customerEmail: user?.email,
          customerPhone: address.phone,
          customerId: user?.id || 'guest_' + Date.now(),
        }),
      });

      const orderData = await createOrderRes.json();
      if (!orderData.success) throw new Error(orderData.error || 'Failed to initialize payment');

      // 2. Open Cashfree Checkout Modal
      const checkoutOptions = {
        paymentSessionId: orderData.paymentSessionId,
        redirectTarget: '_modal', // Open as a modal
      };

      if (!cashfree) {
        throw new Error('Cashfree SDK not loaded. Please refresh the page.');
      }

      cashfree.checkout(checkoutOptions).then(async (result: any) => {
        if (result.error) {
          alert('Payment Failed: ' + result.error.message);
          setPlacing(false);
          return;
        }

        if (result.redirect) {
          // This shouldn't happen with _modal but handled for safety
          console.log('Payment redirecting...');
          return;
        }

        // 3. Payment Successful/Completed -> Save to Google Sheets
        const response = await fetch('/api/checkout/place-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cartItems: items,
            address: {
              fullName: address.name,
              phone: address.phone,
              email: user?.email,
              address: address.line1,
              city: address.city,
              state: address.state,
              pincode: address.pin,
            },
            paymentMethod: 'CASHFREE_SANDBOX',
            total: grandTotal,
            cashfreeOrderId: orderData.orderId,
          }),
        });

        const saveResult = await response.json();
        if (saveResult.success) {
          clearCart();
          setStep('success');
        } else {
          alert('Order recorded failed but payment was successful. Please contact support.');
        }
        setPlacing(false);
      });
    } catch (err: any) {
      console.error('Order error:', err);
      alert('Error: ' + err.message);
      setPlacing(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponInput) return;
    setValidatingCoupon(true);
    setCouponError('');
    try {
      const res = await fetch('/api/checkout/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput }),
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon(data.promo);
        setCouponInput('');
      } else {
        setCouponError(data.error || 'Invalid code');
      }
    } catch (err) {
      setCouponError('Error validating coupon');
    } finally {
      setValidatingCoupon(false);
    }
  };


  const formatCardNumber = (v: string) =>
    v
      .replace(/\D/g, '')
      .slice(0, 16)
      .replace(/(.{4})/g, '$1 ')
      .trim();

  const formatExpiry = (v: string) =>
    v
      .replace(/\D/g, '')
      .slice(0, 4)
      .replace(/(\d{2})(\d)/, '$1/$2');

  return (
    <div className="min-h-screen" style={{ background: '#0f0805' }}>
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatePresence mode="wait">
            {step === 'success' ? (
              <motion.div
                key="success"
                className="max-w-lg mx-auto text-center py-16"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
                >
                  <CheckCircle2
                    className="w-20 h-20 mx-auto mb-6"
                    style={{ color: 'hsl(45 70% 55%)' }}
                  />
                </motion.div>
                <h2
                  className="text-4xl font-serif font-medium mb-3"
                  style={{
                    background: GOLD,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Order Confirmed!
                </h2>
                <p className="text-lg mb-2" style={{ color: '#f5f0e8' }}>
                  Thank you, {user.name}!
                </p>
                <p className="text-sm mb-2" style={{ color: 'hsl(38 30% 55%)' }}>
                  Your order{' '}
                  <span style={{ color: 'hsl(45 70% 60%)', fontFamily: 'monospace' }}>
                    {orderId}
                  </span>{' '}
                  has been placed.
                </p>
                <p className="text-sm mb-10" style={{ color: 'hsl(38 30% 50%)' }}>
                  You\'ll receive a confirmation email at {user.email}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/">
                    <motion.button
                      className="px-8 py-3 rounded-full text-sm font-semibold"
                      style={{ background: BTN_GOLD, color: '#1a0f08' }}
                      whileHover={{ scale: 1.02 }}
                    >
                      Back to Home
                    </motion.button>
                  </Link>
                  <Link href="/shop">
                    <motion.button
                      className="px-8 py-3 rounded-full text-sm font-medium"
                      style={{
                        border: '1px solid hsl(45 70% 55% / 0.4)',
                        color: 'hsl(45 70% 55%)',
                      }}
                      whileHover={{ scale: 1.02 }}
                    >
                      Continue Shopping
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            ) : placing && step === 'payment' ? (
              <motion.div
                key="placing"
                className="max-w-lg mx-auto text-center py-32"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="relative w-20 h-20 mx-auto mb-8">
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-accent/20"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  </div>
                </div>
                <h2
                  className="text-2xl font-serif font-medium mb-3"
                  style={{ color: '#f5f0e8' }}
                >
                  Finalizing Order
                </h2>
                <p className="text-sm" style={{ color: 'hsl(38 30% 55%)' }}>
                  Please wait while we secure your luxury selection...
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="checkout"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <Link href="/cart">
                    <button
                      className="flex items-center gap-1 text-sm"
                      style={{ color: 'hsl(45 70% 55%)' }}
                    >
                      <ArrowLeft className="w-4 h-4" /> Cart
                    </button>
                  </Link>
                  <span style={{ color: 'hsl(38 30% 40%)' }}>/</span>
                  <h1
                    className="text-3xl font-serif font-medium"
                    style={{
                      background: GOLD,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Checkout
                  </h1>
                </div>

                <div className="grid lg:grid-cols-[1fr_360px] gap-10">
                  {/* Left: Forms */}
                  <div className="flex flex-col gap-8">
                    {/* Step Tabs */}
                    <div className="flex gap-4">
                      {(['address', 'payment'] as const).map((s, i) => (
                        <button
                          key={s}
                          onClick={() =>
                            step === 'payment' && s === 'address' && setStep('address')
                          }
                          className="flex items-center gap-2 text-sm font-medium pb-2"
                          style={{
                            color: step === s ? 'hsl(45 70% 55%)' : 'hsl(38 30% 45%)',
                            borderBottom: `2px solid ${step === s ? 'hsl(45 70% 55%)' : 'transparent'}`,
                          }}
                        >
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{
                              background: step === s ? BTN_GOLD : 'rgba(255,255,255,0.06)',
                              color: step === s ? '#1a0f08' : 'hsl(38 30% 45%)',
                            }}
                          >
                            {i + 1}
                          </span>
                          {s === 'address' ? 'Delivery Address' : 'Payment'}
                        </button>
                      ))}
                    </div>

                    {step === 'address' && (
                      <motion.div
                        key="addr"
                        className="flex flex-col gap-5 p-7 rounded-2xl"
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid hsl(45 70% 55% / 0.2)',
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <h3 className="font-serif text-lg" style={{ color: '#f5f0e8' }}>
                          Delivery Address
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                            <label
                              className="block text-xs tracking-widest uppercase mb-1.5 font-medium"
                              style={{ color: 'hsl(45 70% 55%)' }}
                            >
                              Full Name
                            </label>
                            <input
                              value={address.name}
                              onChange={(e) => setAddress({ ...address, name: e.target.value })}
                              placeholder="Your name"
                              style={inputStyle}
                            />
                          </div>
                          <div className="col-span-2">
                            <label
                              className="block text-xs tracking-widest uppercase mb-1.5 font-medium"
                              style={{ color: 'hsl(45 70% 55%)' }}
                            >
                              Phone Number
                            </label>
                            <input
                              value={address.phone}
                              onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                              placeholder="+91 XXXXX XXXXX"
                              style={inputStyle}
                            />
                          </div>
                          <div className="col-span-2">
                            <label
                              className="block text-xs tracking-widest uppercase mb-1.5 font-medium"
                              style={{ color: 'hsl(45 70% 55%)' }}
                            >
                              Address Line
                            </label>
                            <input
                              value={address.line1}
                              onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                              placeholder="House / Street / Area"
                              style={inputStyle}
                            />
                          </div>
                          <div>
                            <label
                              className="block text-xs tracking-widest uppercase mb-1.5 font-medium"
                              style={{ color: 'hsl(45 70% 55%)' }}
                            >
                              City
                            </label>
                            <input
                              value={address.city}
                              onChange={(e) => setAddress({ ...address, city: e.target.value })}
                              placeholder="Mumbai"
                              style={inputStyle}
                            />
                          </div>
                          <div>
                            <label
                              className="block text-xs tracking-widest uppercase mb-1.5 font-medium"
                              style={{ color: 'hsl(45 70% 55%)' }}
                            >
                              State
                            </label>
                            <input
                              value={address.state}
                              onChange={(e) => setAddress({ ...address, state: e.target.value })}
                              placeholder="Maharashtra"
                              style={inputStyle}
                            />
                          </div>
                          <div>
                            <label
                              className="block text-xs tracking-widest uppercase mb-1.5 font-medium"
                              style={{ color: 'hsl(45 70% 55%)' }}
                            >
                              PIN Code
                            </label>
                            <input
                              value={address.pin}
                              onChange={(e) =>
                                setAddress({ ...address, pin: e.target.value.slice(0, 6) })
                              }
                              placeholder="400001"
                              style={inputStyle}
                            />
                          </div>
                        </div>
                        <motion.button
                          onClick={() => setStep('payment')}
                          className="w-full py-3.5 rounded-full font-semibold text-sm mt-2"
                          style={{ background: BTN_GOLD, color: '#1a0f08' }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Continue to Payment
                        </motion.button>
                      </motion.div>
                    )}

                    {step === 'payment' && (
                      <motion.div
                        key="pay"
                        className="flex flex-col gap-5 p-7 rounded-2xl"
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid hsl(45 70% 55% / 0.2)',
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <h3 className="font-serif text-lg" style={{ color: '#f5f0e8' }}>
                          Payment Method
                        </h3>

                        {/* Method Toggle */}
                        <div className="flex gap-3">
                          {(
                            [
                              ['card', CreditCard, 'Card'],
                              ['upi', Smartphone, 'UPI'],
                            ] as const
                          ).map(([method, Icon, label]) => (
                            <button
                              key={method}
                              onClick={() => setPayMethod(method as 'card' | 'upi')}
                              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all"
                              style={
                                payMethod === method
                                  ? {
                                      background: BTN_GOLD,
                                      color: '#1a0f08',
                                      border: '1.5px solid transparent',
                                    }
                                  : {
                                      border: '1.5px solid hsl(45 70% 55% / 0.3)',
                                      color: 'hsl(45 70% 55%)',
                                      background: 'transparent',
                                    }
                              }
                            >
                              <Icon className="w-4 h-4" />
                              {label}
                            </button>
                          ))}
                        </div>

                        {payMethod === 'card' && (
                          <div className="flex flex-col gap-4">
                            <div>
                              <label
                                className="block text-xs tracking-widest uppercase mb-1.5 font-medium"
                                style={{ color: 'hsl(45 70% 55%)' }}
                              >
                                Card Number
                              </label>
                              <input
                                value={card.number}
                                onChange={(e) =>
                                  setCard({ ...card, number: formatCardNumber(e.target.value) })
                                }
                                placeholder="1234 5678 9012 3456"
                                maxLength={19}
                                style={inputStyle}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label
                                  className="block text-xs tracking-widest uppercase mb-1.5 font-medium"
                                  style={{ color: 'hsl(45 70% 55%)' }}
                                >
                                  Expiry
                                </label>
                                <input
                                  value={card.expiry}
                                  onChange={(e) =>
                                    setCard({ ...card, expiry: formatExpiry(e.target.value) })
                                  }
                                  placeholder="MM/YY"
                                  maxLength={5}
                                  style={inputStyle}
                                />
                              </div>
                              <div>
                                <label
                                  className="block text-xs tracking-widest uppercase mb-1.5 font-medium"
                                  style={{ color: 'hsl(45 70% 55%)' }}
                                >
                                  CVV
                                </label>
                                <input
                                  value={card.cvv}
                                  onChange={(e) =>
                                    setCard({
                                      ...card,
                                      cvv: e.target.value.replace(/\D/g, '').slice(0, 3),
                                    })
                                  }
                                  placeholder="•••"
                                  type="password"
                                  maxLength={3}
                                  style={inputStyle}
                                />
                              </div>
                            </div>
                            <div>
                              <label
                                className="block text-xs tracking-widest uppercase mb-1.5 font-medium"
                                style={{ color: 'hsl(45 70% 55%)' }}
                              >
                                Cardholder Name
                              </label>
                              <input
                                value={card.holder}
                                onChange={(e) => setCard({ ...card, holder: e.target.value })}
                                placeholder="Name on card"
                                style={inputStyle}
                              />
                            </div>
                          </div>
                        )}

                        {payMethod === 'upi' && (
                          <div>
                            <label
                              className="block text-xs tracking-widest uppercase mb-1.5 font-medium"
                              style={{ color: 'hsl(45 70% 55%)' }}
                            >
                              UPI ID
                            </label>
                            <input
                              value={upi}
                              onChange={(e) => setUpi(e.target.value)}
                              placeholder="yourname@upi"
                              style={inputStyle}
                            />
                          </div>
                        )}

                        <div
                          className="flex items-center gap-2 text-xs mt-1"
                          style={{ color: 'hsl(38 30% 45%)' }}
                        >
                          <Lock className="w-3.5 h-3.5" style={{ color: 'hsl(45 70% 55%)' }} />
                          Demo mode — no real payment processed. All transactions are simulated.
                        </div>

                        <motion.button
                          onClick={handlePlaceOrder}
                          disabled={placing}
                          className="w-full py-3.5 rounded-full font-semibold text-sm flex items-center justify-center gap-2 mt-2"
                          style={{ background: BTN_GOLD, color: '#1a0f08' }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {placing ? (
                            <>
                              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              Processing…
                            </>
                          ) : (
                            <>Place Order · {formatPrice(grandTotal)}</>
                          )}
                        </motion.button>
                      </motion.div>
                    )}
                  </div>

                  {/* Order Summary */}
                  <div
                    className="h-fit rounded-2xl p-6 sticky top-24"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid hsl(45 70% 55% / 0.2)',
                    }}
                  >
                    <h3
                      className="font-serif text-lg font-medium mb-5"
                      style={{ color: '#f5f0e8' }}
                    >
                      Order Summary
                    </h3>
                    <div className="flex flex-col gap-3 mb-5">
                      {items.map((item) => (
                        <div key={`${item.id}-${item.size}`} className="flex gap-3">
                          <div className="w-12 h-14 rounded-lg overflow-hidden flex-shrink-0 relative">
                            <AppImage
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p
                              className="text-xs font-medium line-clamp-2"
                              style={{ color: '#f5f0e8' }}
                            >
                              {item.name}
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: 'hsl(38 30% 50%)' }}>
                              Size: {item.size} · Qty: {item.quantity}
                            </p>
                          </div>
                          <p
                            className="text-xs font-semibold flex-shrink-0"
                            style={{ color: 'hsl(45 75% 58%)' }}
                          >
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="h-px mb-4" style={{ background: 'hsl(45 70% 55% / 0.2)' }} />
                    
                    {/* Coupon Input */}
                    {!appliedCoupon ? (
                      <div className="mb-5">
                        <div className="flex gap-2">
                          <input 
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            placeholder="Promo Code"
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-accent/50"
                          />
                          <button 
                            onClick={handleApplyCoupon}
                            disabled={validatingCoupon || !couponInput}
                            className="px-4 py-2 rounded-lg bg-accent text-primary text-xs font-bold disabled:opacity-50"
                          >
                            {validatingCoupon ? '...' : 'Apply'}
                          </button>
                        </div>
                        {couponError && <p className="text-[10px] text-red-400 mt-1">{couponError}</p>}
                      </div>
                    ) : (
                      <div className="mb-5 flex justify-between items-center bg-accent/5 border border-accent/20 rounded-lg px-3 py-2">
                        <div>
                          <p className="text-[10px] text-accent font-bold uppercase tracking-wider">Applied Coupon</p>
                          <p className="text-sm text-white font-medium">{appliedCoupon.code}</p>
                        </div>
                        <button 
                          onClick={() => setAppliedCoupon(null)}
                          className="text-[10px] text-zinc-500 hover:text-white underline"
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    <div className="flex flex-col gap-2 text-sm mb-4">

                      <div className="flex justify-between">
                        <span style={{ color: 'hsl(38 30% 55%)' }}>Subtotal</span>
                        <span style={{ color: '#f5f0e8' }}>{formatPrice(total)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: 'hsl(38 30% 55%)' }}>Shipping</span>
                        <span style={{ color: shipping === 0 ? 'hsl(45 70% 55%)' : '#f5f0e8' }}>
                          {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: 'hsl(38 30% 55%)' }}>GST (18%)</span>
                        <span style={{ color: '#f5f0e8' }}>{formatPrice(tax)}</span>
                      </div>
                      {appliedCoupon && (
                        <div className="flex justify-between">
                          <span className="text-accent">Discount</span>
                          <span className="text-accent">-{formatPrice(discountAmount)}</span>
                        </div>
                      )}
                    </div>

                    <div className="h-px mb-4" style={{ background: 'hsl(45 70% 55% / 0.2)' }} />
                    <div className="flex justify-between items-center">
                      <span className="font-semibold" style={{ color: '#f5f0e8' }}>
                        Total
                      </span>
                      <span className="text-xl font-bold" style={{ color: 'hsl(45 75% 58%)' }}>
                        {formatPrice(grandTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </div>
  );
}
