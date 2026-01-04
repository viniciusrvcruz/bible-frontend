<script setup lang="ts">
</script>

<template>
  <main class="flex-1">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content text-center">
        <div class="max-w-4xl">
          <div class="mb-6 flex justify-center">
            <div class="rounded-full bg-primary/20 p-6">
              <Icon icon="book_marked" :size="64" class="text-primary" />
            </div>
          </div>
          
          <h1 class="mb-6 text-5xl font-bold lg:text-7xl">
            Leia a Bíblia de forma
            <span class="text-primary">moderna</span> e
            <span class="text-primary">intuitiva</span>
          </h1>
          
          <p class="mb-8 text-lg text-base-content/70 lg:text-xl">
            Explore as Escrituras com uma interface bonita e fácil de usar.
            Leia diferentes versões da Bíblia e personalize sua experiência de leitura.
          </p>
          
          <div class="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <RouterLink to="/bible" class="btn btn-primary btn-lg">
              <Icon icon="book_open" :size="24" />
              Começar a Ler
            </RouterLink>
            <RouterLink to="/help" class="btn btn-outline btn-lg">
              <Icon icon="circle_question" :size="24" />
              Saiba Mais
            </RouterLink>
          </div>
          
          <div class="mt-12 flex flex-wrap justify-center gap-6 text-sm text-base-content/60">
            <div class="flex items-center gap-2">
              <Icon icon="palette" :size="18" />
              <span>Personalize as cores</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon icon="globe" :size="18" />
              <span>Funciona em qualquer dispositivo</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon icon="book_open" :size="18" />
              <span>100% gratuito</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-base-100">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold mb-4">Por que escolher nossa plataforma?</h2>
          <p class="text-lg text-base-content/70 max-w-2xl mx-auto">
            Tudo que você precisa para uma leitura bíblica completa e agradável
          </p>
        </div>
        
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <!-- Feature 1 -->
          <div class="card bg-base-200 shadow-xl">
            <div class="card-body">
              <div class="mb-4 text-primary">
                <Icon icon="book_open" :size="40" />
              </div>
              <h3 class="card-title text-2xl">Fácil de Navegar</h3>
              <p class="text-base-content/70">
                Encontre qualquer livro, capítulo ou versículo rapidamente.
                Interface simples e organizada para você focar apenas na leitura.
              </p>
            </div>
          </div>

          <!-- Feature 2 -->
          <div class="card bg-base-200 shadow-xl">
            <div class="card-body">
              <div class="mb-4 text-primary">
                <Icon icon="compare" :size="40" />
              </div>
              <h3 class="card-title text-2xl">Diferentes Versões</h3>
              <p class="text-base-content/70">
                Leia a Bíblia em várias versões diferentes.
                Troque entre elas facilmente e encontre a que mais gosta.
              </p>
            </div>
          </div>

          <!-- Feature 3 -->
          <div class="card bg-base-200 shadow-xl">
            <div class="card-body">
              <div class="mb-4 text-primary">
                <Icon icon="palette" :size="40" />
              </div>
              <h3 class="card-title text-2xl">Personalize sua Leitura</h3>
              <p class="text-base-content/70">
                Escolha entre diversos temas e cores para tornar sua leitura
                mais confortável e agradável aos seus olhos.
              </p>
            </div>
          </div>

          <!-- Feature 4 -->
          <div class="card bg-base-200 shadow-xl">
            <div class="card-body">
              <div class="mb-4 text-primary">
                <Icon icon="search" :size="40" />
              </div>
              <h3 class="card-title text-2xl">Encontre Rapidamente</h3>
              <p class="text-base-content/70">
                Busque qualquer versículo ou passagem bíblica em segundos.
                Digite uma letra e comece a pesquisar imediatamente.
              </p>
            </div>
          </div>

          <!-- Feature 5 -->
          <div class="card bg-base-200 shadow-xl">
            <div class="card-body">
              <div class="mb-4 text-primary">
                <Icon icon="globe" :size="40" />
              </div>
              <h3 class="card-title text-2xl">Leia em Qualquer Lugar</h3>
              <p class="text-base-content/70">
                Acesse de qualquer dispositivo: celular, tablet ou computador.
                Sua leitura sempre sincronizada e acessível.
              </p>
            </div>
          </div>

          <!-- Feature 6 -->
          <div class="card bg-base-200 shadow-xl">
            <div class="card-body">
              <div class="mb-4 text-primary">
                <Icon icon="rocket" :size="40" />
              </div>
              <h3 class="card-title text-2xl">Rápido e Suave</h3>
              <p class="text-base-content/70">
                Carregamento instantâneo e navegação fluida.
                Sem esperas ou travamentos durante sua leitura.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-4xl font-bold mb-4">Pronto para começar?</h2>
        <p class="text-lg text-base-content/70 mb-8 max-w-2xl mx-auto">
          Comece sua jornada de leitura bíblica agora mesmo. 
          É gratuito, rápido e fácil de usar.
        </p>
        <RouterLink to="/bible" class="btn btn-primary btn-lg">
          <Icon icon="book_open" :size="24" />
          Começar a Ler Agora
        </RouterLink>
      </div>
    </section>
  </main>
</template>