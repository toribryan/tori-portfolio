/**
 * Whole-site password gate.
 *
 * The session cookie is an expiring HMAC token — `<expiry>.<signature>`, signed
 * with `SITE_PASSWORD` — rather than a hash of the password itself. A leaked
 * cookie therefore expires on its own and can't be taken offline and cracked
 * back into the password.
 *
 * Web Crypto only, no Node built-ins: this runs in middleware on the Edge
 * runtime as well as in the route handler.
 */

export const SITE_AUTH_COOKIE = "site_auth"

/** How long a successful login stays valid. */
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30 // 30 days

const encoder = new TextEncoder()

async function sign(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  )

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

/**
 * Compares two hex strings without leaking, via timing, how many leading
 * characters matched.
 */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }

  let mismatch = 0
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }

  return mismatch === 0
}

export async function createSessionToken(password: string): Promise<string> {
  const expiresAt = String(Date.now() + SESSION_TTL_MS)
  return `${expiresAt}.${await sign(password, expiresAt)}`
}

export async function verifySessionToken(
  token: string | undefined,
  password: string
): Promise<boolean> {
  if (!token) {
    return false
  }

  const separator = token.indexOf(".")
  if (separator === -1) {
    return false
  }

  const expiresAt = token.slice(0, separator)
  const signature = token.slice(separator + 1)

  const expiresAtMs = Number(expiresAt)
  if (!Number.isFinite(expiresAtMs) || Date.now() > expiresAtMs) {
    return false
  }

  return safeEqual(signature, await sign(password, expiresAt))
}

/**
 * Checks a submitted password against the configured one.
 *
 * Compares HMACs rather than the raw strings so the comparison is both
 * constant-time and fixed-length — comparing the passwords directly would
 * reveal the expected length through an early return.
 */
export async function passwordMatches(
  submitted: string,
  expected: string
): Promise<boolean> {
  const probe = "site-auth-probe"
  const [a, b] = await Promise.all([
    sign(submitted, probe),
    sign(expected, probe),
  ])

  return safeEqual(a, b)
}
