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

// Use v-model to receive values from parent component
const selectedFontSize = defineModel<string | null>('fontSize', { required: true })
const selectedFontFamily = defineModel<string | null>('fontFamily', { required: true })

const popoverRef = ref()

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

const toggle = (event: Event) => {
  popoverRef.value.toggle(event)
}

// Expose function to open popover
defineExpose({
  toggle,
})
</script>

<template>
  <Popover ref="popoverRef" class="max-w-80">
    <div class="p-4 w-80 bg-base-100 text-base-content">
      <h3 class="font-bold text-lg mb-4">Configurações de Texto</h3>
      
      <!-- Font size controls with join buttons -->
      <div class="mb-4">
        <label class="label">
          <span class="label-text font-semibold">Tamanho da Fonte</span>
        </label>
        <div class="join w-full">
          <button
            class="btn btn-sm join-item flex-1 text-sm"
            :disabled="currentSizeIndex === 0"
            @click="decreaseFontSize"
          >
            A-
          </button>
          <button
            class="btn btn-sm join-item flex-1 text-lg font-semibold"
            :disabled="currentSizeIndex === fontSizes.length - 1"
            @click="increaseFontSize"
          >
            A+
          </button>
        </div>
      </div>

      <!-- Font family selection -->
      <div>
        <label class="label">
          <span class="label-text font-semibold">Fonte</span>
        </label>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="font in fontFamilies"
            :key="font.value"
            class="btn btn-sm justify-start hover:bg-base-200"
            :class="{
              'bg-base-300': selectedFontFamily === font.value
            }"
            @click="setFontFamily(font.value)"
          >
            <span :class="font.value">{{ font.label }}</span>
          </button>
        </div>
      </div>
    </div>
  </Popover>
</template>
