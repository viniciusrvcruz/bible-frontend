<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()

</script>

<template>
  <NuxtLayout>
    <main class="flex-1 container flex flex-col items-center mx-auto px-4 mt-16 text-center">
      <!-- Error icon -->
      <div class="rounded-full bg-error/10 w-32 h-32 flex items-center justify-center mx-auto mb-8">
        <Icon icon="circle_question" :size="80" class="text-error" />
      </div>

      <!-- Error code -->
      <h1 class="text-8xl font-bold text-base-content/20 mb-4">
        {{ error.statusCode || '?' }}
      </h1>

      <!-- Error message -->
      <h2 class="text-3xl font-bold text-base-content mb-14">
        {{ error.message }}
      </h2>

      <!-- Action buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <NuxtLink
          to="/bible"
          class="btn btn-primary btn-lg gap-2"
        >
          <Icon icon="book_open" :size="20" />
          Voltar para a Bíblia
        </NuxtLink>
        
        <NuxtLink
          to="/"
          class="btn btn-outline btn-lg gap-2"
        >
          <Icon icon="book_marked" :size="20" />
          Página inicial
        </NuxtLink>
      </div>
    </main>
  </NuxtLayout>
</template>