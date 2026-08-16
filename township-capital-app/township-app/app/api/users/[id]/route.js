// app/api/users/[id]/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { getUserFromCookies } from '@/lib/auth';

export async function PATCH(req, { params }) {
  const admin = await getUserFromCookies(cookies());
  if (!admin || admin.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }
  if (admin.id === params.id) {
    return NextResponse.json({ error: "You can't change your own role." }, { status: 400 });
  }

  const { role } = await req.json();
  if (!['user', 'admin'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role.' }, { status: 400 });
  }

  await connectDB();
  const user = await User.findByIdAndUpdate(params.id, { role }, { new: true }).select('-passwordHash');
  if (!user) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  return NextResponse.json({ user });
}
