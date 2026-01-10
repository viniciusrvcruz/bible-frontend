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
      <aside class="menu bg-base-200 min-h-full w-60 md:w-80 flex flex-col">
        <div class="flex justify-between items-center p-4 pb-2">
          <RouterLink to="/" @click="closeDrawer">
            <Icon icon="book_marked" :size="34" />
          </RouterLink>
          <label 
            for="drawer" 
            aria-label="close sidebar" 
            class="btn btn-ghost btn-sm btn-circle"
          >
            <Icon icon="close" :size="20" />
          </label>
        </div>
        <div class="flex-1 flex flex-col gap-2 overflow-y-auto px-4 py-4 border-t border-base-300">
          <RouterLink 
            :to="bibleLink" 
            @click="closeDrawer" 
            class="btn btn-ghost justify-start w-full text-base"
          >
            <Icon icon="book_open" :size="20" />
            Bíblia
          </RouterLink>
        </div>

        <div class="p-4 pt-6 border-t border-base-300 text-start text-sm text-base-content/70 md:text-center">
          <SharedSocialLinks
            class="justify-start md:justify-center"
            remove-separators
            :icon-size="18"
          />
        </div>
      </aside>
    </div>

    <ThemeSelectorPopover ref="themeSelectorPopoverRef" />
    <UserDropdown ref="userDropdownRef" />
  </div>
</template>