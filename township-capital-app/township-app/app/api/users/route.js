// app/api/users/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { getUserFromCookies } from '@/lib/auth';

export async function GET() {
  const user = await getUserFromCookies(cookies());
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }
  await connectDB();
  // Never return passwordHash, even to admins.
  const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
  return NextResponse.json({ users });
}
