'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';
import { useCart } from '@/context/CartContext';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'New Arrivals', href: '/shop' },
  { label: 'Offers', href: '/shop' },
  { label: 'Contact', href: '/' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { cartCount, wishlistCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-border'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <AppLogo size={36} />
              <span
                className={`font-display font-semibold text-xl tracking-tight hidden sm:block transition-colors duration-300 ${
                  scrolled ? 'text-primary' : 'text-white'
                }`}
              >
                Prinsora
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks?.map((link) => (
                <Link
                  key={link?.label}
                  href={link?.href}
                  className={`text-sm font-medium tracking-wide gold-underline transition-colors duration-200 ${
                    scrolled ? 'text-foreground hover:text-primary' : 'text-white/90 hover:text-white'
                  }`}
                >
                  {link?.label}
                </Link>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`p-2 rounded-full transition-colors ${
                  scrolled ? 'hover:bg-secondary text-foreground' : 'hover:bg-white/10 text-white'
                }`}
                aria-label="Search"
              >
                <Icon name="MagnifyingGlassIcon" size={20} />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className={`p-2 rounded-full transition-colors relative ${
                  scrolled ? 'hover:bg-secondary text-foreground' : 'hover:bg-white/10 text-white'
                }`}
                aria-label="Wishlist"
              >
                <Icon name="HeartIcon" size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-[10px] font-bold text-primary rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className={`p-2 rounded-full transition-colors relative ${
                  scrolled ? 'hover:bg-secondary text-foreground' : 'hover:bg-white/10 text-white'
                }`}
                aria-label="Cart"
              >
                <Icon name="ShoppingBagIcon" size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-[10px] font-bold text-primary rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Profile */}
              <Link
                href="/profile"
                className={`p-2 rounded-full transition-colors hidden sm:flex ${
                  scrolled ? 'hover:bg-secondary text-foreground' : 'hover:bg-white/10 text-white'
                }`}
                aria-label="Profile"
              >
                <Icon name="UserCircleIcon" size={20} />
              </Link>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className={`p-2 rounded-full transition-colors lg:hidden ${
                  scrolled ? 'hover:bg-secondary text-foreground' : 'hover:bg-white/10 text-white'
                }`}
                aria-label="Open menu"
              >
                <Icon name="Bars3Icon" size={22} />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {searchOpen && (
            <div className="pb-4 animate-fade-in-up">
              <div className="relative max-w-lg mx-auto">
                <Icon name="MagnifyingGlassIcon" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search dresses, sarees, kurtis..."
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>
      </header>
      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl flex flex-col animate-slide-left">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-2">
                <AppLogo size={32} />
                <span className="font-display font-semibold text-lg text-primary">Prinsora</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-full hover:bg-secondary text-foreground"
                aria-label="Close menu"
              >
                <Icon name="XMarkIcon" size={22} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-6 space-y-1">
              {navLinks?.map((link) => (
                <Link
                  key={link?.label}
                  href={link?.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-secondary hover:text-primary font-medium transition-colors"
                >
                  {link?.label}
                </Link>
              ))}
            </nav>

            <div className="p-6 border-t border-border space-y-3">
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-secondary font-medium transition-colors"
              >
                <Icon name="UserCircleIcon" size={20} />
                My Profile
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-secondary font-medium transition-colors"
              >
                <Icon name="HeartIcon" size={20} />
                Wishlist
                {wishlistCount > 0 && (
                  <span className="ml-auto w-5 h-5 bg-accent text-[11px] font-bold text-primary rounded-full flex items-center justify-center">{wishlistCount}</span>
                )}
              </Link>
              <Link
                href="/cart"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-secondary font-medium transition-colors"
              >
                <Icon name="ShoppingBagIcon" size={20} />
                Cart
                {cartCount > 0 && (
                  <span className="ml-auto w-5 h-5 bg-accent text-[11px] font-bold text-primary rounded-full flex items-center justify-center">{cartCount}</span>
                )}
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium transition-colors hover:bg-primary/90"
              >
                <Icon name="ArrowRightOnRectangleIcon" size={20} />
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}