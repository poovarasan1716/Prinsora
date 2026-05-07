import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const GOLD =
  'linear-gradient(135deg, #8B5E1A 0%, #D4A843 28%, #F5D47A 50%, #C8881E 72%, #8B5E1A 100%)';

export default function PrivacyPolicy() {
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
          Privacy Policy
        </h1>

        <div className="space-y-8 text-zinc-400 leading-relaxed">
          <section>
            <h2 className="text-xl font-serif text-white mb-4">Introduction</h2>
            <p>
              Welcome to Prinsora. We respect your privacy and are committed to protecting your
              personal data. This privacy policy will inform you as to how we look after your
              personal data when you visit our website and tell you about your privacy rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-white mb-4">Data We Collect</h2>
            <p>
              We may collect, use, store and transfer different kinds of personal data about you
              which we have grouped together as follows:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>Identity Data: Name, username or similar identifier.</li>
              <li>
                Contact Data: Billing address, delivery address, email address and telephone
                numbers.
              </li>
              <li>Financial Data: Payment card details (processed securely via Cashfree).</li>
              <li>
                Transaction Data: Details about payments to and from you and other details of
                products you have purchased from us.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif text-white mb-4">How We Use Your Data</h2>
            <p>
              We use your data to process your orders, manage your account, and, if you agree, to
              email you about other products and services we think may be of interest to you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-white mb-4">Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from
              being accidentally lost, used or accessed in an unauthorized way. We limit access to
              your personal data to those employees and partners who have a business need to know.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-white mb-4">Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please
              contact us at support@prinsora.com
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
