<script setup lang="ts">

</script>

<template>
  <main class="flex-1 flex justify-between">
    <section class="p-5 pt-0 bg-base-100 border-e-2 border-base-300 overflow-y-auto fixed top-0 left-0 bottom-0 right-0 z-1 lg:w-1/5 lg:sticky lg:top-header lg:h-screen-header">
      <div class="pt-5 bg-base-100 sticky top-0">
        <label class="input mb-2">
          <Icon icon="search" :size="25" />
          <input type="search" class="grow" placeholder="Pesquise um livro" />
        </label>
      </div>

      <div class="flex flex-col gap-1 text-start">
        <button v-for="book in Object.values(BOOKS_INFO)" :key="book.name" class="btn btn-ghost justify-start h-8 w-full">
          {{ book.name }}
        </button>
      </div>
    </section>

    <BibleChapter />

    <section class="hidden h-40 fixed left-0 bottom-0 right-0 bg-blue-500 lg:relative lg:w-2/6 lg:h-auto">
      Seleted verses
    </section>
  </main>
</template>