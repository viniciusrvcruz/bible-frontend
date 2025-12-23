import tailwindcss from '@tailwindcss/vite';
import Aura from '@primeuix/themes/aura';

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
  ],

  icon: {
    componentName: 'NuxtIcon'
  },

  primevue: {
    options: {
      theme: {
        preset: Aura
      }
    }
  }
})