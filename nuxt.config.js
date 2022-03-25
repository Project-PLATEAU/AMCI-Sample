import meta from './meta.json'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: meta.title,
    htmlAttrs: {
      lang: 'ja',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: meta.description },
      { name: 'format-detection', content: 'telephone=no' },
      { hid: 'og:image', property: 'og:image', content: 'https://amci.tokyo-omy-w.jp/og_image.png' },
      { hid: 'og:site_name', property: 'og:site_name', content: meta.title },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:url', property: 'og:url', content: meta.url },
      { hid: 'og:title', property: 'og:title', content: meta.title },
      { hid: 'og:description', property: 'og:description', content: meta.description },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['minireset.css/minireset.sass', '~/assets/styles/common.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['~/plugins/data'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [
    '~/components',
    {
      path: '~/components/gl/',
      prefix: '',
    },
    {
      path: '~/components/graph/',
      prefix: '',
    },
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://github.com/nuxt-community/style-resources-module
    '@nuxtjs/style-resources',
    // https://github.com/nuxt-community/svg-module
    '@nuxtjs/svg',
    // https://github.com/nuxt-community/device-module
    '@nuxtjs/device',
    // https://github.com/nuxt-community/google-analytics-module
    '@nuxtjs/google-gtag',
    // https://github.com/nuxt-community/google-fonts-module
    '@nuxtjs/google-fonts',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
  ],

  modulesDir: ['./node_modules'],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config) {
      if (config.module) {
        config.module.rules.push(
          {
            test: /\.(vert|frag)$/i,
            use: ['raw-loader'],
          },
          {
            test: /\.(ogg|mp3|wav|mpe?g)$/i,
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          }
        )
      }
    },

    terser: {
      terserOptions: {
        compress: {
          drop_console: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'training',
        },
      },
    },
  },

  srcDir: 'src/',

  styleResources: {
    scss: ['~/assets/styles/resources/_variables.scss'],
  },

  'google-gtag': {
    id: '',
  },

  googleFonts: {
    families: {
      Roboto: [700],
    },
    display: 'block',
    download: true,
    inject: true,
    stylePath: 'styles/fonts.css',
  },
}
