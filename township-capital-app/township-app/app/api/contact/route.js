// app/api/contact/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Lead from '@/models/Lead';

export async function POST(req) {
  try {
    const { name, phone, email, message, projectId } = await req.json();

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required.' }, { status: 400 });
    }

    await connectDB();
    const lead = await Lead.create({
      name,
      phone,
      email: email || '',
      message: message || '',
      project: projectId || null,
    });

    return NextResponse.json({ ok: true, id: lead._id });
  } catch (err) {
    console.error('Contact error:', err);
    return NextResponse.json({ error: 'Could not submit right now. Please try again.' }, { status: 500 });
  }
}
