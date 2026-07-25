const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const { parseHtml } = require("../src/services/parser");

describe("parseHtml — happy path", () => {
  test("extracts title, meta description, H1 count, alt-text audit and word count from valid HTML", () => {
    const html = `
      <html>
        <head>
          <title>  Pricing — plans for every team  </title>
          <meta name="description" content="Compare plans and find the right fit.">
        </head>
        <body>
          <h1>Pricing</h1>
          <img src="/hero.jpg" alt="Team celebrating a launch">
          <img src="/logo.png" alt="">
          <p>Choose the plan that fits your team size and budget today.</p>
        </body>
      </html>
    `;

    const result = parseHtml(html);

    assert.equal(result.title, "Pricing — plans for every team");
    assert.equal(result.metaDescription, "Compare plans and find the right fit.");
    assert.equal(result.h1Count, 1);
    assert.equal(result.images.total, 2);
    assert.equal(result.images.missingAlt, 1);
    assert.deepEqual(result.images.missingAltSamples, ["/logo.png"]);
    // Body text includes the H1 ("Pricing") plus the paragraph's 11 words.
    assert.equal(result.wordCount, 12);
  });

  test("falls back to og:description when a standard meta description is absent", () => {
    const html = `
      <html><head>
        <meta property="og:description" content="Open graph fallback text.">
      </head><body></body></html>
    `;
    const result = parseHtml(html);
    assert.equal(result.metaDescription, "Open graph fallback text.");
  });

  test("counts multiple H1s rather than assuming there is exactly one", () => {
    const html = `<html><body><h1>First</h1><h1>Second</h1></body></html>`;
    const result = parseHtml(html);
    assert.equal(result.h1Count, 2);
  });

  test("treats an img with an alt attribute of only whitespace as missing alt text", () => {
    const html = `<html><body><img src="/a.png" alt="   "></body></html>`;
    const result = parseHtml(html);
    assert.equal(result.images.missingAlt, 1);
  });

  test("strips script and style content out of the word count", () => {
    const html = `
      <html><body>
        <script>const x = "this should not be counted as words";</script>
        <style>.a { color: red; padding: 10px; }</style>
        <p>Only these four words count.</p>
      </body></html>
    `;
    const result = parseHtml(html);
    assert.equal(result.wordCount, 5);
  });
});

describe("parseHtml — failure / edge cases", () => {
  test("handles a page with no title, no meta, no headings, no images without throwing", () => {
    const html = `<html><body><p>Just a paragraph, nothing else on this page.</p></body></html>`;

    assert.doesNotThrow(() => parseHtml(html));
    const result = parseHtml(html);

    assert.equal(result.title, null);
    assert.equal(result.metaDescription, null);
    assert.equal(result.h1Count, 0);
    assert.equal(result.images.total, 0);
    assert.equal(result.images.missingAlt, 0);
    assert.deepEqual(result.images.missingAltSamples, []);
  });

  test("handles malformed, unclosed HTML without throwing", () => {
    const brokenHtml = `<html><head><title>Broken page<body><h1>Heading with no closing tags <img src="/x.png"`;

    assert.doesNotThrow(() => parseHtml(brokenHtml));
    const result = parseHtml(brokenHtml);

    // cheerio is lenient with malformed markup — we only assert that
    // parsing completes and returns the expected shape, not exact values.
    assert.equal(typeof result.h1Count, "number");
    assert.equal(typeof result.wordCount, "number");
    assert.ok(Array.isArray(result.images.missingAltSamples));
  });

  test("handles a completely empty string without throwing and returns zeroed-out fields", () => {
    assert.doesNotThrow(() => parseHtml(""));
    const result = parseHtml("");

    assert.equal(result.title, null);
    assert.equal(result.h1Count, 0);
    assert.equal(result.wordCount, 0);
    assert.equal(result.images.total, 0);
  });
});
