// app/api/leads/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/db';
import Lead from '@/models/Lead';
import { getUserFromCookies } from '@/lib/auth';

export async function GET() {
  const user = await getUserFromCookies(cookies());
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }
  await connectDB();
  const leads = await Lead.find().populate('project', 'name slug').sort({ createdAt: -1 });
  return NextResponse.json({ leads });
}
