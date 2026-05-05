import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Heart, ShoppingBag, User, Menu, X, Gem, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

// ... (skipping NavModel3D for brevity in replacement chunk)

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { count: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'New Arrivals', href: '/shop' },
    { label: 'Offers', href: '/shop' },
    { label: 'Contact', href: '#footer' },
    { label: 'Admin', href: '/admin' },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/85 backdrop-blur-md border-b border-border/40 py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group" data-testid="link-logo">
          <Gem className="w-8 h-8 text-primary" />
          <span className="font-serif text-2xl md:text-3xl font-semibold tracking-wide text-primary group-hover:text-accent transition-colors">
            Prinsora
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors tracking-wide relative group"
            >
              {item.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </nav>

        {/* Right Icons */}
        <div className="hidden md:flex items-center gap-5">
          <Link href="/shop">
            <button className="text-foreground/70 hover:text-primary transition-colors hover:scale-110 duration-200">
              <Search className="w-5 h-5" />
            </button>
          </Link>

          {/* Wishlist */}
          <Link href="/profile">
            <button className="relative text-foreground/70 hover:text-primary transition-colors hover:scale-110 duration-200">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center" style={{ background: 'hsl(45 70% 55%)', color: '#1a0f08' }}>
                  {wishlistCount}
                </span>
              )}
            </button>
          </Link>

          {/* Cart */}
          <Link href="/cart">
            <button className="relative text-foreground/70 hover:text-primary transition-colors hover:scale-110 duration-200">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center" style={{ background: 'hsl(45 70% 55%)', color: '#1a0f08' }}>
                  {cartCount}
                </span>
              )}
            </button>
          </Link>

          {/* User / Logout */}
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/profile">
                <button className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary" style={{ color: 'hsl(45 70% 55%)' }}>
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'hsl(45 70% 55%)', color: '#1a0f08' }}>
                    {user.name[0].toUpperCase()}
                  </span>
                </button>
              </Link>
              <button
                onClick={() => { logout(); router.push('/'); }}
                className="text-foreground/50 hover:text-red-400 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link href="/login">
              <button className="text-foreground/70 hover:text-primary transition-colors hover:scale-110 duration-200">
                <User className="w-5 h-5" />
              </button>
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-foreground hover:text-primary transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="button-mobile-menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <nav className="flex flex-col p-4 space-y-4">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-base font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center gap-4 pt-4 border-t border-border">
                <Link href="/cart" onClick={() => setMobileMenuOpen(false)}>
                  <div className="relative">
                    <ShoppingBag className="w-5 h-5 text-foreground hover:text-primary" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center" style={{ background: 'hsl(45 70% 55%)', color: '#1a0f08' }}>{cartCount}</span>
                    )}
                  </div>
                </Link>
                {user ? (
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <User className="w-5 h-5 text-foreground hover:text-primary" />
                  </Link>
                ) : (
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <User className="w-5 h-5 text-foreground hover:text-primary" />
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
