// components/Footer.js
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0c0d29] text-[#8f91b3] py-9 mt-24">
      <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4 text-sm">
        <div>© {new Date().getFullYear()} Township Capital · Marketing partner for DNS Homes Pvt Ltd</div>
        <div className="flex gap-6">
          <Link href="/projects" className="hover:text-goldsoft">Projects</Link>
          <Link href="/calculator" className="hover:text-goldsoft">Calculator</Link>
          <Link href="/contact" className="hover:text-goldsoft">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
