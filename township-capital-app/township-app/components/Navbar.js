'use client';
// components/Navbar.js
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState(undefined); // undefined = loading, null = logged out
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 bg-navy/95 backdrop-blur border-b border-gold/20">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-white">
          <span className="w-9 h-9 rounded-full border border-gold flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-gold" />
          </span>
          <span className="text-xs font-bold tracking-widest uppercase leading-tight">
            Township<br />Capital
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm text-[#cfd0e6]">
          <Link href="/" className="hover:text-goldsoft">Home</Link>
          <Link href="/projects" className="hover:text-goldsoft">Projects</Link>
          <Link href="/calculator" className="hover:text-goldsoft">Calculator</Link>
          <Link href="/about" className="hover:text-goldsoft">About</Link>
          <Link href="/contact" className="hover:text-goldsoft">Contact</Link>
          {user?.role === 'admin' && <Link href="/admin" className="hover:text-goldsoft">Admin</Link>}
          {user && <Link href="/dashboard" className="hover:text-goldsoft">Dashboard</Link>}
        </div>

        <div className="flex items-center gap-3">
          {user === undefined && <div className="w-16 h-4" />}
          {user === null && (
            <>
              <Link href="/login" className="text-sm text-[#cfd0e6] hover:text-goldsoft">Log in</Link>
              <Link href="/signup" className="btn-gold text-sm !py-2">Sign up</Link>
            </>
          )}
          {user && (
            <button onClick={logout} className="btn-outline !border-white/30 !text-white text-sm !py-2">
              Log out
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
