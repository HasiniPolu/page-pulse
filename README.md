# Page Pulse

A website vitals monitor. Paste any URL and get back a JSON report: HTTP
status, response time, page title, meta description, H1 count, images
missing alt text, and an approximate word count — plus a frontend that
renders it cleanly.
## Features

- Analyze any website URL
- HTTP Status Detection
- Response Time Measurement
- Page Title Extraction
- Meta Description Detection
- H1 Count
- Images Missing ALT Text
- Approximate Word Count
- Responsive Dashboard
- Proper Error Handling
## Tech Stack

### Frontend
- React.js
- CSS3

### Backend
- Node.js
- Express.js

### Libraries
- Axios
- Cheerio
## Live Demo

https://page-pulse-rlj0.onrender.com/

## Run locally

```bash
npm install
npm start
```

Open `http://localhost:3000`.

## API

**POST `/api/audit`**

```json
// request
{ "url": "https://example.com" }
```

```json
// 200 response
{
  "data": {
    "url": "https://example.com/",
    "httpStatus": 200,
    "ok": true,
    "responseTimeMs": 312,
    "title": "Example Domain",
    "metaDescription": null,
    "h1Count": 1,
    "images": { "total": 0, "missingAlt": 0, "missingAltSamples": [] },
    "wordCount": 28,
    "checkedAt": "2026-07-25T10:00:00.000Z"
  }
}
```

```json
// error response (4xx/5xx)
{
  "error": { "code": "TIMEOUT", "message": "The page took longer than 8s to respond." }
}
```

| Code | Status | When |
|---|---|---|
| `MISSING_URL` / `INVALID_URL` / `UNSUPPORTED_PROTOCOL` | 400 | Malformed input |
| `TIMEOUT` | 504 | No response within 8s |
| `UNREACHABLE` | 502 | DNS failure, connection refused, etc. |
| `NOT_HTML` | 415 | The URL returned a non-HTML content type |
| `PAGE_TOO_LARGE` | 413 | Response body over 5MB |
| `INTERNAL_ERROR` | 500 | Anything unexpected |

`GET /api/health` returns `{ "status": "ok" }` for uptime checks.

## Project structure

```
src/
  server.js            Express app entry
  routes/audit.js       HTTP layer only — no business logic
  services/
    fetcher.js           Network fetch, timeout, size cap
    parser.js             Pure HTML -> vitals extraction (cheerio)
    auditService.js       Orchestrates fetcher + parser into a report
  middleware/errorHandler.js  Centralized error -> HTTP response mapping
  utils/
    AppError.js            Typed error with status + code
    validateUrl.js          Input validation
public/
  index.html              Frontend, calls POST /api/audit
```

Each layer has one job: routes handle HTTP, services handle logic,
`AppError` carries the failure reason all the way to the response without
route code needing to know the details.

## Deploying (free tier)

**Render**
1. Push this repo to GitHub.
2. New → Web Service → connect the repo.
3. Build command: `npm install`. Start command: `npm start`.
4. Deploy — Render provides the live URL.

**Railway / Fly.io** work the same way: point at the repo, `npm start` as
the run command, no environment variables required.

## Notes

- Timeout is 8s per request; response body is capped at 5MB.
- Redirects are followed automatically; the final URL is included in the
  report when it differs from the input.
- Word count is approximate — text content only, scripts/styles stripped.
