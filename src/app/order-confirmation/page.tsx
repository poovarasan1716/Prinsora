'use client';
import React, { Suspense } from 'react';
import OrderConfirmationContent from './OrderConfirmationContent';

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" /></div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
