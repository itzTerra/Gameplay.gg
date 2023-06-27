<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const SITE_NAME = "Gameplay.gg";

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - ${SITE_NAME}` : SITE_NAME;
  },
  link: [{ rel: "icon", type: "image/x-icon", href: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text x=%22-0.1em%22 y=%22.9em%22 font-size=%2285%22>🎮</text></svg>" }],
  meta: [
    {
      name: "ogTitle",
      content: SITE_NAME,
    },
    {
      name: "description",
      content:
        "Community-driven gameplay database. Search for a gameplay easy and fast.",
    },
    {
      name: "ogDescription",
      content:
        "Community-driven gameplay database. Search for a gameplay easy and fast.",
    },
    // {
    //   name: "ogImage",
    //   content: "https://example.com/image.png",
    // },
    {
      name: "twitterCard",
      content: "summary_large_image",
    },
  ],
});
</script>
