# Page Pulse

A lightweight website auditing tool that analyzes any webpage and provides key performance, SEO, and accessibility metrics. Built with Node.js and Express.

---

## Live Demo

https://page-pulse-rlj0.onrender.com/

---

## GitHub Repository

https://github.com/HasiniPolu/page-pulse

---

## Features

- Audit any public website URL
- HTTP status detection
- Response time measurement
- Extract page title
- Extract meta description
- Count H1 headings
- Detect images missing alt text
- Approximate page word count
- Handles invalid URLs gracefully
- Handles non-HTML responses
- Handles request timeouts

---

## Tech Stack

- Node.js
- Express.js
- Cheerio
- HTML
- CSS
- JavaScript

---

## Installation

Clone the repository:

```bash
git clone https://github.com/HasiniPolu/page-pulse.git
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

Open:

```
http://localhost:3000
```

---

## Running Tests

Run all automated tests:

```bash
npm test
```

Expected output:

```
Suites: 4
Pass: 13
Fail: 0
```

---

## API Contract

### POST `/api/audit`

#### Request

```json
{
  "url": "https://example.com"
}
```

#### Successful Response

```json
{
  "status": 200,
  "responseTime": 132,
  "title": "Example Domain",
  "metaDescription": "Example description",
  "h1Count": 1,
  "missingAltCount": 0,
  "wordCount": 412
}
```

#### Error Response

```json
{
  "error": "Invalid URL"
}
```

---

## Project Structure

```
page-pulse/
│
├── public/
├── src/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── fetcher.js
│   ├── parser.js
│   ├── auditService.js
│   └── server.js
│
├── test/
│   ├── parser.test.js
│   └── validateUrl.test.js
│
├── package.json
├── README.md
└── .gitignore
```

---

## Design Decisions

### 1. Separation of Parsing Logic

The HTML parser is implemented independently from the network-fetching logic. This separation makes the parser easier to test using sample HTML without making HTTP requests.

### 2. Centralized Error Handling

A custom `AppError` class provides consistent and readable error responses throughout the application while simplifying error management.

### 3. Safe Network Requests

The application enforces an 8-second timeout and limits response size to prevent long-running requests and excessive memory usage.

---

## Testing

Automated tests cover:

- HTML parser functionality
- URL validation
- Error handling
- Edge cases

Current test status:

- ✅ 4 Test Suites
- ✅ 13 Tests Passed
- ✅ 0 Failures

---

## Footer Requirement

The deployed application includes the required footer:

**Built for Digital Heroes Training Task**

linked to:

https://digitalheroesco.com