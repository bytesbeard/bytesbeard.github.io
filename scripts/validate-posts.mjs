import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "src", "blog", "posts");
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function fail(msg) {
  console.error(`\n❌ ${msg}\n`);
  process.exitCode = 1;
}

function listPostFiles(dir) {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .filter((f) => !f.startsWith("_"));
}

const files = listPostFiles(POSTS_DIR);

if (files.length === 0) {
  console.log("ℹ️ No posts found to validate.");
  process.exit(0);
}

for (const file of files) {
  const full = path.join(POSTS_DIR, file);
  const raw = fs.readFileSync(full, "utf8");
  const { data } = matter(raw);

  const isDraft = data.draft === true;

  if (!data.title || String(data.title).trim().length === 0) {
    fail(`${file}: missing required frontmatter field "title"`);
    continue;
  }

  if (!isDraft) {
    if (!data.date) {
      fail(
        `${file}: missing required frontmatter field "date" (YYYY-MM-DD). If it's not ready, set draft: true.`
      );
      continue;
    }

    const dateStr = String(data.date).trim();
    if (!ISO_DATE.test(dateStr)) {
      fail(
        `${file}: invalid "date" format "${dateStr}". Use YYYY-MM-DD (e.g., 2025-03-31).`
      );
      continue;
    }

    const d = new Date(`${dateStr}T00:00:00Z`);
    if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== dateStr) {
      fail(`${file}: "date" is not a valid calendar date: "${dateStr}"`);
      continue;
    }
  }
}

if (process.exitCode === 1) {
  console.error("Post validation failed. Fix the issues above and re-run.");
  process.exit(1);
} else {
  console.log(`✅ Post validation passed (${files.length} files checked).`);
}
