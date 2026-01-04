<script setup lang="ts">
import ThemeSelectorPopover from './ThemeSelectorPopover.vue'
import UserDropdown from './UserDropdown.vue'

const route = useRoute()

const themeSelectorPopoverRef = useTemplateRef('themeSelectorPopoverRef')
const userDropdownRef = useTemplateRef('userDropdownRef')

const closeDrawer = () => {
  document.getElementById('drawer')?.click()
}

const bibleLink = computed(() =>
  route.path.startsWith('/bible/')
    ? route.path
    : '/bible'
)
</script>

<template>
  <div class="drawer sticky top-0 z-10">
    <input id="drawer" type="checkbox" class="drawer-toggle" />

    <div class="drawer-content flex flex-col">
      <div class="navbar h-header bg-base-300 w-full justify-between items-center py-0 lg:px-10">
        <div class="flex-none lg:hidden">
          <label for="drawer" aria-label="open sidebar" class="btn btn-ghost">
            <Icon icon="menu" :size="25" />
          </label>
        </div>

        <div class="hidden flex-none justify-between items-center lg:flex">
          <RouterLink to="/" class="flex items-center">
            <Icon icon="book_marked" :size="30" />
          </RouterLink>

          <ul class="menu menu-horizontal gap-2 ms-5">
            <li>
              <RouterLink :to="bibleLink">
                <Icon icon="book_open" :size="20" />
                Bíblia
              </RouterLink>
            </li>
          </ul>
        </div>

        <div class="hidden sm:flex items-center text-xs text-base-content/70 ms-4">
          <Icon icon="keyboard" :size="16" class="me-1" />
          <span>Digite qualquer letra para pesquisar</span>
        </div>

        <ul class="menu menu-horizontal gap-2 items-center">
          <li>
            <RouterLink to="/help" v-tooltip.bottom="'Ajuda'" class="p-2">
              <Icon icon="circle_question" :size="22" />
            </RouterLink>
          </li>
          <li>
            <button v-tooltip.bottom="'Temas'" class="p-2" @click="themeSelectorPopoverRef?.toggle">
              <Icon icon="palette" :size="22" />
            </button>
          </li>
          <li class="ms-2">
            <button class="rounded-full p-3 bg-base-100" @click="userDropdownRef?.toggle">
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
          <RouterLink :to="bibleLink" @click="closeDrawer">
            <Icon icon="book_open" :size="20" />
            Bíblia
          </RouterLink>
        </li>
      </ul>
    </div>

    <ThemeSelectorPopover ref="themeSelectorPopoverRef" />
    <UserDropdown ref="userDropdownRef" />
  </div>
</template>