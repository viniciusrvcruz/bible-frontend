<script setup lang="ts">

const search = ref('')

const filteredBooks = computed(() => {
  const normalizedSearch = normalizeString(search.value)

  return Object.values(BOOKS_INFO)
    .filter(book => normalizeString(book.name).includes(normalizedSearch))
})

</script>

<template>
  <section class="p-5 pt-0 overflow-y-auto h-full">
    <div class="pt-5 bg-base-100 sticky top-0">
      <label class="input mb-2 w-full">
        <Icon icon="search" :size="25" />
        <input
          v-model="search"
          type="search"
          class="grow text-base-content"
          placeholder="Pesquise um livro"
        />
      </label>
    </div>
    <div class="flex flex-col gap-3 md:gap-2 text-start">
      <button
        v-for="book in filteredBooks"
        :key="book.name"
        class="btn btn-ghost justify-start text-base w-full lg:text-sm xl:text-base"
      >
        {{ book.name }}
      </button>
    </div>
  </section>
</template>