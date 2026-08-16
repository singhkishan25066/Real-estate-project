// app/about/page.js
export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20">
      <div className="text-stone text-xs font-bold tracking-widest uppercase mb-4">Why Township</div>
      <h1 className="text-4xl mb-6">Buying property should feel clearer.</h1>
      <p className="text-gray-600 leading-relaxed mb-4">
        Township Capital is the digital front door for DNS Homes Pvt Ltd&apos;s residential plot projects in
        Bihar — currently Mountain Bliss in Rajgir (Nalanda district) and Shuvida Enclave in Bihta (Patna
        district).
      </p>
      <p className="text-gray-600 leading-relaxed mb-4">
        We bring the context glossy brochures leave out: real per-sq-ft rates, what a plot could realistically
        be worth over time, and the infrastructure actually driving demand in each locality — not just a
        sales pitch.
      </p>
      <p className="text-gray-600 leading-relaxed">
        Every listing here is a starting point for a better conversation, not a reason to rush one.
      </p>
    </main>
  );
}
