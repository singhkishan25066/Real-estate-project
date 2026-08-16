// app/api/leads/[id]/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/db';
import Lead from '@/models/Lead';
import { getUserFromCookies } from '@/lib/auth';

export async function PATCH(req, { params }) {
  const user = await getUserFromCookies(cookies());
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }
  const { status } = await req.json();
  await connectDB();
  const lead = await Lead.findByIdAndUpdate(params.id, { status }, { new: true });
  if (!lead) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  return NextResponse.json({ lead });
}
