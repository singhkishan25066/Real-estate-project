'use client';
// components/FavoriteButton.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FavoriteButton({ projectId }) {
  const [user, setUser] = useState(undefined);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => setUser(data.user));
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch('/api/favorites')
      .then((r) => r.json())
      .then((data) => {
        const favs = data.favorites || [];
        setSaved(favs.some((f) => f.project?._id === projectId));
      });
  }, [user, projectId]);

  async function toggle() {
    if (!user) {
      router.push('/login?next=/projects');
      return;
    }
    setBusy(true);
    if (saved) {
      await fetch(`/api/favorites/${projectId}`, { method: 'DELETE' });
      setSaved(false);
    } else {
      await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      });
      setSaved(true);
    }
    setBusy(false);
  }

  return (
    <button onClick={toggle} disabled={busy} className="btn-outline text-sm !py-2">
      {saved ? '★ Saved' : '☆ Save this project'}
    </button>
  );
}
