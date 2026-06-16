<script setup lang="ts">
import type { SelectedVerseAction } from '~/types/bible/selectedVerseAction.type'

defineProps<{
  actions: SelectedVerseAction[]
  copySuccess?: boolean
}>()

const emit = defineEmits<{
  'open-view': [component: Component]
}>()

const handleClick = (action: SelectedVerseAction) => {
  if ('action' in action && action.action) {
    action.action()
    return
  }

  if ('component' in action && action.component) {
    emit('open-view', action.component)
  }
}

const isCopyAction = (action: SelectedVerseAction) => action.icon === 'copy'

</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="(action, index) in actions"
      :key="`${action.icon}-${index}`"
      type="button"
      class="btn btn-outline btn-sm gap-2 transition-all duration-200"
      :class="{ 'btn-success': copySuccess && isCopyAction(action) }"
      @click="handleClick(action)"
    >
      <Icon :icon="action.icon" :size="18" />
      {{ copySuccess && isCopyAction(action) ? 'Copiado' : action.label }}
    </button>
  </div>
</template>
