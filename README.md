# Marley the Marijuana Sommelier

A production-ready web app featuring an AI-powered cannabis consultant built with Next.js 14, Supabase, and OpenAI.

## Features

- 🤖 **AI-Powered RAG System**: Database-first answers with vector search and OpenAI fallback
- 🎭 **Animated Avatar**: Marley with blinking, swaying, and state-based animations
- 🔍 **Smart Question Detection**: Automatically categorizes questions by type
- 📚 **Comprehensive Database**: Cannabis strains, effects, growing guides, and more
- 🔐 **Authentication**: Supabase auth with roles and trial management
- 💳 **Subscription System**: Paddle integration for monthly/yearly plans
- 🎨 **Modern UI**: Tailwind CSS with shadcn/ui components
- 📱 **Responsive Design**: Mobile-first with desktop optimization

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI, Framer Motion
- **Backend**: Supabase (Auth, Postgres, Storage, pgvector)
- **AI**: OpenAI GPT-4, text-embedding-3-large
- **State Management**: React Query (TanStack)
- **Forms**: react-hook-form + zod
- **Themes**: next-themes (dark/light mode)

## Quick Start

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd marley-marijuana-somm
   npm install
   ```

2. **Set up environment variables:**
   Create `.env.local` with the following variables:
   ```env
   # Supabase
   SUPABASE_URL=your_supabase_url_here
   SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

   # OpenAI
   OPENAI_API_KEY=your_openai_api_key_here
   RAG_EMBEDDING_MODEL=text-embedding-3-large

   # App
   NEXT_PUBLIC_APP_NAME="Marley the Marijuana Sommelier"

   # Pricing
   NEXT_PUBLIC_MONTHLY_PRICE=1.99
   NEXT_PUBLIC_YEARLY_PRICE=28.99
   NEXT_PUBLIC_TRIAL_DAYS=7
   ```

3. **Run database migrations:**
   ```bash
   # Apply the migration in supabase/migrations/001_qa_tables.sql
   # This creates the Q&A tables, settings, and updates profiles
   ```

4. **Add Marley avatar image:**
   Place your avatar image at `public/marley.png`

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The app uses an existing cannabis database schema with additional tables for Q&A functionality:

### Core Tables
- `profiles` - User profiles with roles and subscription info
- `strains` - Cannabis strain information
- `effects`, `conditions`, `terpenes` - Effect and compound data
- `grow_guides` - Growing information
- `products`, `vendors` - Product and vendor data

### Q&A Tables (New)
- `qa_questions` - User questions
- `qa_answers` - AI-generated answers with source tracking
- `qa_feedback` - User feedback on answers
- `ml_training_queue` - Moderation queue for ML training
- `settings` - App configuration

## RAG System

The app implements a sophisticated RAG (Retrieval-Augmented Generation) system:

1. **Question Type Detection**: Automatically categorizes questions
2. **Database-First Search**: Direct SQL queries for structured data
3. **Vector Search**: Semantic search through reference documents
4. **OpenAI Fallback**: GPT-4 for complex or novel questions

## Admin Features

- User management with role assignment
- Document upload and processing
- Q&A moderation queue
- Settings management
- Trial and subscription management

## Deployment

The app is ready for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## Development

### Adding New Components
```bash
npx shadcn@latest add [component-name]
```

### Database Migrations
Create new migration files in `supabase/migrations/` following the naming convention.

### Testing
```bash
npm run test
```

## License

This project is for educational and research purposes. Please ensure compliance with local laws regarding cannabis-related applications.