# 📖 Bible

Uma aplicação web moderna e responsiva para leitura da Bíblia, desenvolvida com Nuxt 4 e Vue 3. O projeto oferece uma interface intuitiva e elegante para navegar entre livros, capítulos e versículos, com suporte a múltiplas versões bíblicas e temas claro/escuro.

## ✨ Funcionalidades

- 📚 **Navegação intuitiva**: Explore livros, capítulos e versículos de forma simples
- 🔄 **Múltiplas versões**: Suporte para diferentes versões da Bíblia
- 🎨 **Temas variados**: Acesso a todos os temas do DaisyUI para personalização completa
- 📱 **Design responsivo**: Interface otimizada para desktop, tablet e mobile
- ⚡ **Performance**: Carregamento rápido com SSR (Server-Side Rendering)
- 🖌️ **UI Moderna**: Interface clean com TailwindCSS, DaisyUI e componentes PrimeVue
- 🔍 **Seletor de versículos**: Painel interativo para navegação rápida
- 🔐 **Type-safe**: Validação de dados com Zod e TypeScript

## 🛠️ Tecnologias

Este projeto foi construído com as seguintes tecnologias:

- **[Nuxt 4](https://nuxt.com/)** - Framework Vue.js full-stack
- **[Vue 3](https://vuejs.org/)** - Framework JavaScript progressivo
- **[TypeScript](https://www.typescriptlang.org/)** - JavaScript com tipagem estática
- **[TailwindCSS 4](https://tailwindcss.com/)** - Framework CSS utility-first
- **[DaisyUI](https://daisyui.com/)** - Biblioteca de componentes para Tailwind
- **[PrimeVue](https://primevue.org/)** - Biblioteca de componentes Vue
- **[Pinia](https://pinia.vuejs.org/)** - Gerenciamento de estado para Vue
- **[Zod](https://zod.dev/)** - Validação de schemas TypeScript-first
- **[Nuxt Icon](https://nuxt.com/modules/icon)** - Sistema de ícones
- **[Docker](https://www.docker.com/)** - Containerização da aplicação

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 20 ou superior - recomenda-se a versão LTS)
- **npm**, **pnpm**, **yarn** ou **bun**
- **Docker** e **Docker Compose** (opcional, para execução com containers)

## 🚀 Como Executar

### Instalação Local

1. **Clone o repositório**

```bash
git clone https://github.com/seu-usuario/bible-frontend.git
cd bible-frontend
```

2. **Instale as dependências**

```bash
npm install
# ou
pnpm install
# ou
yarn install
# ou
bun install
```

3. **Configure as variáveis de ambiente**

Copie o arquivo `.env.example` para `.env` e ajuste as variáveis conforme necessário:

```bash
cp .env.example .env
```

Exemplo de variáveis:

```env
# URL da API backend
NUXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NUXT_API_BASE_URL=http://localhost:8000/api
```

4. **Inicie o servidor de desenvolvimento**

```bash
npm run dev
# ou
pnpm dev
# ou
yarn dev
# ou
bun run dev
```

A aplicação estará disponível em `http://localhost:3000`

### Executando com Docker

1. **Suba o container**

```bash
docker-compose up -d
```

2. **Acesse o container**

```bash
docker exec -it bible_frontend bash
```

3. **Instale as dependências e inicie o servidor**

```bash
npm install
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## 📦 Build para Produção

Para criar uma versão otimizada para produção:

```bash
npm run build
```

Para visualizar a build de produção localmente:

```bash
npm run preview
```

## 📁 Estrutura do Projeto

```
bible-frontend/
├── app/
│   ├── assets/              # Arquivos estáticos (CSS, imagens)
│   ├── components/          # Componentes Vue reutilizáveis
│   │   ├── bible/          # Componentes específicos da Bíblia
│   │   │   ├── chapter/    # Componente de capítulo
│   │   │   └── verse_selector/ # Seletor de versículos
│   │   ├── Header.vue      # Cabeçalho da aplicação
│   │   ├── Icon.vue        # Componente de ícones
│   │   └── ThemeSelectorPopover.vue # Seletor de tema
│   ├── composables/         # Composables Vue (lógica reutilizável)
│   │   ├── services/       # Serviços de API
│   │   └── useApi.ts       # Configuração da API
│   ├── layouts/            # Layouts da aplicação
│   ├── pages/              # Páginas e rotas
│   │   ├── bible/          # Páginas relacionadas à Bíblia
│   │   └── index.vue       # Página inicial
│   ├── stores/             # Stores do Pinia
│   ├── types/              # Tipos TypeScript e schemas Zod
│   └── utils/              # Funções utilitárias
├── public/                  # Arquivos públicos estáticos
├── docker-compose.yml       # Configuração do Docker
├── nuxt.config.ts          # Configuração do Nuxt
├── package.json            # Dependências do projeto
├── tsconfig.json           # Configuração do TypeScript
└── README.md               # Este arquivo
```

## 🎯 Funcionalidades em Desenvolvimento

- [ ] Sistema de busca de versículos
- [ ] Histórico de leitura
- [ ] Sistema de anotações
- [ ] Compartilhamento de versículos
- [ ] Modo de leitura (maior tamanho de fonte)
- [ ] Comparação entre versões
- [ ] Copiar versículos selecionados
- [ ] Suporte a mais idiomas

## 🤝 Como Contribuir

Contribuições são sempre bem-vindas! Aqui está como você pode ajudar:

### 1. Fork o Projeto

Clique no botão "Fork" no topo da página do repositório.

### 2. Clone seu Fork

```bash
git clone https://github.com/seu-usuario/bible-frontend.git
cd bible-frontend
```

### 3. Crie uma Branch

**⚠️ Importante: Branches, commits e comentários no código devem ser sempre em inglês**

```bash
git checkout -b feature/my-new-feature
# ou
git checkout -b fix/bug-fix
```

### 4. Faça suas Alterações

- Escreva código limpo e bem documentado
- Siga os padrões de código do projeto
- Mantenha commits atômicos e com mensagens claras
- **Todos os comentários no código devem ser em inglês**

### 5. Commit suas Mudanças

```bash
git add .
git commit -m "feat: add new feature X"
```

**Padrão de commits (Conventional Commits - em inglês):**
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação (sem mudança de código)
- `refactor:` Refatoração de código
- `chore:` Tarefas de manutenção

### 6. Push para seu Fork

```bash
git push origin feature/my-new-feature
```

### 7. Abra um Pull Request

Vá até o repositório original e clique em "New Pull Request". Descreva suas mudanças detalhadamente.

### 📝 Diretrizes de Contribuição

- **Code Style**: Siga as convenções do Vue 3 e TypeScript
- **Componentes**: Use Composition API com `<script setup>`
- **Tipagem**: Sempre defina tipos TypeScript
- **CSS**: Utilize classes do TailwindCSS e componentes do DaisyUI
- **Validação**: Use Zod para validação de dados
- **Documentação**: Documente código complexo e novas funcionalidades
- **Idioma**: Branches, commits e comentários no código devem ser em inglês

### 🐛 Reportando Bugs

Encontrou um bug? Por favor, abra uma [issue](https://github.com/seu-usuario/bible-frontend/issues) com:

- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs. atual
- Screenshots (se aplicável)
- Informações do ambiente (OS, navegador, versão do Node, etc.)

### 💡 Sugestões de Funcionalidades

Tem uma ideia? Abra uma [issue](https://github.com/seu-usuario/bible-frontend/issues) com a tag `enhancement` e descreva:

- O problema que sua sugestão resolve
- Como você imagina a funcionalidade
- Possíveis alternativas consideradas

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuidores

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/viniciusrvcruz">
        <img src="https://github.com/viniciusrvcruz.png" width="80px;" alt="Vinicius Cruz Profile Picture"/><br>
        <sub>
          <b>Vinicius Cruz (autor)</b>
        </sub>
      </a><br>
      <a href="https://github.com/viniciusrvcruz" title="GitHub">
        <img src="https://skillicons.dev/icons?i=github" width="25px" />
      </a>
      <a href="https://www.linkedin.com/in/viniciuscruz7" title="LinkedIn">
        <img src="https://skillicons.dev/icons?i=linkedin" width="25px" />
      </a>
    </td>
  </tr>
</table>


---

<div align="center">
  <p>Desenvolvido com ❤️ por Vinicius Cruz</p>
  <p>⭐ Deixe uma estrela se este projeto te ajudou!</p>
</div>
