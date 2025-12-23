<script setup lang="ts">
import ThemeSelectorPopover from '~/components/global/popover/ThemeSelectorPopover.vue';

const themeSelectorPopoverRef = ref()

</script>

<template>
  <div class="drawer">
    <input id="drawer" type="checkbox" class="drawer-toggle" />

    <div class="drawer-content flex flex-col">
      <div class="navbar bg-base-300 w-full justify-between items-center py-0 lg:px-10">
        <div class="flex-none lg:hidden">
          <label for="drawer" aria-label="open sidebar" class="btn btn-ghost">
            <Icon icon="menu" :size="25" />
          </label>
        </div>

        <div class="hidden flex-none justify-between items-center lg:flex">
          <Icon icon="book_marked" :size="30" />

          <ul class="menu menu-horizontal gap-2 ms-5">
            <li>
              <a>
                <Icon icon="book_open" :size="20" />
                Bíblia
              </a>
            </li>
            <li>
              <a>
                <Icon icon="document" :size="20" />
                Navbar Item 2
              </a>
            </li>
          </ul>
        </div>

        <ul class="menu menu-horizontal gap-2 items-center">
          <li>
            <button v-tooltip.bottom="'Ajuda'" class="p-2">
              <Icon icon="circle_question" :size="22" />
            </button>
          </li>
          <li>
            <button v-tooltip.bottom="'Temas'" class="p-2" @click="themeSelectorPopoverRef.toggle">
              <Icon icon="palette" :size="22" />
            </button>
          </li>
          <li class="ms-2">
            <button class="rounded-full p-3 bg-base-100">
              <Icon icon="user" :size="22" />
            </button>
          </li>
        </ul>
      </div>
    </div>

    <div class="drawer-side">
      <label for="drawer" aria-label="close sidebar" class="drawer-overlay" />
      <ul class="menu bg-base-200 min-h-full w-60 md:w-80 p-4">
        <li>
          <a>
            <Icon icon="book_open" :size="20" />
            Bíblia
          </a>
        </li>
        <li>
          <a>
            <Icon icon="document" :size="20" />
            Navbar Item 2
          </a>
        </li>
      </ul>
    </div>

    <ThemeSelectorPopover ref="themeSelectorPopoverRef" />
  </div>
</template>
