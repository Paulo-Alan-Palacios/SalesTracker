/** Validates that a required environment variable is present and returns it. */
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

/** Validated, typed app configuration — fails fast at startup if anything is missing. */
export const config = {
  jwtSecret:   requireEnv('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '8h',
  port:        process.env.PORT ?? '3000',
  corsOrigin:  process.env.CORS_ORIGIN ?? 'http://localhost:5173',
} as const;
