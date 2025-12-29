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
    '@nuxt/icon',
    '@primevue/nuxt-module',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
  ],

  runtimeConfig: {
    apiBaseUrl: env.NUXT_API_BASE_URL || env.NUXT_PUBLIC_API_BASE_URL,

    public: {
      apiBaseUrl: env.NUXT_PUBLIC_API_BASE_URL,
    },
  },

  icon: {
    componentName: 'NuxtIcon'
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
})
