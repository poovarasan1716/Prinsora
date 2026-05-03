'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { useRouter } from 'next/navigation';

type Step = 'cart' | 'address' | 'payment';

interface AddressForm {
  fullName: string;
  phone: string;
  email: string;
  pincode: string;
  address: string;
  city: string;
  state: string;
  landmark: string;
  addressType: 'home' | 'work';
}

const steps: { key: Step; label: string; icon: string }[] = [
  { key: 'cart', label: 'Cart', icon: 'ShoppingBagIcon' },
  { key: 'address', label: 'Address', icon: 'MapPinIcon' },
  { key: 'payment', label: 'Payment', icon: 'CreditCardIcon' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<Step>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod' | 'upi'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState<AddressForm>({
    fullName: '',
    phone: '',
    email: '',
    pincode: '',
    address: '',
    city: '',
    state: '',
    landmark: '',
    addressType: 'home',
  });

  const shipping = cartTotal >= 999 ? 0 : 99;
  const discount = Math.round(cartTotal * 0.05);
  const finalTotal = cartTotal + shipping - discount;

  const stepIndex = steps.findIndex((s) => s.key === currentStep);

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('payment');
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/checkout/place-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems,
          address,
          paymentMethod,
          total: finalTotal,
        }),
      });

      const result = await response.json();

      if (result.success) {
        clearCart();
        router.push('/order-confirmation?orderId=' + result.orderId);
      } else {
        alert("Failed to place order: " + result.error);
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("An error occurred while placing your order.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <Icon name="ChevronRightIcon" size={14} />
          <Link href="/cart" className="hover:text-primary transition-colors">Cart</Link>
          <Icon name="ChevronRightIcon" size={14} />
          <span className="text-foreground font-medium">Checkout</span>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-10">
          {steps.map((step, idx) => (
            <React.Fragment key={step.key}>
              <button
                onClick={() => idx < stepIndex && setCurrentStep(step.key)}
                className={`flex flex-col items-center gap-1.5 ${idx < stepIndex ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    step.key === currentStep
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                      : idx < stepIndex
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {idx < stepIndex ? (
                    <Icon name="CheckIcon" size={18} />
                  ) : (
                    <Icon name={step.icon as any} size={18} />
                  )}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:block ${
                    step.key === currentStep ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {step.label}
                </span>
              </button>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-3 transition-all duration-500 ${
                    idx < stepIndex ? 'bg-accent' : 'bg-border'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Cart Review */}
            {currentStep === 'cart' && (
              <div className="animate-fade-in-up">
                <h2 className="font-display text-2xl font-semibold text-primary mb-6">Review Your Order</h2>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id + item.size} className="bg-card rounded-2xl p-4 border border-border flex gap-4">
                      <div className="relative w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-secondary">
                        <AppImage src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{item.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">Size: {item.size} · Color: {item.color}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                          <span className="font-bold text-primary">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentStep('address')}
                  className="mt-6 w-full py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all hover:shadow-lg flex items-center justify-center gap-2"
                >
                  Continue to Address
                  <Icon name="ArrowRightIcon" size={18} />
                </button>
              </div>
            )}

            {/* Step 2: Address */}
            {currentStep === 'address' && (
              <div className="animate-fade-in-up">
                <h2 className="font-display text-2xl font-semibold text-primary mb-6">Delivery Address</h2>
                <form onSubmit={handleAddressSubmit} className="bg-card rounded-2xl border border-border p-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Full Name *</label>
                      <input
                        required
                        value={address.fullName}
                        onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                        placeholder="Priya Sharma"
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Phone Number *</label>
                      <input
                        required
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Email Address *</label>
                    <input
                      required
                      type="email"
                      value={address.email}
                      onChange={(e) => setAddress({ ...address, email: e.target.value })}
                      placeholder="priya@example.com"
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Street Address *</label>
                    <textarea
                      required
                      value={address.address}
                      onChange={(e) => setAddress({ ...address, address: e.target.value })}
                      placeholder="House No., Street, Area"
                      rows={2}
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Pincode *</label>
                      <input
                        required
                        value={address.pincode}
                        onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                        placeholder="400001"
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">City *</label>
                      <input
                        required
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        placeholder="Mumbai"
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">State *</label>
                      <select
                        required
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      >
                        <option value="">Select State</option>
                        {['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Rajasthan', 'West Bengal', 'Uttar Pradesh', 'Telangana', 'Kerala'].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Landmark (Optional)</label>
                    <input
                      value={address.landmark}
                      onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                      placeholder="Near Metro Station"
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Address Type</label>
                    <div className="flex gap-3">
                      {(['home', 'work'] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setAddress({ ...address, addressType: type })}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                            address.addressType === type
                              ? 'border-accent bg-accent/10 text-primary' :'border-border hover:border-accent/50'
                          }`}
                        >
                          <Icon name={type === 'home' ? 'HomeIcon' : 'BuildingOfficeIcon'} size={16} />
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    Continue to Payment
                    <Icon name="ArrowRightIcon" size={18} />
                  </button>
                </form>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 'payment' && (
              <div className="animate-fade-in-up">
                <h2 className="font-display text-2xl font-semibold text-primary mb-6">Payment Method</h2>
                <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
                  {/* Razorpay */}
                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'razorpay' ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => setPaymentMethod('razorpay')}
                      className="accent-accent w-4 h-4"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-[#072654] rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xs">R</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Razorpay</p>
                        <p className="text-xs text-muted-foreground">Cards, UPI, Net Banking, Wallets</p>
                      </div>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Recommended</span>
                  </label>

                  {/* UPI */}
                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'upi' ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="accent-accent w-4 h-4"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xs">UPI</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">UPI / BHIM</p>
                        <p className="text-xs text-muted-foreground">GPay, PhonePe, Paytm, BHIM</p>
                      </div>
                    </div>
                  </label>

                  {/* COD */}
                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'cod' ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-accent w-4 h-4"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Icon name="BanknotesIcon" size={20} className="text-amber-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Cash on Delivery</p>
                        <p className="text-xs text-muted-foreground">Pay when your order arrives</p>
                      </div>
                    </div>
                  </label>

                  {paymentMethod === 'razorpay' && (
                    <div className="mt-4 p-4 bg-secondary rounded-xl space-y-3 animate-fade-in-up">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Card Details</p>
                      <input
                        placeholder="Card Number"
                        className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          placeholder="MM / YY"
                          className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <input
                          placeholder="CVV"
                          className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>
                      <input
                        placeholder="Name on Card"
                        className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <div className="mt-4 p-4 bg-secondary rounded-xl animate-fade-in-up">
                      <input
                        placeholder="Enter UPI ID (e.g. priya@upi)"
                        className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                  )}

                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="mt-2 w-full py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-all hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Icon name="LockClosedIcon" size={18} />
                        Pay ₹{finalTotal.toLocaleString('en-IN')} Securely
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Icon name="ShieldCheckIcon" size={14} className="text-green-500" />
                    256-bit SSL encrypted · PCI DSS compliant
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
              <h3 className="font-display text-lg font-semibold text-primary mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id + item.size} className="flex items-center gap-3">
                    <div className="relative w-12 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
                      <AppImage src={item.image} alt={item.name} fill className="object-cover" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.size}</p>
                    </div>
                    <span className="text-xs font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
