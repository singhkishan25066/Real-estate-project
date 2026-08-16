'use client';
// components/AdminUsers.js
import { useEffect, useState } from 'react';

export default function AdminUsers() {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState('');

  function load() {
    fetch('/api/users').then((r) => r.json()).then((data) => setUsers(data.users || []));
  }
  useEffect(load, []);

  async function toggleRole(user) {
    setError('');
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    const res = await fetch(`/api/users/${user._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      return;
    }
    load();
  }

  if (users === null) return <p className="text-gray-400">Loading…</p>;

  return (
    <div>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      <div className="bg-white rounded-2xl border border-navy/10 overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="bg-[#fbf9f3] text-left text-xs uppercase tracking-wide text-gray-400">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Joined</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-[#f2ede0]">
                <td className="p-4">{u.name}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-gold/20 text-stone' : 'bg-gray-100 text-gray-500'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4 text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="p-4">
                  <button onClick={() => toggleRole(u)} className="text-xs text-stone font-semibold">
                    Make {u.role === 'admin' ? 'user' : 'admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
