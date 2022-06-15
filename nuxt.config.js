export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  target: 'static',
  axios: {
    // BACKEND_URL: process.env.BACKEND_URL,
    // proxyHeaders: false,
    // credentials: false
  },
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
  },
  router: {
    base: '/project_management/'
  },
  head: {
    title: 'Kanban Test',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  // css: [
  // ],

  css: [
    '@/static/css/login.css',
    '@/static/css/kanban.css',
    '@/static/css/popup-card.css',
    '@/static/css/kanban-profile-card.css',
  ],
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  // plugins: [
  //   '~/plugins/axios',
  // ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/fontawesome'
  ],

  fontawesome: {
    icons: {
      solid: true,
    }
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios'
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    babel: {
      compact: true
    }
  },
  // server: {
  //   host: '0'
  // }
}
