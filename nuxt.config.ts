import tailwindcss from '@tailwindcss/vite';
import Aura from '@primeuix/themes/aura';
import { env } from './app/utils/env';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  vite: {
    plugins: [tailwindcss()],
  },

  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/test-utils/module',
    '@nuxt/icon',
    '@primevue/nuxt-module',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@nuxtjs/seo',
    'nuxt-clarity-analytics',
    '@vite-pwa/nuxt',
    'nuxt-gtag',
  ],

  gtag: {
    enabled: process.env.NODE_ENV === 'production',
  },

  pwa: {
    manifest: {
      name: 'Bibleasy',
      short_name: 'Bibleasy',
      description:
        'Leia a Bíblia online de forma fácil e intuitiva. Acesse diferentes versões, personalize sua experiência e encontre qualquer versículo rapidamente.',
      lang: 'pt-BR',
      start_url: '/',
      display: 'standalone',
      background_color: '#e2cec0',
      theme_color: '#e2cec0',
      icons: [
        {
          src: '/logo.png',
          sizes: '215x215',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/favicon.ico',
          sizes: '150x158',
          type: 'image/x-icon',
        },
      ],
      screenshots: [
        {
          src: '/screenshots/desktop-v2.png',
          sizes: '1280x720',
          type: 'image/png',
          form_factor: 'wide',
          label: 'Bibleasy no desktop',
        },
        {
          src: '/screenshots/mobile-v2.png',
          sizes: '360x740',
          type: 'image/png',
          form_factor: 'narrow',
          label: 'Bibleasy no mobile',
        },
      ],
    },
  },

  runtimeConfig: {
    apiBaseUrl: env.NUXT_API_BASE_URL || env.NUXT_PUBLIC_API_BASE_URL,
    apiKey: env.NUXT_API_KEY,

    public: {
      apiBaseUrl: env.NUXT_PUBLIC_API_BASE_URL,
      defaultVersionAbbreviation: env.NUXT_PUBLIC_DEFAULT_VERSION_ABBREVIATION,
    },
  },

  icon: {
    componentName: 'NuxtIcon',
    serverBundle: {
      collections: [
        'lucide',
        'mdi',
        'tabler',
        'simple-icons'
      ]
    },
  },

  primevue: {
    options: {
      theme: {
        preset: Aura
      }
    }
  },

  colorMode: {
    preference: 'system',
    fallback: 'light',
    storage: 'cookie',
    dataValue: 'theme'
  },

  // SEO Configuration
  site: {
    url: 'https://bibleasy.com',
    name: 'Bibleasy',
    description: 'Leia a Bíblia online de forma fácil e intuitiva. Acesse diferentes versões, personalize sua experiência e encontre qualquer versículo rapidamente.',
    defaultLocale: 'pt-BR',
  },

  seo: {
    meta: {
      author: 'Bibleasy',
      applicationName: 'Bibleasy',
    },
  },

  ogImage: {
    enabled: true,
    defaults: {
      url: 'https://bibleasy.com/logo.png',
      alt: 'Bibleasy - Bíblia Online Fácil e Gratuita',
    },
  },

  sitemap: {
    excludeAppSources: ['nuxt:pages'],
    sources: ['/api/__sitemap__/urls'],
  },

  robots: {
    disallow: [],
    sitemap: '/sitemap.xml',
  },

  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'Bibleasy',
      url: 'https://bibleasy.com',
      logo: 'https://bibleasy.com/favicon.ico',
    },
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'pt-BR',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
      meta: [
        { property: 'og:image', content: 'https://bibleasy.com/logo.png' },
        { property: 'og:image:width', content: '215' },
        { property: 'og:image:height', content: '215' },
        { property: 'og:image:alt', content: 'Bibleasy - Bíblia Online Fácil e Gratuita' },
        { name: 'twitter:image', content: 'https://bibleasy.com/logo.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@Bibleasy' },
      ],
    },
  },
})