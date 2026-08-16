// lib/hash.js
// bcryptjs (pure JS) instead of bcrypt (native binding) — avoids native
// build issues on serverless platforms like Vercel.
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export async function hashPassword(plain) {
  return await bcrypt.hash(plain, SALT_ROUNDS);
}

export async function comparePassword(plain, hash) {
  return await bcrypt.compare(plain, hash);
}
