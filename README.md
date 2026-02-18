# AI-FAQ-System-for-University

## Environment Variables

- `GEMINI_API_KEY`: Required for generating FAQ answers.
- `SOURCE_CACHE_TTL_MS`: Optional cache TTL (in milliseconds) for scraped website text. Defaults to `900000` (15 minutes).
- `DEBUG`: Optional. Set to `true` to include `debug` diagnostics in FAQ API responses (cache TTL, cache size, and retrieval stats).

### FAQ API Debug Override

- You can also enable debug per request with `?debug=1` (also supports `true`, `yes`, `on`), even when `DEBUG` env is not set.