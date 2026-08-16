// lib/auth.js
// jose is used instead of jsonwebtoken because it works in both the Node.js
// API route runtime AND the Edge runtime that Next.js middleware uses —
// one library, one code path, no surprises between the two environments.
import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dev-secret-change-me-in-production'
);

const COOKIE_NAME = 'township_token';
const TOKEN_TTL = '7d';

// Sign a JWT for a user. Payload should be small — we only put
// { id, email, role } in it, never the password hash.
export async function signToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_TTL)
    .sign(secret);
}

// Verify a JWT string. Returns the payload, or null if invalid/expired.
export async function verifyToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export { COOKIE_NAME };

// Helper for API routes (Node runtime): read + verify the auth cookie
// from a Next.js Request object's `cookies` API.
export async function getUserFromCookies(cookieStore) {
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return await verifyToken(token);
}
