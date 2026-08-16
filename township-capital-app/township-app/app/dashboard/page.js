// app/dashboard/page.js
// middleware.js already blocks unauthenticated access to this route, so by
// the time this renders we know a valid cookie exists.
import { cookies } from 'next/headers';
import { getUserFromCookies } from '@/lib/auth';
import DashboardContent from '@/components/DashboardContent';

export default async function DashboardPage() {
  const user = await getUserFromCookies(cookies());
  return <DashboardContent user={user} />;
}
