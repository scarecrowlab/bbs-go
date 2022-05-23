export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    meta: [
      {
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, minimal-ui'
      },
      {
        name: 'window-target',
        content: '_top'
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' }]
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  // css: [{ src: '~/assets/styles/main.scss', lang: 'scss' }],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/element-ui',
    '~/plugins/vue-tailwind.js',
    '~/plugins/filters',
    '~/plugins/axios',
    '~/plugins/bbs-go',
    { src: '~/plugins/vue-lazyload', ssr: false },
    { src: '~/plugins/viewer.js', ssr: false },
    { src: '~plugins/vue-js-modal.client.js', ssr: false }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,
  /*
   ** Router property -  https://nuxtjs.org/docs/2.x/features/file-system-routing#the-router-property
   */
  router: {
    middleware: ['resetEnv']
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxt/postcss8',
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/color-mode'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/eslint-module',
    ['cookie-universal-nuxt', { alias: 'cookies' }]
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    proxy: true,
    credentials: true
  },

  proxy: {
    '/api/': 'http://127.0.0.1:8082'
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {}
      }
    },
    babel: {
      plugins: [
        [
          'component',
          {
            libraryName: 'element-ui',
            styleLibraryName: 'theme-chalk'
          }
        ]
      ],
      presets (env, [preset, options]) {
        return [['@nuxt/babel-preset-app', options]]
      }
    }
  }
}
