# bytesbeard.github.io

Minimal personal site + blog using:
- Eleventy (11ty)
- Markdown-first posts (content only)
- Optional MDX (only when you really need it)
- TypeScript (bundled with esbuild)
- GitHub Actions deploy to GitHub Pages

## Local dev
```bash
npm install
npm run dev
```

Open: http://localhost:8080

## New post
```bash
npm run new:post -- "My post title"
npm run new:post -- "Half baked idea" --draft
npm run new:post -- "Backfilled post" --date=2025-11-03
npm run new:post -- "Rare MDX post" --mdx
```

## Drafts
Add `draft: true` in frontmatter. Drafts do not generate output.

## Shortcodes available in Markdown posts
Callout:
```njk
{% callout "note", "Title" %}
Content...
{% endcallout %}
```

Keyboard keys:
```njk
Press {% kbd "cmd+k" %}
```
