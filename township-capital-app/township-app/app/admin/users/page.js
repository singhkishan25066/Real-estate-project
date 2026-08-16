// app/admin/users/page.js
import AdminNav from '@/components/AdminNav';
import AdminUsers from '@/components/AdminUsers';

export default function AdminUsersPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <AdminNav />
      <h1 className="text-3xl mb-8">Manage users</h1>
      <AdminUsers />
    </main>
  );
}
