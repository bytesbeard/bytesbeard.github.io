module.exports = {
  layout: "layouts/post.njk",
  tags: ["post"],

  permalink: (data) => {
    if (data.draft) return false;
    return `/blog/${data.page.fileSlug}/`;
  },

  eleventyComputed: {
    displayTags: (data) => {
      const tags = Array.isArray(data.tags)
        ? data.tags
        : data.tags
        ? [data.tags]
        : [];
      return tags.filter((t) => t && t !== "post");
    },
  },
};
