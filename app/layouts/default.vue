<script setup lang="ts">
import { useVersionService } from '~/composables/services/useVersionService'

const versionStore = useVersionStore()
const versionService = useVersionService()

const { data: versions } = await versionService.index()

if (versions.value?.length) {
  versionStore.setVersions(versions.value)
}

</script>

<template>
  <slot />
</template>