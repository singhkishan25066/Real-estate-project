'use client';
// components/DashboardContent.js
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatRupees } from '@/lib/pricing';

export default function DashboardContent({ user }) {
  const [favorites, setFavorites] = useState(null);

  useEffect(() => {
    fetch('/api/favorites')
      .then((r) => r.json())
      .then((data) => setFavorites(data.favorites || []));
  }, []);

  async function removeFavorite(projectId) {
    await fetch(`/api/favorites/${projectId}`, { method: 'DELETE' });
    setFavorites((prev) => prev.filter((f) => f.project?._id !== projectId));
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-stone text-xs font-bold tracking-widest uppercase mb-4">Your dashboard</div>
      <h1 className="text-4xl mb-2">Welcome back, {user.email}.</h1>
      <p className="text-gray-500 mb-10">Everything you&apos;ve saved, in one place.</p>

      <h2 className="text-2xl mb-4">Saved projects</h2>
      {favorites === null && <p className="text-gray-400">Loading…</p>}
      {favorites?.length === 0 && (
        <div className="card text-gray-500">
          Nothing saved yet.{' '}
          <Link href="/projects" className="text-stone font-semibold">Browse projects →</Link>
        </div>
      )}
      {favorites && favorites.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          {favorites.map((f) =>
            f.project ? (
              <div key={f._id} className="card flex justify-between items-center">
                <div>
                  <div className="font-serif text-lg">{f.project.name}</div>
                  <div className="text-sm text-gray-400">
                    {f.project.locality} · ₹{f.project.ratePerSqft}/sq ft
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <Link href={`/projects/${f.project.slug}`} className="text-sm text-stone font-semibold">
                    View
                  </Link>
                  <button
                    onClick={() => removeFavorite(f.project._id)}
                    className="text-sm text-gray-400 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : null
          )}
        </div>
      )}
    </main>
  );
}
