<script setup lang="ts">

const navigationItems = [
  {
    href: '#suggestions-bugs',
    icon: 'edit',
    title: 'Sugestões e Bugs',
    description: 'Envie sugestões e relatórios de problemas'
  },
  {
    href: '#customization',
    icon: 'palette',
    title: 'Personalização',
    description: 'Aprenda a personalizar temas e versões da Bíblia'
  },
  {
    href: '#search',
    icon: 'search',
    title: 'Busca',
    description: 'Como usar o sistema de busca de versículos'
  },
  {
    href: '#faq',
    icon: 'help',
    title: 'Perguntas Frequentes',
    description: 'Encontre respostas para as dúvidas mais comuns'
  },
  {
    href: '#future-features',
    icon: 'rocket',
    title: 'Funcionalidades Futuras',
    description: 'Conheça as próximas implementações planejadas'
  }
] as const
</script>

<template>
  <main class="flex-1 container mx-auto px-4 py-8 max-w-4xl">
    <div class="prose prose-lg max-w-none">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Icon icon="circle_question" :size="40" />
          Central de Ajuda
        </h1>
        <p class="text-base-content/70 text-lg">
          Encontre respostas para suas dúvidas sobre como usar a aplicação
        </p>
      </div>

      <!-- Quick Navigation -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        <a
          v-for="item in navigationItems"
          :key="item.href"
          :href="item.href"
          class="card bg-base-200 shadow-md hover:shadow-lg transition-shadow cursor-pointer text-left no-underline"
        >
          <div class="card-body">
            <h2 class="card-title">
              <Icon :icon="item.icon" :size="24" />
              {{ item.title }}
            </h2>
            <p>{{ item.description }}</p>
          </div>
        </a>
      </div>

      <!-- Main Content -->
      <div class="space-y-8">
        <HelpSuggestionsBugs />
        <HelpCustomization />
        <HelpSearch />
        <HelpFAQ />
        <HelpFutureFeatures />
      </div>

      <!-- Back Button -->
      <div class="mt-8 text-center">
        <RouterLink to="/" class="btn btn-primary">
          <Icon icon="chevron_left" :size="20" />
          Voltar para a Página Inicial
        </RouterLink>
      </div>
    </div>
  </main>
</template>
