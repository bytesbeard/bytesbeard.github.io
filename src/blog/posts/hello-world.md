---
draft: true
title: Hello, world
description: Starting bytesbeard with 11ty (content-first).
date: 2025-12-31
tags: [platform, writing]
badges:
  - text: "🔥 Hit #1 on HackerNews!!!"
    kind: "hn"         # controls styling
    href: "https://news.ycombinator.com/item?id=XXXXXX"
    list: true
---

{% callout "note", "Rule" %}
The `date` above is manual and used for sorting + display.
{% endcallout %}

A snippet:

```ts
type Budget = { marketing: number; engineering: number; vc: number };

export function burnRate(b: Budget) {
  return b.marketing + b.engineering + b.vc;
}
```

Tiny keys: {% kbd "cmd+k" %}
