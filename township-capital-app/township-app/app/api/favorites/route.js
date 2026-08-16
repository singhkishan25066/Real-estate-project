// app/api/favorites/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/db';
import Favorite from '@/models/Favorite';
import { getUserFromCookies } from '@/lib/auth';

export async function GET() {
  const user = await getUserFromCookies(cookies());
  if (!user) return NextResponse.json({ error: 'Please log in.' }, { status: 401 });

  await connectDB();
  const favorites = await Favorite.find({ user: user.id }).populate('project');
  return NextResponse.json({ favorites });
}

export async function POST(req) {
  const user = await getUserFromCookies(cookies());
  if (!user) return NextResponse.json({ error: 'Please log in.' }, { status: 401 });

  const { projectId } = await req.json();
  if (!projectId) return NextResponse.json({ error: 'projectId is required.' }, { status: 400 });

  await connectDB();
  try {
    const favorite = await Favorite.create({ user: user.id, project: projectId });
    return NextResponse.json({ favorite }, { status: 201 });
  } catch (err) {
    if (err.code === 11000) {
      return NextResponse.json({ error: 'Already saved.' }, { status: 409 });
    }
    console.error('Add favorite error:', err);
    return NextResponse.json({ error: 'Could not save.' }, { status: 500 });
  }
}
