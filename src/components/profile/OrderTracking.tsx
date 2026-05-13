'use client';

import { motion } from 'framer-motion';
import { Check, Package, Truck, Home, Clock, AlertCircle } from 'lucide-react';

interface OrderTrackingProps {
  status: string;
  date: string;
}

const STEPS = [
  { id: 'Confirmed', label: 'Order Confirmed', icon: Check },
  { id: 'Processing', label: 'Processing', icon: Clock },
  { id: 'Shipped', label: 'Shipped', icon: Truck },
  { id: 'Delivered', label: 'Delivered', icon: Home },
];

export default function OrderTracking({ status, date }: OrderTrackingProps) {
  // Map current status to index
  const getStatusIndex = (s: string) => {
    if (s === 'Delivered') return 3;
    if (s === 'Shipped') return 2;
    if (s === 'Processing') return 1;
    if (s === 'Confirmed') return 0;
    if (s === 'Return Requested' || s === 'Returned' || s === 'Refunded') return 4; // Special case
    return 0;
  };

  const currentIndex = getStatusIndex(status);
  const isSpecialStatus = currentIndex === 4;

  return (
    <div className="py-8 px-2">
      {!isSpecialStatus ? (
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 w-full h-0.5 bg-zinc-800" />
          <motion.div 
            className="absolute top-5 left-0 h-0.5 bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${(currentIndex / (STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />

          {/* Steps */}
          <div className="relative flex justify-between">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx <= currentIndex;
              const isCurrent = idx === currentIndex;

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors ${
                      isActive ? 'bg-accent text-primary' : 'bg-zinc-800 text-zinc-500'
                    }`}
                    initial={false}
                    animate={{
                      scale: isCurrent ? 1.2 : 1,
                      boxShadow: isCurrent ? '0 0 20px rgba(212, 168, 67, 0.4)' : 'none'
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                  <span 
                    className={`mt-4 text-[10px] uppercase tracking-widest font-bold text-center max-w-[80px] ${
                      isActive ? 'text-accent' : 'text-zinc-600'
                    }`}
                  >
                    {step.label}
                  </span>
                  {idx === 0 && (
                    <span className="mt-1 text-[9px] text-zinc-500">{date}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-zinc-900/50 border border-accent/20 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-white font-serif font-bold text-lg">{status}</h4>
            <p className="text-zinc-400 text-sm">
              Your return/refund request is being processed. Our team will contact you soon.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
