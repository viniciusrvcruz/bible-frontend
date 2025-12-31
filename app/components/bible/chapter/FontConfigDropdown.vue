<script setup lang="ts">
const fontSizes = [
  'text-sm',
  'text-base',
  'text-lg',
  'text-xl',
  'text-2xl',
  'text-3xl',
]

const fontFamilies = [
  { label: 'Sans Serif', value: 'font-sans' },
  { label: 'Serif', value: 'font-serif' },
  { label: 'Mono', value: 'font-mono' },
  { label: 'Arial', value: 'font-arial' },
  { label: 'Times', value: 'font-times' },
  { label: 'Verdana', value: 'font-verdana' },
  { label: 'Georgia', value: 'font-georgia' },
  { label: 'Courier', value: 'font-courier' },
]

const selectedFontSize = defineModel<string | null>('fontSize', { required: true })
const selectedFontFamily = defineModel<string | null>('fontFamily', { required: true })

const currentSizeIndex = computed(() => {
  return fontSizes.findIndex(size => size === selectedFontSize.value)
})

const increaseFontSize = () => {
  const currentIndex = currentSizeIndex.value

  const nextSize = fontSizes[currentIndex + 1]

  if (!nextSize) return

  selectedFontSize.value = nextSize
}

const decreaseFontSize = () => {
  const currentIndex = currentSizeIndex.value

  const prevSize = fontSizes[currentIndex - 1]

  if (!prevSize) return

  selectedFontSize.value = prevSize
}

const setFontFamily = (fontValue: string) => {
  selectedFontFamily.value = fontValue
}
</script>

<template>
  <div class="dropdown dropdown-center">
    <div
      v-tooltip.bottom="'Configurações de texto'"
      tabindex="0"
      role="button"
      class="btn btn-sm"
    >
      <Icon icon="letter_case" :size="20" />
    </div>
    <ul
      tabindex="0"
      class="dropdown-content menu bg-base-100 rounded-box z-1 w-56 p-4 shadow-lg text-base-content"
    >
      <h3 class="font-bold text-lg mb-4">
        Configurações de Texto
      </h3>

      <!-- Font size controls with join buttons -->
      <div class="mb-4">
        <label class="label">
          <span class="label-text font-semibold">
            Tamanho da Fonte
          </span>
        </label>
        <div class="join w-full">
          <button
            class="btn btn-sm join-item flex-1 text-sm"
            :class="{'opacity-45 hover:bg-base-200': currentSizeIndex === 0}"
            @click="decreaseFontSize"
          >
            A-
          </button>
          <button
            class="btn btn-sm join-item flex-1 text-lg font-semibold"
            :class="{'opacity-45 hover:bg-base-200': currentSizeIndex === fontSizes.length - 1}"
            @click="increaseFontSize"
          >
            A+
          </button>
        </div>
      </div>

      <!-- Font family selection -->
      <div>
        <label class="label">
          <span class="label-text font-semibold">
            Fonte
          </span>
        </label>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="font in fontFamilies"
            :key="font.value"
            class="btn btn-sm justify-start hover:bg-base-200"
            :class="{
              'bg-base-300 border-2 border-primary': selectedFontFamily === font.value
            }"
            @click="setFontFamily(font.value)"
          >
            <span :class="font.value">{{ font.label }}</span>
          </button>
        </div>
      </div>
    </ul>
  </div>
</template>
