<script setup lang="ts">
import type { Chapter } from '~/types/chapter/Chapter.type'

const props = defineProps<{
  chapter: Chapter
}>()

</script>

<template>
  <section class="flex-1 relative flex flex-col justify-between">
    <div>
      <div class="navbar py-2.5 px-5 bg-base-100 shadow-sm sticky top-header items-center lg:px-10">
        <span class="hidden font-bold text-xl lg:inline">
          Chapter 1
        </span>

        <div class="ms-auto space-x-2">
          <button class="btn btn-sm">
            <Icon icon="history" :size="20" />
          </button>
          <button class="btn btn-sm">
            <Icon icon="letter_case" :size="20" />
          </button>
          <button class="btn btn-sm">
            <Icon icon="globe" :size="20" />
            <span class="font-bold">
              NAA
            </span>
          </button>
        </div>
      </div>

      <div class="px-10">
        <h1 class="text-xl font-bold text-center text-base-content/40 mt-2">
          Gênesis
        </h1>
        <h2 class="text-7xl font-bold text-center mb-10">
          12
        </h2>
        <div v-for="verse in chapter.verses" :key="verse.id">
          {{ verse.text }}
        </div>
      </div>

    </div>

    <div class="flex justify-between sticky bottom-0 w-full pointer-events-none">
      <button class="btn btn-xl btn-circle mb-15 ms-5 border-2 border-base-300 shadow-sm pointer-events-auto lg:mb-20 lg:ms-10">
        <Icon icon="chevron_left" />
      </button>

      <label for="select_verse_modal" class="btn pointer-events-auto lg:hidden">open modal</label>

      <button class="btn btn-xl btn-circle mb-15 me-5 border-2 border-base-300 shadow-sm pointer-events-auto lg:mb-20 lg:me-10">
        <Icon icon="chevron_right" />
      </button>
    </div>
  </section>
</template>