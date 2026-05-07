import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const GOLD =
  'linear-gradient(135deg, #8B5E1A 0%, #D4A843 28%, #F5D47A 50%, #C8881E 72%, #8B5E1A 100%)';

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen" style={{ background: '#0f0805' }}>
      <Navbar />
      <div className="pt-32 pb-20 container mx-auto px-4 md:px-6 max-w-4xl">
        <h1
          className="text-4xl md:text-5xl font-serif font-medium mb-10"
          style={{
            background: GOLD,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Shipping Policy
        </h1>

        <div className="space-y-8 text-zinc-400 leading-relaxed">
          <section>
            <h2 className="text-xl font-serif text-white mb-4">Shipping Coverage</h2>
            <p>
              Prinsora currently ships to all major cities across India. We partner with premium
              courier services to ensure your luxury items are handled with care and delivered
              securely.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-white mb-4">Delivery Timeline</h2>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>Metro Cities: 3-5 business days.</li>
              <li>Rest of India: 5-8 business days.</li>
              <li>Custom/Hand-crafted Items: May take up to 15 business days.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif text-white mb-4">Shipping Charges</h2>
            <p>
              We offer Free Shipping on all orders above ₹999. For orders below ₹999, a standard
              shipping fee of ₹99 is applicable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-white mb-4">Tracking Your Order</h2>
            <p>
              Once your order is shipped, you will receive an email with the tracking number and a
              link to the courier partner's website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-white mb-4">Delivery Verification</h2>
            <p>
              For your security, all luxury high-value orders require an OTP verification at the
              time of delivery.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
