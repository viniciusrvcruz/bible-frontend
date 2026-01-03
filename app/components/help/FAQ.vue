<template>
  <section id="faq" class="card bg-base-200 shadow-lg scroll-mt-8">
    <div class="card-body">
      <h2 class="card-title text-2xl mb-4">
        <Icon icon="help" :size="28" />
        Perguntas Frequentes
      </h2>
      <div class="space-y-6">
        <div class="collapse collapse-arrow bg-base-100">
          <input type="radio" name="faq-accordion" />
          <div class="collapse-title text-lg font-medium">
            Como uso a busca rápida de referências bíblicas?
          </div>
          <div class="collapse-content">
            <p class="mb-2">
              A busca rápida pode ser acessada de forma muito simples:
            </p>
            <ul class="list-disc list-inside space-y-1 ml-4">
              <li>Pressione qualquer letra do teclado (a-z) ou número (1-3) para abrir o modal de busca</li>
              <li>Digite o nome do livro que deseja encontrar (ex: "gen" para Gênesis)</li>
              <li>Pressione Enter ou Tab para selecionar o livro e avançar para o capítulo</li>
              <li>Digite o número do capítulo e pressione Enter para avançar ao versículo</li>
              <li>Digite o número do versículo e pressione Enter para navegar diretamente</li>
            </ul>
          </div>
        </div>
        <div class="collapse collapse-arrow bg-base-100">
          <input type="radio" name="faq-accordion" />
          <div class="collapse-title text-lg font-medium">
            Como navego entre livros, capítulos e versículos?
          </div>
          <div class="collapse-content">
            <p class="mb-2">
              Existem várias formas de navegar pela Bíblia:
            </p>
            <ul class="list-disc list-inside space-y-1 ml-4">
              <li><strong>Painel lateral:</strong> Use o painel à esquerda para selecionar livros e capítulos</li>
              <li><strong>Botões de navegação:</strong> Use as setas no rodapé para ir ao capítulo anterior ou próximo</li>
              <li><strong>URL direta:</strong> Você pode acessar diretamente uma referência pela URL (ex: /bible/gen.1)</li>
              <li><strong>Busca rápida:</strong> Use o atalho de teclado para buscar qualquer referência rapidamente</li>
            </ul>
          </div>
        </div>
        <div class="collapse collapse-arrow bg-base-100">
          <input type="radio" name="faq-accordion" />
          <div class="collapse-title text-lg font-medium">
            Como altero a versão da Bíblia?
          </div>
          <div class="collapse-content">
            <p class="mb-2">
              Para alterar a versão da Bíblia:
            </p>
            <ul class="list-disc list-inside space-y-1 ml-4">
              <li>Clique no nome da versão atual no cabeçalho do capítulo</li>
              <li>Selecione a versão desejada no menu que aparece</li>
              <li>A versão será alterada automaticamente e sua preferência será salva</li>
            </ul>
            <p class="mt-2">
              Você também pode especificar a versão diretamente na URL adicionando o nome da versão após o capítulo (ex: /bible/gen.1.acf).
            </p>
          </div>
        </div>
        <div class="collapse collapse-arrow bg-base-100">
          <input type="radio" name="faq-accordion" />
          <div class="collapse-title text-lg font-medium">
            Como personalizo o tamanho e estilo da fonte?
          </div>
          <div class="collapse-content">
            <p class="mb-2">
              Você pode personalizar a aparência do texto:
            </p>
            <ul class="list-disc list-inside space-y-1 ml-4">
              <li>Clique no ícone de configurações no cabeçalho do capítulo</li>
              <li>Selecione o tamanho da fonte desejado (pequeno, médio, grande)</li>
              <li>Escolha a família da fonte (serifada, sem serifa, monoespaçada)</li>
              <li>Suas preferências são salvas automaticamente</li>
            </ul>
          </div>
        </div>
        <div class="collapse collapse-arrow bg-base-100">
          <input type="radio" name="faq-accordion" />
          <div class="collapse-title text-lg font-medium">
            Como acesso um versículo específico diretamente?
          </div>
          <div class="collapse-content">
            <p class="mb-2">
              Para acessar um versículo específico:
            </p>
            <ul class="list-disc list-inside space-y-1 ml-4">
              <li>Use a busca rápida e digite: livro, capítulo e versículo</li>
              <li>Ou adicione o número do versículo na URL após o capítulo (ex: /bible/gen.1#v5)</li>
              <li>O versículo será destacado automaticamente quando a página carregar</li>
            </ul>
          </div>
        </div>
        <div class="collapse collapse-arrow bg-base-100">
          <input type="radio" name="faq-accordion" />
          <div class="collapse-title text-lg font-medium">
            A aplicação salva meu histórico de leitura?
          </div>
          <div class="collapse-content">
            <p>
              Sim! A aplicação mantém um histórico automático dos capítulos que você visita. 
              Você pode acessar seu histórico através do ícone de histórico no cabeçalho do capítulo 
              para retomar rapidamente suas leituras anteriores.
            </p>
          </div>
        </div>
        <div class="collapse collapse-arrow bg-base-100">
          <input type="radio" name="faq-accordion" />
          <div class="collapse-title text-lg font-medium">
            A aplicação funciona offline?
          </div>
          <div class="collapse-content">
            <p>
              Atualmente, a aplicação requer conexão com a internet para carregar os conteúdos bíblicos. 
              Funcionalidades offline estão sendo consideradas para futuras atualizações.
            </p>
          </div>
        </div>
        <div class="collapse collapse-arrow bg-base-100">
          <input type="radio" name="faq-accordion" />
          <div class="collapse-title text-lg font-medium">
            Como altero o tema da aplicação?
          </div>
          <div class="collapse-content">
            <p class="mb-2">
              Para alterar o tema:
            </p>
            <ul class="list-disc list-inside space-y-1 ml-4">
              <li>Clique no ícone de paleta no cabeçalho da página</li>
              <li>Escolha entre os temas claros ou escuros disponíveis</li>
              <li>Sua preferência é salva automaticamente e aplicada em todas as páginas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

