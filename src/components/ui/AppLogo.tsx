'use client';
import React from 'react';

interface AppLogoProps {
  size?: number;
  className?: string;
}

export default function AppLogo({ size = 40, className = '' }: AppLogoProps) {
  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]"
      >
        <path
          d="M12 2L15 9H22L16 14L18 21L12 17L6 21L8 14L2 9H9L12 2Z"
          fill="url(#gold-gradient)"
        />
        <defs>
          <linearGradient
            id="gold-gradient"
            x1="2"
            y1="2"
            x2="22"
            y2="22"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#D4AF37" />
            <stop offset="0.5" stopColor="#F4EBD9" />
            <stop offset="1" stopColor="#C5A028" />
          </linearGradient>
        </defs>
      </svg>
      {/* Decorative Glow */}
      <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full -z-10 animate-pulse" />
    </div>
  );
}
