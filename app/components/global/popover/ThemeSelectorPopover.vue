<script setup lang="ts">
import { ref } from 'vue';

const themeGroups = [
  {
    title: 'Temas claros',
    themes: [
      'light', 'retro', 'cupcake', 'bumblebee', 'emerald', 'corporate',
      'valentine', 'garden', 'aqua', 'lofi', 'pastel', 'fantasy',
      'wireframe', 'cmyk', 'autumn', 'acid', 'lemonade', 'winter',
      'nord', 'cyberpunk',
    ],
  },
  {
    title: 'Temas escuros',
    themes: [
      'dark', 'synthwave', 'halloween', 'forest',
      'black', 'luxury', 'dracula', 'business',
      'night', 'coffee', 'dim', 'sunset',
    ],
  },
]

const popover = ref()

const setTheme = (theme: string) => {
  document.documentElement.setAttribute('data-theme', theme)
  popover.value.hide()
}

const toggle = (event: Event) => {
  popover.value.toggle(event)
}

defineExpose({
  toggle,
})
</script>

<template>
  <Popover ref="popover" class="border-none ms-5">
    <div class="bg-base-200 p-3 min-w-max max-h-96 overflow-y-auto">
      <div class="grid grid-cols-2 gap-3">
        <div v-for="group in themeGroups" :key="group.title">
          <h3 class="text-sm font-semibold mb-2 text-base-content">
            {{ group.title }}
          </h3>

          <div class="flex flex-col gap-2">
            <button
              v-for="theme in group.themes"
              :key="theme"
              :data-theme="theme"
              class="btn btn-sm justify-start gap-2 bg-base-100 border-base-300 text-base-content capitalize hover:bg-base-200"
              @click="setTheme(theme)"
            >
              <span class="flex gap-1">
                <span class="w-2 h-4 rounded bg-primary" />
                <span class="w-2 h-4 rounded bg-secondary" />
                <span class="w-2 h-4 rounded bg-accent" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Popover>
</template>

