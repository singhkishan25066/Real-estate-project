// app/admin/projects/page.js
import AdminNav from '@/components/AdminNav';
import AdminProjects from '@/components/AdminProjects';

export default function AdminProjectsPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <AdminNav />
      <h1 className="text-3xl mb-8">Manage projects</h1>
      <AdminProjects />
    </main>
  );
}
