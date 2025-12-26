<script setup lang="ts">

</script>

<template>
  <main class="flex-1 flex justify-between">
    <BibleVerseSelectorResponsivePanel />

    <BibleChapter />

    <section class="hidden h-40 fixed left-0 bottom-0 right-0 bg-blue-500 lg:relative lg:w-2/6 lg:h-auto">
      Seleted verses
    </section>
  </main>
</template>