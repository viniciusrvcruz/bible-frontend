<template>
  <footer class="pb-8 text-center text-sm text-base-content/70 max-w-4xl mx-auto">
    <p class="mb-3">
      Este é um projeto open source dedicado a tornar a leitura da Bíblia mais acessível e moderna.
    </p>
    <div class="flex items-center justify-center gap-4">
      <a
        href="https://github.com/viniciusrvcruz/bible-frontend"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 text-inherit underline hover:text-primary hover:opacity-80 transition-colors"
        title="Repositório do Projeto no GitHub"
      >
        <Icon icon="github" :size="20" />
        <span>Repositório</span>
      </a>
      <span class="text-base-content/40">•</span>
      <a
        href="https://www.linkedin.com/in/viniciuscruz7"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 text-inherit underline hover:text-primary hover:opacity-80 transition-colors"
        title="LinkedIn"
      >
        <Icon icon="linkedin" :size="20" />
        <span>Vinicius Cruz</span>
      </a>
    </div>
  </footer>
</template>

