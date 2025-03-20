function escapeHtml(s = "") {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default function (eleventyConfig) {
  // Static assets
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // --- Shortcodes for Markdown posts (no imports, no JSX in posts) ---
  eleventyConfig.addShortcode("kbd", (keys) => {
    return `<kbd class="kbd">${escapeHtml(keys)}</kbd>`;
  });

  eleventyConfig.addPairedShortcode(
    "callout",
    function (content, type = "note", title = "Note") {
      return `
      <aside class="callout callout-${escapeHtml(type)}">
        <div class="callout-title">${escapeHtml(title)}</div>
        <div class="callout-body">${content}</div>
      </aside>
    `.trim();
    }
  );

  // Posts collection (supports .md and .mdx, but default is .md)
  eleventyConfig.addCollection("posts", (api) => {
    return api
      .getFilteredByGlob("src/blog/posts/**/*.{md,mdx}")
      .filter((item) => !item.data.draft)
      .sort((a, b) => (b.date ?? 0) - (a.date ?? 0));
  });

  eleventyConfig.addFilter("date", (value, fmt = "yyyy-MM-dd") => {
    const d = value instanceof Date ? value : new Date(value);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");

    // only format we use right now
    if (fmt === "yyyy-MM-dd") return `${yyyy}-${mm}-${dd}`;

    return d.toISOString().slice(0, 10);
  });

  eleventyConfig.addCollection("tagList", (api) => {
    const posts = api
      .getFilteredByGlob("src/blog/posts/**/*.{md,mdx}")
      .filter((item) => !item.data.draft);

    const all = new Set();
    for (const p of posts) {
      const tags = Array.isArray(p.data.tags)
        ? p.data.tags
        : p.data.tags
        ? [p.data.tags]
        : [];
      tags.filter((t) => t && t !== "post").forEach((t) => all.add(t));
    }
    return Array.from(all).sort((a, b) => a.localeCompare(b));
  });

  eleventyConfig.addFilter("postTags", (tags) => {
    const arr = Array.isArray(tags) ? tags : tags ? [tags] : [];
    return arr.filter((t) => t && t !== "post");
  });

  eleventyConfig.addFilter("year", () => new Date().getFullYear());

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },

    // Let Markdown use Nunjucks so shortcodes work inside posts
    markdownTemplateEngine: "njk",
  };
}
