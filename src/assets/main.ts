function markExternalLinks() {
  document.querySelectorAll<HTMLAnchorElement>("a[href^='http']").forEach((a) => {
    const url = new URL(a.href);
    if (url.hostname !== location.hostname) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
  });
}

function getActiveTag(): string {
  const params = new URLSearchParams(location.search);
  const t = params.get("tag");
  return (t && t.trim().length) ? t.trim() : "all";
}

function setActiveTagUI(activeTag: string) {
  const tagBar = document.getElementById("tagBar");
  if (!tagBar) return;

  tagBar.querySelectorAll<HTMLElement>(".tag").forEach((el) => {
    const t = el.getAttribute("data-tag") ?? "all";
    if (t === activeTag || (activeTag === "all" && t === "all")) el.classList.add("is-active");
    else el.classList.remove("is-active");
  });
}

function filterPostsByTag(activeTag: string) {
  const list = document.getElementById("postList");
  if (!list) return;

  const tagLower = activeTag.toLowerCase();

  list.querySelectorAll<HTMLElement>(".post-item").forEach((li) => {
    if (activeTag === "all") {
      li.style.display = "";
      return;
    }
    const tags = (li.getAttribute("data-tags") ?? "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    li.style.display = tags.includes(tagLower) ? "" : "none";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  markExternalLinks();

  const active = getActiveTag();
  setActiveTagUI(active);
  filterPostsByTag(active);
});
