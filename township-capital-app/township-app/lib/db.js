// lib/db.js
// Cached Mongoose connection so serverless function invocations (Vercel)
// reuse the same connection instead of opening a new one on every request.
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  // Thrown at request time, not at build time, so `next build` still works
  // without a real DB configured.
  console.warn('MONGODB_URI is not set. Add it to your .env.local file.');
}

let cached = global._mongooseCache;
if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
