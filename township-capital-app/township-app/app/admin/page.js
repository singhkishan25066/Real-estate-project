// app/admin/page.js
// middleware.js already restricts /admin/* to role === 'admin'.
import Link from 'next/link';
import { connectDB } from '@/lib/db';
import Project from '@/models/Project';
import Lead from '@/models/Lead';
import User from '@/models/User';
import AdminNav from '@/components/AdminNav';

export const dynamic = 'force-dynamic';

async function getCounts() {
  await connectDB();
  const [projects, leads, users, newLeads] = await Promise.all([
    Project.countDocuments(),
    Lead.countDocuments(),
    User.countDocuments(),
    Lead.countDocuments({ status: 'new' }),
  ]);
  return { projects, leads, users, newLeads };
}

export default async function AdminHomePage() {
  const counts = await getCounts();

  const cards = [
    { label: 'Projects', value: counts.projects, href: '/admin/projects' },
    { label: 'Leads (new)', value: `${counts.newLeads} / ${counts.leads}`, href: '/admin/leads' },
    { label: 'Users', value: counts.users, href: '/admin/users' },
  ];

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <AdminNav />
      <div className="text-stone text-xs font-bold tracking-widest uppercase mb-4">Admin</div>
      <h1 className="text-4xl mb-10">Overview</h1>
      <div className="grid sm:grid-cols-3 gap-6">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="card hover:-translate-y-1 transition">
            <div className="text-sm text-gray-400 mb-2">{c.label}</div>
            <div className="font-serif text-3xl">{c.value}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
