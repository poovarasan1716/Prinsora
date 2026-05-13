import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const GOLD =
  'linear-gradient(135deg, #8B5E1A 0%, #D4A843 28%, #F5D47A 50%, #C8881E 72%, #8B5E1A 100%)';

export default function RefundPolicy() {
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
          Refund & Cancellation Policy
        </h1>

        <div className="space-y-8 text-zinc-400 leading-relaxed">
          <section>
            <h2 className="text-xl font-serif text-white mb-4">Refund Eligibility</h2>
            <p>
              At Prinsora, we want you to be completely satisfied with your luxury purchase. You are
              eligible for a refund or exchange if:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>The product is damaged or defective upon arrival.</li>
              <li>The wrong product was shipped to you.</li>
              <li>The request is made within 7 days of receiving the item.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif text-white mb-4">Process for Returns</h2>
            <p>
              To initiate a return, you can simply go to your <strong>Profile</strong> page, find the specific order in your order history, and click the <strong>Return</strong> button. You will be asked to provide a reason for the return.
            </p>
            <p className="mt-2">
              Alternatively, you can email returns@prinsora.com with your order number. Items must be in their original packaging with tags attached.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-white mb-4">Refund Timeline</h2>
            <p>
              Once your return is received and inspected, we will notify you of the approval or
              rejection of your refund. If approved, your refund will be processed, and a credit
              will automatically be applied to your original method of payment within 7-10 business
              days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif text-white mb-4">Cancellation Policy</h2>
            <p>
              Orders can be cancelled within 12 hours of placement. Once the order has been
              processed for shipping, it cannot be cancelled.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
