<script setup lang="ts">

</script>

<template>
  <section class="p-5 pt-0 overflow-y-auto h-full">
    <div class="pt-5 bg-base-100 sticky top-0">
      <label class="input mb-2 w-full">
        <Icon icon="search" :size="25" />
        <input type="search" class="grow text-base-content" placeholder="Pesquise um livro" />
      </label>
    </div>
    <div class="flex flex-col gap-1 text-start">
      <button v-for="book in Object.values(BOOKS_INFO)" :key="book.name" class="btn btn-ghost justify-start h-8 w-full">
        {{ book.name }}
      </button>
    </div>
  </section>
</template>