<script setup lang="ts">

const isModalOpen = ref(false)
</script>

<template>
  <main class="flex-1 flex justify-between">
    <input type="checkbox" id="verse_selector" class="modal-toggle" checked />
    <!-- {{ isSmallScreen }} -->
    <!-- <div
      class="bg-base-100 border-e-2 border-base-300 fixed top-0 left-0 bottom-0 right-0 z-1 sm:p-24 sm:bg-black/50 md:px-56 lg:p-0 lg:w-1/5 lg:sticky lg:top-header lg:h-screen-header"
    >
      <BibleVerseSelector class="bg-base-100 rounded-2xl" />
    </div> -->

    <input v-model="isModalOpen" type="checkbox" id="select_verse_modal" class="modal-toggle" />
    <div
      class="lg:w-1/5 lg:sticky lg:top-header lg:h-screen-header"
      :class="{'modal': isModalOpen}"
      role="dialog"
    >
      <div
        class="hidden p-0 h-full sm:h-4/5 overflow-hidden lg:block lg:w-full lg:h-full lg:rounded-none"
        :class="{'block! modal-box w-full max-w-full rounded-none pb-10': isModalOpen}"
      >
        <div class="flex justify-between items-end ps-8 pt-2 pb-0 pe-2 lg:hidden">
          <span class="text-xl font-bold">
            Selecione o livro
          </span>
          <label
            for="select_verse_modal"
            class="btn btn-ghost p-2"
          >
            <Icon icon="close" :size="25" />
          </label>
        </div>
        <BibleVerseSelector class="bg-base-100 rounded-2xl" />
      </div>
      <label class="modal-backdrop" for="select_verse_modal" />
    </div>
    <BibleChapter />

    <section class="hidden h-40 fixed left-0 bottom-0 right-0 bg-blue-500 lg:relative lg:w-2/6 lg:h-auto">
      Seleted verses
    </section>
  </main>
</template>