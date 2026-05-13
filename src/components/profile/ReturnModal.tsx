'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Loader2, CheckCircle2 } from 'lucide-react';
import AppImage from '@/components/ui/AppImage';

interface ReturnModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const REASONS = [
  'Wrong size',
  'Damaged product',
  'Wrong product',
  'Quality issue',
  'Changed my mind',
  'Other'
];

export default function ReturnModal({ order, isOpen, onClose, onSuccess }: ReturnModalProps) {
  const [requestType, setRequestType] = useState('Return');
  const [reason, setReason] = useState(REASONS[0]);
  const [comment, setComment] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/user/refund/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          email: order.email,
          requestType,
          reason,
          comment,
          image,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      } else {
        alert('Failed to submit: ' + data.error);
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
          >
            {isSuccess ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-white mb-2">Request Submitted</h2>
                <p className="text-zinc-400">Our team will review your return request within 24-48 hours.</p>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-white">Request {requestType}</h2>
                    <p className="text-xs text-zinc-500 mt-1">Order ID: {order.id}</p>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <X className="w-5 h-5 text-zinc-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                        Request Type
                      </label>
                      <select
                        value={requestType}
                        onChange={(e) => setRequestType(e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/50 appearance-none"
                      >
                        <option value="Return">Return Product</option>
                        <option value="Refund">Full Refund</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                        Reason
                      </label>
                      <select
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/50 appearance-none"
                      >
                        {REASONS.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                      Comments (Optional)
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                      placeholder="Tell us more about the issue..."
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                      Upload Proof (Optional)
                    </label>
                    <div className="relative group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center bg-zinc-950/50 group-hover:border-accent/30 transition-all">
                        {image ? (
                          <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                            <AppImage src={image} alt="Proof" fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <p className="text-white text-xs font-bold flex items-center gap-2">
                                <Upload className="w-3 h-3" /> Change Image
                              </p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-zinc-600 mb-2 group-hover:text-accent transition-colors" />
                            <p className="text-xs text-zinc-500">Click to upload photo of the product</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-accent text-primary font-bold text-sm shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                      </>
                    ) : (
                      'Submit Return Request'
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
