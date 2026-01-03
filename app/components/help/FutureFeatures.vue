<template>
  <section id="future-features" class="card bg-base-200 shadow-lg scroll-mt-8">
    <div class="card-body">
      <h2 class="card-title text-2xl mb-4">
        <Icon icon="rocket" :size="28" />
        Funcionalidades Futuras
      </h2>
      <div class="space-y-4">
        <p>
          Estamos sempre trabalhando para melhorar sua experiência de leitura. 
          As seguintes funcionalidades estão planejadas para futuras atualizações:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="card bg-base-100 shadow-sm">
            <div class="card-body">
              <h3 class="card-title text-lg">
                <Icon icon="edit" :size="20" />
                Anotações
              </h3>
              <p class="text-sm text-base-content/70">
                Adicione suas próprias anotações e reflexões pessoais aos versículos e capítulos.
              </p>
            </div>
          </div>
          <div class="card bg-base-100 shadow-sm">
            <div class="card-body">
              <h3 class="card-title text-lg">
                <Icon icon="bookmark" :size="20" />
                Marcações de Versículos
              </h3>
              <p class="text-sm text-base-content/70">
                Marque versículos favoritos e organize-os em coleções personalizadas para acesso rápido.
              </p>
            </div>
          </div>
          <div class="card bg-base-100 shadow-sm">
            <div class="card-body">
              <h3 class="card-title text-lg">
                <Icon icon="compare" :size="20" />
                Comparar Versões
              </h3>
              <p class="text-sm text-base-content/70">
                Compare o mesmo versículo ou capítulo em diferentes versões da Bíblia lado a lado.
              </p>
            </div>
          </div>
          <div class="card bg-base-100 shadow-sm">
            <div class="card-body">
              <h3 class="card-title text-lg">
                <Icon icon="copy" :size="20" />
                Copiar Versículos
              </h3>
              <p class="text-sm text-base-content/70">
                Copie versículos selecionados com formatação personalizada para compartilhar facilmente.
              </p>
            </div>
          </div>
        </div>
        <div class="alert alert-info mt-4">
          <Icon icon="info" :size="20" />
          <span class="text-sm">
            Quer sugerir uma nova funcionalidade?
            <a href="#suggestions-bugs" class="link link-primary">
              Use o formulário de feedback
            </a>
            para nos enviar suas ideias!
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

