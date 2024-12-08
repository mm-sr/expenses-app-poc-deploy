const requiredServerEnvVars = [
] as const;

const requiredClientEnvVars = [
  'NEXT_PUBLIC_API_URL',
] as const;

type ServerEnvVars = typeof requiredServerEnvVars[number];
type ClientEnvVars = typeof requiredClientEnvVars[number];

// Validate server-side environment variables
export function validateServerEnv() {
  for (const envVar of requiredServerEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required server environment variable: ${envVar}`);
    }
  }
}

// Validate client-side environment variables
export function validateClientEnv() {
  for (const envVar of requiredClientEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required client environment variable: ${envVar}`);
    }
  }
}

// Type-safe environment variables
export const env = {
  // Server-side variables (only available in Server Components, API routes, etc.)
  server: {
    // apiKey: process.env.API_KEY as string, // Temporarily disabled
    // databaseUrl: process.env.DATABASE_URL as string, // Temporarily disabled
    // authSecret: process.env.AUTH_SECRET as string, // Temporarily disabled
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
  // Client-side variables (must be prefixed with NEXT_PUBLIC_)
  client: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL as string,
  },
} as const;