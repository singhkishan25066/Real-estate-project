// app/api/projects/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/db';
import Project from '@/models/Project';
import { getUserFromCookies } from '@/lib/auth';

// Public — anyone can browse projects.
export async function GET() {
  await connectDB();
  const projects = await Project.find().sort({ createdAt: -1 });
  return NextResponse.json({ projects });
}

// Admin only — create a new project listing.
export async function POST(req) {
  const user = await getUserFromCookies(cookies());
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    await connectDB();
    const project = await Project.create(body);
    return NextResponse.json({ project }, { status: 201 });
  } catch (err) {
    console.error('Create project error:', err);
    const message = err.code === 11000 ? 'A project with this slug already exists.' : 'Could not create project.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
