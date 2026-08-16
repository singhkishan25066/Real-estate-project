// app/signup/page.js
import { Suspense } from 'react';
import Link from 'next/link';
import AuthForm from '@/components/AuthForm';

export default function SignupPage() {
  return (
    <main className="max-w-md mx-auto px-6 py-20">
      <h1 className="text-3xl mb-6">Create your account</h1>
      <Suspense fallback={null}>
        <AuthForm mode="signup" />
      </Suspense>
      <p className="text-sm text-gray-500 mt-4">
        Already have an account? <Link href="/login" className="text-stone font-semibold">Log in</Link>
      </p>
    </main>
  );
}
