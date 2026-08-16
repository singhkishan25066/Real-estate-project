// app/admin/leads/page.js
import AdminNav from '@/components/AdminNav';
import AdminLeads from '@/components/AdminLeads';

export default function AdminLeadsPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <AdminNav />
      <h1 className="text-3xl mb-8">Contact form leads</h1>
      <AdminLeads />
    </main>
  );
}
