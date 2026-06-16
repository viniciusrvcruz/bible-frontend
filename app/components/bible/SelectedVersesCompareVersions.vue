<script setup lang="ts">
import { formatVerseReference } from '~/composables/bible/useSelectedVerses'
import { useSelectedVersesContext } from '~/composables/bible/useSelectedVersesContext'
import { useCompareChapterVersions } from '~/composables/bible/useCompareChapterVersions'

const props = withDefaults(defineProps<{
  inModal?: boolean
}>(), {
  inModal: false,
})

const emit = defineEmits<{
  back: []
}>()

const versionStore = useVersionStore()
const popoverRef = useTemplateRef('popoverRef')

const {
  selectedVerses,
  displayedVerseNumbers,
  bookName,
  chapterNumber,
  bookAbbreviation,
} = useSelectedVersesContext()

const {
  getVersionState,
  getVersePlainText,
  loadVersion
} = useCompareChapterVersions(
  () => bookAbbreviation.value,
  () => chapterNumber.value,
)

const MAX_COMPARE_VERSES = 10

const exceedsVerseLimit = computed(() => selectedVerses.value.length > MAX_COMPARE_VERSES)

const selectedVersionIds = ref<number[]>([])

const currentVersionId = computed(() => versionStore.currentVersion?.id)

const ensureCurrentVersionSelected = () => {
  const id = currentVersionId.value

  if (id && !selectedVersionIds.value.includes(id)) {
    selectedVersionIds.value = [...selectedVersionIds.value, id]
  }
}

watch(() => versionStore.versions, (versions) => {
  if (versions.length > 0 && selectedVersionIds.value.length === 0) {
    selectedVersionIds.value = versions.map(version => version.id)
  }

  ensureCurrentVersionSelected()
}, { immediate: true })

watch(currentVersionId, ensureCurrentVersionSelected)

const visibleVersions = computed(() => {
  const idSet = new Set(selectedVersionIds.value)

  return versionStore.versions.filter(version => idSet.has(version.id))
})

const referenceLabel = computed(() => {
  const numbers = displayedVerseNumbers.value

  if (numbers.length === 0) return ''

  return `${bookName.value} ${chapterNumber.value}:${formatVerseReference(numbers)}`
})

const isVersionSelected = (versionId: number) =>
  selectedVersionIds.value.includes(versionId)

const isCurrentVersion = (versionId: number) => currentVersionId.value === versionId

const toggleVersionSelection = (versionId: number) => {
  if (isCurrentVersion(versionId)) return

  if (selectedVersionIds.value.includes(versionId)) {
    selectedVersionIds.value = selectedVersionIds.value.filter(id => id !== versionId)
    return
  }

  selectedVersionIds.value = [...selectedVersionIds.value, versionId]
}

const toggleVersionsPopover = (event: Event) => {
  popoverRef.value?.toggle(event)
}

const loadVisibleVersions = () => {
  visibleVersions.value.forEach(version => loadVersion(version.id))
}

watch(visibleVersions, loadVisibleVersions, { immediate: true })

</script>

<template>
  <div
    class="flex flex-col min-h-0 h-full"
    :class="inModal ? 'p-4' : 'overflow-hidden'"
  >
    <!-- Header -->
    <div class="flex items-center justify-between gap-3 shrink-0 pb-4 border-b border-base-300">
      <button
        type="button"
        class="btn btn-ghost btn-sm gap-1 -ms-2 font-semibold text-base"
        aria-label="Voltar"
        @click="emit('back')"
      >
        <Icon icon="chevron_left" :size="20" />
        <span id="compare-versions-modal-title">Comparar versões</span>
      </button>

      <div class="relative shrink-0">
        <button
          type="button"
          class="btn btn-ghost btn-circle btn-sm"
          aria-label="Filtrar versões"
          @click="toggleVersionsPopover"
        >
          <Icon icon="list_filter" :size="20" />
        </button>

        <Popover
          ref="popoverRef"
          :append-to="inModal ? '#selected-verses-action-modal' : undefined"
          :pt="{
            content: {
              class: 'p-0! rounded-lg! bg-base-100! border border-base-300! shadow-lg! overflow-hidden!',
            },
          }"
        >
          <div class="w-72 max-h-80 flex flex-col">
            <p class="px-3 pt-3 pb-2 text-xs font-semibold text-base-content/70 shrink-0 border-b border-base-300">
              Versões exibidas
            </p>
            <div class="overflow-y-auto flex-1 min-h-0 p-2 space-y-1.5 max-h-64">
              <button
                v-for="version in versionStore.versions"
                :key="version.id"
                type="button"
                class="w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 border border-base-300 text-base-content"
                :class="{
                  'bg-primary/10 border-primary': isVersionSelected(version.id),
                  'hover:bg-base-200 cursor-pointer': !isCurrentVersion(version.id),
                  'opacity-60 cursor-not-allowed': isCurrentVersion(version.id),
                }"
                :disabled="isCurrentVersion(version.id)"
                @click="toggleVersionSelection(version.id)"
              >
                <div class="flex-1 min-w-0">
                  <div class="font-semibold text-base-content">
                    {{ version.abbreviation }}
                  </div>
                  <div class="text-sm text-base-content/70 truncate">
                    {{ version.name }}
                  </div>
                </div>
                <Icon
                  v-if="isVersionSelected(version.id)"
                  icon="check"
                  :size="18"
                  class="text-primary shrink-0"
                />
              </button>
            </div>
          </div>
        </Popover>
      </div>
    </div>

    <!-- Verse limit notice -->
    <div
      v-if="exceedsVerseLimit"
      class="shrink-0 mt-3 px-3 py-2 rounded-lg bg-warning/15 border border-warning/30 text-sm text-base-content"
      role="status"
    >
      O máximo de versículos para comparar é {{ MAX_COMPARE_VERSES }}. Apenas os {{ MAX_COMPARE_VERSES }} primeiros serão exibidos.
    </div>

    <!-- Version blocks -->
    <div
      class="flex-1 min-h-0 overflow-y-auto pt-4"
      :class="props.inModal ? undefined : '-mx-4 px-4 lg:-mx-5 lg:px-5'"
    >
      <article
        v-for="version in visibleVersions"
        :key="version.id"
        class="pb-8 mb-8 border-b border-base-300 last:border-b-0 last:mb-0"
      >
        <div class="flex items-baseline justify-between gap-3 mb-4">
          <span class="font-bold text-lg text-base-content">
            {{ version.abbreviation }}
          </span>
          <span class="text-sm text-base-content/70 text-right truncate">
            {{ version.name }}
          </span>
        </div>

        <div
          v-if="getVersionState(version.id)?.status === 'loading'"
          class="border-s-2 border-base-content/15 ps-4 flex flex-col gap-3"
          role="status"
          aria-live="polite"
        >
          <div class="flex items-center gap-2 text-sm text-base-content/70">
            <span class="loading loading-spinner loading-sm" aria-hidden="true" />
            Carregando...
          </div>
          <div
            v-for="number in displayedVerseNumbers.length || 2"
            :key="number"
            class="h-4 w-full rounded bg-base-content/10 animate-pulse"
          />
        </div>

        <div
          v-else-if="getVersionState(version.id)?.status === 'error'"
          class="border-s-2 border-base-content/15 ps-4 text-sm text-base-content/70"
        >
          Não foi possível carregar esta versão.
        </div>

        <template v-else-if="getVersionState(version.id)?.status === 'loaded'">
          <div class="border-s-2 border-base-content/15 ps-4 block leading-[1.9] indent-0 whitespace-pre-line wrap-break-word">
            <template
              v-for="verseNumber in displayedVerseNumbers"
              :key="verseNumber"
            >
              <span
                class="text-[0.8em] align-super leading-0 font-bold mx-1 text-base-content/50"
              >
                {{ verseNumber }}
              </span>
              <span class="inline leading-[1.9] text-base-content">
                {{ getVersePlainText(version.id, verseNumber) ?? '—' }}
              </span>
            </template>
          </div>

          <p class="font-bold text-base-content mt-4">
            {{ referenceLabel }}
          </p>
        </template>
      </article>
    </div>
  </div>
</template>
