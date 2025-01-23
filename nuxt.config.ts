export default defineNuxtConfig({
  modules: [],
  ssr: false,
  app: {
    head: {
      title: 'TechnoShop',
      meta: [{ name: 'description', content: 'Um site incrível com Nuxt 3' }],
    },
  },

  compatibilityDate: '2025-01-20'
});