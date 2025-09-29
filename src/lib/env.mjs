import { z } from 'zod'

const envSchema = z.object({
  // Supabase
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),

  // OpenAI
  OPENAI_API_KEY: z.string(),
  RAG_EMBEDDING_MODEL: z.string().default('text-embedding-3-large'),

  // App
  NEXT_PUBLIC_APP_NAME: z.string().default('Marley the Marijuana Sommelier'),

  // Paddle
  PADDLE_VENDOR_ID: z.string().optional(),
  PADDLE_API_KEY: z.string().optional(),

  // Pricing
  NEXT_PUBLIC_MONTHLY_PRICE: z.string().transform(Number).default(1.99),
  NEXT_PUBLIC_YEARLY_PRICE: z.string().transform(Number).default(28.99),
  NEXT_PUBLIC_TRIAL_DAYS: z.string().transform(Number).default(7),
})

const env = envSchema.parse(process.env)

export default env