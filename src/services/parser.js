const cheerio = require("cheerio");

/**
 * Extracts the audit fields from raw HTML.
 * Pure function: HTML in, plain data out. No network, no side effects,
 * which makes it trivial to unit test on its own.
 */
function parseHtml(html) {
  const $ = cheerio.load(html);

  const title = $("title").first().text().trim() || null;

  const metaDescription =
    $('meta[name="description"]').attr("content")?.trim() ||
    $('meta[property="og:description"]').attr("content")?.trim() ||
    null;

  const h1Count = $("h1").length;

  const images = $("img");
  const imagesTotal = images.length;
  let imagesMissingAlt = 0;
  const missingAltSamples = [];

  images.each((_, el) => {
    const alt = $(el).attr("alt");
    if (alt === undefined || alt.trim() === "") {
      imagesMissingAlt += 1;
      if (missingAltSamples.length < 5) {
        const src = $(el).attr("src") || $(el).attr("data-src") || "(no src)";
        missingAltSamples.push(src);
      }
    }
  });

  // Strip script/style/noscript before counting words so code and CSS
  // don't inflate the count.
  $("script, style, noscript").remove();
  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const wordCount = bodyText.length === 0 ? 0 : bodyText.split(" ").length;

  return {
    title,
    metaDescription,
    h1Count,
    images: {
      total: imagesTotal,
      missingAlt: imagesMissingAlt,
      missingAltSamples,
    },
    wordCount,
  };
}

module.exports = { parseHtml };
