import Link from 'next/link';
import { Gem, Mail, Phone, MapPin } from 'lucide-react';
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube } from 'react-icons/fa';

const links = {
  quick: [
    { label: 'Shop', href: '/shop' },
    { label: 'New Arrivals', href: '/shop' },
    { label: 'Offers', href: '/shop' },
    { label: 'Collections', href: '/shop' },
    { label: 'About Us', href: '/' },
    { label: 'Admin', href: '/admin' },
  ],
  support: ['Track Order', 'Returns & Exchanges', 'Size Guide', 'Care Instructions', 'FAQs'],
};

export function Footer() {
  return (
    <footer id="footer" className="bg-card border-t border-border/50">
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Gem className="w-5 h-5 text-primary" />
              <span className="font-serif text-2xl font-semibold text-primary">Prinsora</span>
            </div>
            <p className="text-muted-foreground font-light leading-relaxed text-sm mb-6">
              Luxury Indian fashion where every thread carries grace and every silhouette tells your story.
            </p>
            <div className="flex items-center gap-4">
            </div>
          </div>

          <div>
            <h4 className="font-serif text-foreground font-medium mb-5 tracking-wide">Quick Links</h4>
            <ul className="space-y-3">
              {links.quick.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors font-light flex items-center gap-2 group">
                    <span className="w-4 h-px bg-primary/0 group-hover:bg-primary/60 transition-all duration-200" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-foreground font-medium mb-5 tracking-wide">Customer Care</h4>
            <ul className="space-y-3">
              {links.support.map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors font-light flex items-center gap-2 group">
                    <span className="w-4 h-px bg-primary/0 group-hover:bg-primary/60 transition-all duration-200" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-foreground font-medium mb-5 tracking-wide">Get in Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-muted-foreground font-light">
                <Mail className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                hello@prinsora.in
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground font-light">
                <Phone className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                +91 98765 43210
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground font-light">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                Design Studio, Banjara Hills, Hyderabad, 500034
              </li>
            </ul>

            <div className="mt-8">
              <p className="text-xs text-muted-foreground mb-3 tracking-wide uppercase">Newsletter</p>
              <div className="flex gap-0">
                <input
                  data-testid="input-newsletter"
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-background border border-border/60 text-foreground text-sm px-3 py-2.5 rounded-l-sm outline-none focus:border-primary/60 transition-colors placeholder:text-muted-foreground/50"
                />
                <button
                  data-testid="button-subscribe"
                  className="px-4 py-2.5 bg-primary text-primary-foreground text-sm rounded-r-sm hover:bg-accent transition-colors"
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border/30 py-6">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Prinsora. All rights reserved. Crafted with grace.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Shipping Policy'].map((item) => (
              <a key={item} href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
