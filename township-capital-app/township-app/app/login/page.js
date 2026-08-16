// app/login/page.js
import { Suspense } from 'react';
import Link from 'next/link';
import AuthForm from '@/components/AuthForm';

export default function LoginPage() {
  return (
    <main className="max-w-md mx-auto px-6 py-20">
      <h1 className="text-3xl mb-6">Log in</h1>
      <Suspense fallback={null}>
        <AuthForm mode="login" />
      </Suspense>
      <p className="text-sm text-gray-500 mt-4">
        No account? <Link href="/signup" className="text-stone font-semibold">Sign up</Link>
      </p>
    </main>
  );
}
