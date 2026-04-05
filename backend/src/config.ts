/** Validates that a required environment variable is present and returns it. */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

/** Validates JWT secret is strong enough (min 32 chars). */
function requireJwtSecret(): string {
  const secret = requireEnv('JWT_SECRET');
  if (secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }
  return secret;
}

/** Validated, typed app configuration — fails fast at startup if anything is missing. */
export const config = {
  jwtSecret:   requireJwtSecret(),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '8h',
  port:        process.env.PORT ?? '3000',
  corsOrigin:  process.env.CORS_ORIGIN ?? 'http://localhost:5173',
} as const;
