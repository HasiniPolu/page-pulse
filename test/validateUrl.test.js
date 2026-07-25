const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const validateUrl = require("../src/utils/validateUrl");
const AppError = require("../src/utils/AppError");

describe("validateUrl — happy path", () => {
  test("accepts a well-formed https URL and returns a URL instance", () => {
    const result = validateUrl("https://example.com/pricing");
    assert.ok(result instanceof URL);
    assert.equal(result.toString(), "https://example.com/pricing");
  });

  test("trims surrounding whitespace before validating", () => {
    const result = validateUrl("   https://example.com   ");
    assert.equal(result.hostname, "example.com");
  });
});

describe("validateUrl — failure cases", () => {
  test("rejects a missing/empty URL with a 400 AppError", () => {
    assert.throws(() => validateUrl(""), (err) => {
      assert.ok(err instanceof AppError);
      assert.equal(err.statusCode, 400);
      assert.equal(err.code, "MISSING_URL");
      return true;
    });
  });

  test("rejects an unparseable string with a 400 INVALID_URL error", () => {
    assert.throws(() => validateUrl("not a url at all"), (err) => {
      assert.ok(err instanceof AppError);
      assert.equal(err.statusCode, 400);
      assert.equal(err.code, "INVALID_URL");
      return true;
    });
  });

  test("rejects a non-http(s) protocol with a 400 UNSUPPORTED_PROTOCOL error", () => {
    assert.throws(() => validateUrl("ftp://example.com/file.txt"), (err) => {
      assert.ok(err instanceof AppError);
      assert.equal(err.statusCode, 400);
      assert.equal(err.code, "UNSUPPORTED_PROTOCOL");
      return true;
    });
  });
});
