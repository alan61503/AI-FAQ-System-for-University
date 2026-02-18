# AI FAQ System for University

AI-powered university FAQ web app built with Next.js + TypeScript. It retrieves content from official university web pages, ranks relevant passages, generates concise answers with Gemini, and collects user feedback for analytics.

## Highlights

- Multi-page UI: Home, About, Contact, Login, Admin Analytics
- Typewriter-style hero section and modern responsive layout
- Retrieval pipeline from official sources (scrape, clean, chunk, rank)
- LLM answer generation with citations and confidence
- Feedback capture (`thumbs up/down`, comments, confidence, citations)
- Admin dashboard with summary metrics and CSV export
- Debug diagnostics for retrieval and source-cache behavior

## Tech Stack

- Next.js 13 (App Router)
- React 18 + TypeScript
- Tailwind CSS + Material Tailwind
- Google Generative AI SDK (`@google/generative-ai`)

## Project Structure

```text
src/
	app/
		page.tsx                 # Main landing page (Hero + sections)
		about/page.tsx           # About page
		contact/page.tsx         # Contact page
		login/page.tsx           # Login page (UI placeholder)
		admin/page.tsx           # Feedback analytics dashboard
		api/
			faq/route.ts           # Main FAQ generation endpoint
			feedback/route.ts      # Save feedback records
			feedback/summary/route.ts
			feedback/export/route.ts
			models/route.ts        # List available Gemini models
	components/
	lib/
		christ-sources.ts        # Source scraping + cache + ranking
		mock-faqs.ts             # Mock fallback data
		user-data.ts             # User-provided context matcher
data/
	feedback.jsonl             # Feedback storage (generated at runtime)
public/image/illustrations/  # UI illustrations
```

## Prerequisites

- Node.js 18+
- npm
- A Google Gemini API key

## Getting Started

1) Install dependencies

```bash
npm install
```

2) Create `.env.local`

```env
GEMINI_API_KEY=your_api_key_here
SOURCE_CACHE_TTL_MS=900000
DEBUG=false
```

3) Run development server

```bash
npm run dev
```

4) Open

```text
http://localhost:3000
```

## Environment Variables

- `GEMINI_API_KEY` (required): Gemini key used by `POST /api/faq` and `GET /api/models`
- `SOURCE_CACHE_TTL_MS` (optional): in-memory cache TTL for scraped source text (ms). Default: `900000` (15 min)
- `DEBUG` (optional): set `true` to include debug diagnostics in FAQ API responses

### Request-level Debug Override

You can enable debug per request even if `DEBUG=false`:

- `POST /api/faq?debug=1`
- Also supports: `true`, `yes`, `on`

## API Endpoints

### `POST /api/faq`

Generate an answer for a user question.

Request body:

```json
{
	"question": "When is the exam schedule published?"
}
```

Response shape:

```json
{
	"answer": "...",
	"confidence": 0.78,
	"citations": [{ "label": "christuniversity.in/examination", "url": "https://..." }],
	"sources": ["christuniversity.in/examination"]
}
```

When debug is enabled, response also contains:

- `debug.scraperCache` (`ttlMs`, `cachedEntries`, `inflightRequests`)
- `debug.retrieval` (`officialChunkCount`, `officialCitationCount`, `usedMockFallback`, `usedUserData`)

### `POST /api/feedback`

Stores feedback in `data/feedback.jsonl`.

Required fields:

- `question`
- `answer`
- `rating` (`up` | `down`)

Optional fields:

- `comment`, `confidence`, `citations`

### `GET /api/feedback/summary`

Returns analytics summary for admin dashboard:

- totals, helpful/unhelpful counts and rates
- average confidence
- top negative topics
- recent feedback items

### `GET /api/feedback/export`

Downloads feedback as CSV.

### `GET /api/models`

Lists available models from Gemini API.

## Retrieval + Generation Flow

1. Accept question
2. Check mock quick-hit fallback
3. Fetch official source pages (with cache)
4. Clean HTML and remove noisy content
5. Split content into chunks and rank by query relevance
6. Build LLM prompt from ranked chunks + optional user dataset + mock snippets
7. Parse model JSON response and return answer + citations + confidence

## Feedback & Analytics

- Feedback records are appended to `data/feedback.jsonl`
- Admin page (`/admin`) shows metrics and recent comments
- CSV export is available from admin page or direct endpoint

## Available Scripts

- `npm run dev` — start local dev server
- `npm run build` — create production build
- `npm run start` — run production server
- `npm run lint` — run lint checks

## Troubleshooting

- `GEMINI_API_KEY is not set`:
	- Ensure `.env.local` exists and server is restarted
- Empty/weak official retrieval:
	- Lower/raise `SOURCE_CACHE_TTL_MS` and retry
	- Enable debug (`?debug=1`) to inspect retrieval metrics
- No feedback shown in admin:
	- Ensure at least one feedback submission is made
	- Verify `data/feedback.jsonl` exists and is writable

## Notes

- Source-text cache is in-memory and resets on server restart
- Contact/Login pages currently provide UI workflow only (no backend auth/contact service wired yet)

---

If you want, I can also add a small `CONTRIBUTING.md` and `.env.example` so onboarding is one command faster for collaborators.