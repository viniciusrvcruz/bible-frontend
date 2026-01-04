<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const errorMessages = new Map<number, { title: string; message: string }>([
  [
    404,
    {
      title: 'Página não encontrada',
      message: 'A página que você está procurando não existe ou foi movida.'
    }
  ],
  [
    500,
    {
      title: 'Erro interno do servidor',
      message: 'Algo deu errado no servidor. Por favor, tente novamente mais tarde.'
    }
  ]
])

const errorInfo = computed(() => {
  const statusCode = props.error.statusCode

  const defaultInfo = {
    title: props.error.statusMessage || 'Ocorreu um erro',
    message: props.error.message || 'Algo inesperado aconteceu.'
  }

  return errorMessages.get(statusCode) ?? defaultInfo
})

const errorTitle = computed(() => errorInfo.value.title)
const errorMessage = computed(() => errorInfo.value.message)
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

      <!-- Error title -->
      <h2 class="text-3xl font-bold text-base-content mb-4">
        {{ errorTitle }}
      </h2>

      <!-- Error message -->
      <p class="text-base-content/70 text-lg mb-8">
        {{ errorMessage }}
      </p>

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