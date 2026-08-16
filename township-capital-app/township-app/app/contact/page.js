// app/contact/page.js
import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <main className="max-w-xl mx-auto px-6 py-20">
      <div className="text-stone text-xs font-bold tracking-widest uppercase mb-4">Talk to Township</div>
      <h1 className="text-4xl mb-4">Good decisions start with a conversation.</h1>
      <p className="text-gray-600 mb-8">Tell us what you&apos;re considering in Rajgir or Bihta. No scripts, no obligation.</p>
      <ContactForm />
    </main>
  );
}
