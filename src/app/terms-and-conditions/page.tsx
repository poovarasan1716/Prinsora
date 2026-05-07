import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const GOLD =
  'linear-gradient(135deg, #8B5E1A 0%, #D4A843 28%, #F5D47A 50%, #C8881E 72%, #8B5E1A 100%)';

export default function TermsAndConditions() {
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
          Terms & Conditions
        </h1>

        <div className="space-y-8 text-zinc-400 leading-relaxed">
          <section>
            <h2 className="text-xl font-serif text-white mb-4">Acceptance of Terms</h2>
            <p>
              By accessing and using Prinsora, you accept and agree to be bound by the terms and
              provision of this agreement. Any participation in this service will constitute
              acceptance of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-white mb-4">Products and Pricing</h2>
            <p>
              All luxury items shown on the site are subject to availability. We reserve the right
              to change our prices at any time without notice. While we strive for accuracy, errors
              in pricing or description may occur, and we reserve the right to cancel any orders
              placed with incorrect information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-white mb-4">Intellectual Property</h2>
            <p>
              The designs, logos, and content on Prinsora are the property of Prinsora and are
              protected by international copyright laws. Unauthorized use of any materials is
              strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-white mb-4">User Accounts</h2>
            <p>
              If you create an account on our website, you are responsible for maintaining the
              security of your account and you are fully responsible for all activities that occur
              under the account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-white mb-4">Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws
              of India and you irrevocably submit to the exclusive jurisdiction of the courts in
              that State or location.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
