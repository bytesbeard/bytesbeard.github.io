import fs from "node:fs";
import path from "node:path";

const POSTS_DIR = path.join(process.cwd(), "src", "blog", "posts");

function usage() {
  console.log(`
Usage:
  npm run new:post -- "My Post Title"
  npm run new:post -- "My Post Title" --draft
  npm run new:post -- "My Post Title" --date=YYYY-MM-DD
  npm run new:post -- "My Post Title" --mdx
  npm run new:post -- "My Post Title" --mdx --draft
`);
}

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const titleParts = [];
  let draft = false;
  let date = null;
  let mdx = false;

  for (const a of args) {
    if (a === "--draft") draft = true;
    else if (a === "--mdx") mdx = true;
    else if (a.startsWith("--date=")) date = a.slice("--date=".length).trim();
    else if (a === "--help" || a === "-h") return { help: true };
    else titleParts.push(a);
  }

  const title = titleParts.join(" ").trim();
  return { help: false, title, draft, date, mdx };
}

function ensureDirExists(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const { help, title, draft, date, mdx } = parseArgs(process.argv);

if (help || !title) {
  usage();
  process.exit(help ? 0 : 1);
}

const slug = slugify(title);
if (!slug) {
  console.error("❌ Could not generate a slug from the given title.");
  process.exit(1);
}

ensureDirExists(POSTS_DIR);

const ext = mdx ? "mdx" : "md";
const filename = `${slug}.${ext}`;
const filepath = path.join(POSTS_DIR, filename);

if (fs.existsSync(filepath)) {
  console.error(`❌ File already exists: src/blog/posts/${filename}`);
  process.exit(1);
}

const publishDate = date ?? (!draft ? todayISO() : null);

const frontmatter = [
  "---",
  `title: "${title.replace(/"/g, '\\"')}"`,
  draft ? `draft: true` : `date: ${publishDate}`,
  `description: ""`,
  "---"
].join("\n");

const mdTemplate = `${frontmatter}

{% callout "note", "One-liner" %}
Write the punchy premise here.
{% endcallout %}

## Context

## The point

## Example

\`\`\`bash
# example command
\`\`\`

## Takeaway

Tip: keys look like this → {% kbd "cmd+k" %}
`;

const mdxTemplate = `${frontmatter}

<!-- MDX is optional. Use it only when you really need JSX/components. -->

## Context

Write.
`;

fs.writeFileSync(filepath, mdx ? mdxTemplate : mdTemplate, "utf8");

console.log(`✅ Created: src/blog/posts/${filename}`);
console.log(`   URL will be: /blog/${slug}/`);
if (!draft) console.log(`   Publish date: ${publishDate}`);
else console.log(`   Draft: true (won't be published)`);
