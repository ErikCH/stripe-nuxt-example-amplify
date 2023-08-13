<script lang="ts" setup>
useHead({
  link: [
    {
      rel: "stylesheet",
      href: "https://unpkg.com/nes.css@latest/css/nes.min.css"
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css?family=Press+Start+2P"
    }
  ],
  title: "Video Game Store"
});
</script>
<template>
  <div class="main">
    <NuxtPage />
  </div>
</template>
<style>
.main {
  max-width: 768px;
  margin: auto;
  margin-top: 100px;
}
</style>
