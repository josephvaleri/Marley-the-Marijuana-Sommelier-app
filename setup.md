# Setup Instructions

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
RAG_EMBEDDING_MODEL=text-embedding-3-large

# App Configuration
NEXT_PUBLIC_APP_NAME="Marley the Marijuana Sommelier"

# Paddle Configuration (Optional - add when ready)
PADDLE_VENDOR_ID=
PADDLE_API_KEY=

# Pricing Configuration
NEXT_PUBLIC_MONTHLY_PRICE=1.99
NEXT_PUBLIC_YEARLY_PRICE=28.99
NEXT_PUBLIC_TRIAL_DAYS=7
```

## Database Setup

1. Run the migration in `supabase/migrations/001_qa_tables.sql` in your Supabase dashboard
2. This creates the Q&A tables, settings, and updates the profiles table

## Development

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Open [http://localhost:3000](http://localhost:3000)

## Testing

Run tests: `npm test`
Run tests in watch mode: `npm run test:watch`

## Deployment

The app is ready for deployment on Vercel. Make sure to add all environment variables in the Vercel dashboard.
