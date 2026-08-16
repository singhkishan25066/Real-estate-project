// app/api/favorites/[projectId]/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/db';
import Favorite from '@/models/Favorite';
import { getUserFromCookies } from '@/lib/auth';

export async function DELETE(req, { params }) {
  const user = await getUserFromCookies(cookies());
  if (!user) return NextResponse.json({ error: 'Please log in.' }, { status: 401 });

  await connectDB();
  await Favorite.findOneAndDelete({ user: user.id, project: params.projectId });
  return NextResponse.json({ ok: true });
}
