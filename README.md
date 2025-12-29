# Voice Clip – AI Voice Message Summarizer

<img width="1877" height="895" alt="voice-clip-hero" src="https://github.com/user-attachments/assets/82e6f453-adbd-4b70-a13c-e0c2140fe519" />


[**Live (voiceclip.eu)**](https://voiceclip.eu)

## About this Repository (Technical Showcase)

This repository serves as a **vertical slice** (code showcase) of a production SaaS application called **Voice Clip**. 

Since the full project is a commercial product currently in use, I cannot open-source the entire codebase. Instead, I have selected key files that demonstrate my skills in:
* **Full-stack development** with Next.js (App Router & API Routes).
* **System architecture** (handling asynchronous webhooks and data processing pipelines).
* **AI Integration** (Whisper V3 for transcription & GPT-4 for summarization).
* **Payment processing** (Stripe integration with webhooks).

**Note to Recruiters:** I am available to walk through the full codebase and live deployment during an interview.

### Tech Stack

* **Framework:** Next.js (TypeScript)
* **Styling:** Tailwind CSS
* **Database:** Supabase (PostgreSQL)
* **AI & ML:** OpenAI API (GPT-4o/Mini), Fireworks AI (Whisper V3)
* **Integrations:** Facebook Graph API (Messenger Bot), Stripe
* **Deployment:** Vercel

### Key Files to Review

I recommend checking these files to gauge the code quality and logic:

1.  **Core Logic / Orchestration:** [`pages/api/facebook-webhook.ts`](pages/api/facebook-webhook.ts)
    *  This is the heart of the backend. It handles the Messenger webhook, verifies tokens, manages the pipeline (Audio -> Text -> Summary), and enforces user limits (Free vs Premium).

2.  **AI Integration & Prompt Engineering:** [`utils/openAi.ts`](utils/openAi.ts)
    *  Shows how I structure system prompts to achieve a specific "persona" (slang/casual tone) for the summaries, distinct for Polish and English languages.

3.  **Modern UI Components:** [`app/components/SpotlightCard.tsx`](app/components/SpotlightCard.tsx)
    *  Demonstrates interactive frontend skills using React hooks (`useRef`, `useState`) and mathematical calculations for mouse-following effects.

4.  **Payment Flow:** [`pages/api/stripe/create-checkout-session.ts`](pages/api/stripe/create-checkout-session.ts)
    *  Shows commercial implementation – creating secure Stripe sessions and passing metadata to link payments with specific Facebook users.

### Environment & Security

This project relies on strict environment variable management. Secrets (Stripe Keys, OpenAI Keys, FB Access Tokens) are never exposed to the client.

Example `.env.example` structure included in the repo:
```bash
# AI Services
OPENAI_API_KEY=...
FIREWORKS_API_KEY=...

# Facebook Graph API
FB_PAGE_ACCESS_TOKEN=...
FB_VERIFY_TOKEN=...

# Payments & DB
STRIPE_SECRET_KEY=...
NEXT_PUBLIC_SUPABASE_URL=...
