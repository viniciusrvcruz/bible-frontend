<script setup lang="ts">
const supportModal = useSupportModal()
</script>

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
                <Icon icon="share" :size="20" />
                Compartilhar Versículos
              </h3>
              <p class="text-sm text-base-content/70">
                Compartilhe versículos com outras pessoas através de links e imagens.
              </p>
            </div>
          </div>
          <div class="card bg-base-100 shadow-sm">
            <div class="card-body">
              <h3 class="card-title text-lg">
                <Icon icon="book_marked" :size="20" />
                Referências clicáveis
              </h3>
              <p class="text-sm text-base-content/70">
                Nas notas de referência dos versículos, toque em uma referência bíblica e seja levado direto ao texto indicado.
              </p>
            </div>
          </div>
          <div class="card bg-base-100 shadow-sm">
            <div class="card-body">
              <h3 class="card-title text-lg">
                <Icon icon="user" :size="20" />
                Fazer login
              </h3>
              <p class="text-sm text-base-content/70">
                Em breve você poderá acessar recursos personalizados com sua conta, conforme forem lançados nas próximas atualizações.
              </p>
            </div>
          </div>
        </div>
        <div class="alert alert-soft mt-4">
          <Icon icon="info" :size="20" />
          <span class="text-sm">
            Quer sugerir uma nova funcionalidade?
            <button type="button" class="link font-bold" @click="supportModal.open">
              Use o formulário de feedback
            </button>
            para nos enviar suas ideias!
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

