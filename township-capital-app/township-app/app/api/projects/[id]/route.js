// app/api/projects/[id]/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/db';
import Project from '@/models/Project';
import { getUserFromCookies } from '@/lib/auth';

export async function GET(req, { params }) {
  await connectDB();
  const project = await Project.findById(params.id);
  if (!project) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  return NextResponse.json({ project });
}

export async function PUT(req, { params }) {
  const user = await getUserFromCookies(cookies());
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }
  try {
    const body = await req.json();
    await connectDB();
    const project = await Project.findByIdAndUpdate(params.id, body, { new: true });
    if (!project) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    return NextResponse.json({ project });
  } catch (err) {
    console.error('Update project error:', err);
    return NextResponse.json({ error: 'Could not update project.' }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  const user = await getUserFromCookies(cookies());
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }
  await connectDB();
  await Project.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
