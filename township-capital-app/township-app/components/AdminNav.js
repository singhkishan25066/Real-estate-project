// components/AdminNav.js
import Link from 'next/link';

export default function AdminNav() {
  return (
    <div className="flex gap-4 mb-8 text-sm">
      <Link href="/admin" className="text-stone font-semibold">Overview</Link>
      <Link href="/admin/projects" className="text-stone font-semibold">Projects</Link>
      <Link href="/admin/leads" className="text-stone font-semibold">Leads</Link>
      <Link href="/admin/users" className="text-stone font-semibold">Users</Link>
    </div>
  );
}
