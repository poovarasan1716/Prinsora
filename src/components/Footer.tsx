import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <AppLogo size={36} />
              <span className="font-display text-xl font-semibold text-white">Prinsora</span>
            </div>
            <p className="text-sm text-white/60 font-display italic">Grace in every Thread</p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {[
              { label: 'Home', href: '/' },
              { label: 'Shop', href: '/shop' },
              { label: 'New Arrivals', href: '/shop' },
              { label: 'Offers', href: '/shop' },
              { label: 'Privacy Policy', href: '/' },
              { label: 'Terms', href: '/' },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-white/70 hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social */}
          <div className="flex items-center gap-3">
            {[
              { icon: 'GlobeAltIcon', label: 'Instagram' },
              { icon: 'ChatBubbleLeftIcon', label: 'Facebook' },
              { icon: 'EnvelopeIcon', label: 'Email' },
            ].map(({ icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-accent hover:text-primary transition-colors flex items-center justify-center"
              >
                <Icon name={icon as Parameters<typeof Icon>[0]['name']} size={16} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">© 2026 Prinsora. All rights reserved.</p>
          <p className="text-xs text-white/40">Made with love for modern women</p>
        </div>
      </div>
    </footer>
  );
}