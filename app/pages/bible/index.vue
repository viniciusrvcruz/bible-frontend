<script setup lang="ts">
import { BookAbbreviation } from '~/utils/book'

const { goToChapter } = useNavigateToBible()

goToChapter(BookAbbreviation.jhn, 1, 1, true)
</script>

<template>
  <div />
</template>