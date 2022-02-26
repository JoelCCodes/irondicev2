import path from 'path'

/* eslint-disable prefer-const */
let { DEPLOYED_NET_ENV, NETWORK_ID, NODE_ENV } = process.env
/* eslint-enable prefer-const */

console.log({ DEPLOYED_NET_ENV, NODE_ENV })

/**
 * const isMainnet   = NODE_ENV === 'production' && DEPLOYED_NET_ENV  === 'mainnet'
 * const isTestnet   = NODE_ENV === 'production' && DEPLOYED_NET_ENV  === 'testnet'
 * const isTestnet2  = NODE_ENV === 'production' && DEPLOYED_NET_ENV  === 'testnet2
 * const development = NODE_ENV === 'development' && DEPLOYED_NET_ENV === 'local'
 *
 * production  === app.ciphershooters.io     === mainnet
 * development === dev.ciphershooters.io     === testnet2 (before we hit mainnet)
 * uat         === staging.ciphershooters.io === testnet (currently where users test)
 * local       === localhost:3000            === local eth truffle development / ganache-cli
 */

// DEPRECATED serves as uat via staging.ciphershooters.io
// if (DEPLOYED_NET_ENV === 'testnet') {
//   NETWORK_ID = '80001'
//   IRONDICE_CONTRACT =
//     IRONDICE_CONTRACT || '0x6F6dA672be82bc400198A6bFF21d22B31D013b92'
//   TAGS_TOKEN_CONTRACT =
//     TAGS_TOKEN_CONTRACT || '0xc69F4eF2138764A52e7dd7Ec2931d1CdD7B32d0f'
// }

const networkData =
  DEPLOYED_NET_ENV === 'mainnet'
    ? [
        {
          // 137
          chainId: '0x89',
          chainName: 'Polygon',
          rpcUrls: ['https://polygon-rpc.com/'],
          socketRpcUrls: ['wss://matic-mainnet-full-ws.bwarelabs.com'],
          nativeCurrency: {
            name: 'Matic',
            symbol: 'MATIC',
            decimals: 18,
          },
          blockExplorerUrls: ['https://polygonscan.com/'],
        },
      ]
    : DEPLOYED_NET_ENV === 'testnet' || DEPLOYED_NET_ENV === 'testnet2'
    ? [
        {
          // 80001
          chainId: '0x13881',
          chainName: 'Matic Mumbai Testnet',
          rpcUrls: ['https://matic-mumbai.chainstacklabs.com/'],
          socketRpcUrls: ['wss://ws-matic-mumbai.chainstacklabs.com'],
          nativeCurrency: {
            name: 'Matic',
            symbol: 'MATIC',
            decimals: 18,
          },
          blockExplorerUrls: ['https://mumbai.polygonscan.com//'],
        },
      ]
    : [
        {
          // 1337
          chainId: '0x539',
          chainName: 'Truffle Development Local Net',
          rpcUrls: ['https://127.0.0.1:9545'],
          nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18,
          },
        },
      ]

const baseURL = 'https://localhost:3000'

console.log('\n')
console.log('baseURL: ', baseURL)
console.log('NETWORK_ID: ', NETWORK_ID)

console.log('\n')

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  generate: {
    fallback: true,
  },

  loading: {
    color: 'white',
    height: '5px',
  },

  loadingIndicator: {
    name: 'pulse',
    color: '#fff',
    background: 'rgba(81, 39, 197, 0.1)',
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'IronDice - Heavy Rolls for Heavy Hitters',
    htmlAttrs: {
      lang: 'en',
    },
    link: [
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: '/augmented-ui.min.css',
      },
    ],
    script: [
      {
        src: 'https://code.jquery.com/jquery-3.6.0.min.js',
        integrity: 'sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=',
        crossorigin: 'anonymous',
        type: 'text/javascript',
        charset: 'utf-8',
      },
      {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/tilt.js/1.2.1/tilt.jquery.min.js',
        type: 'text/javascript',
        charset: 'utf-8',
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    // MAINTAINED ORDER START
    // { src: '~/plugins/web3Modal.js', mode: 'client' },
    // { src: '~/plugins/web3.js', mode: 'client' },
    // { src: '~/plugins/contracts.js', mode: 'client' },
    // // MAINTAINED ORDER END
    // { src: '~/plugins/gasStations', mode: 'client' },
    // { src: '~/plugins/vue-particles.js', mode: 'client' },
    // { src: '~/plugins/vue-number.js', mode: 'client' },
    // { src: '~/plugins/typeit.js', mode: 'client' },
    // { src: '~/plugins/nft-storage-client.js', mode: 'client' },
    // { src: '~/plugins/nft-storage-file.js', mode: 'client' },
    // { src: '~/plugins/vuex-persist', mode: 'client' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: [
    {
      path: '~/components', // will get any components nested in let's say /components/test too
      pathPrefix: false,
    },
  ],
  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    // https://go.nuxtjs.dev/stylelint
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    standalone: true,
    plugins: [
      // new webpack.ProvidePlugin({
      //   // $: 'jquery',
      // }),
    ],
    splitChunks: {
      layouts: true,
    },
    extractCSS: {
      ignoreOrder: true,
    },
    optimization: {
      runtimeChunk: true,
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.(css|scss|sass|vue)$/,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    },
    html: {
      minify: {
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: true,
        minifyJS: true,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true,
      },
    },
    transpile: ['vee-validate'],
    // postcss: {
    //   plugins: {
    //     'postcss-custom-properties': false,
    //     tailwindcss: path.resolve(__dirname, '../tailwind.config.js'),
    //     'postcss-pxtorem': {
    //       propList: ['*', '!border*'],
    //     },
    //   },
    // },
    babel: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              esmodules: true,
            },
            loose: true,
            shippedProposals: true,
          },
        ],
      ],
    },
  },

  /**
   * const isMainnet   = NODE_ENV === 'production' && DEPLOYED_NET_ENV  === 'mainnet'
   * const isTestnet   = NODE_ENV === 'production' && DEPLOYED_NET_ENV  === 'testnet'
   * const isTestnet2  = NODE_ENV === 'production' && DEPLOYED_NET_ENV  === 'testnet2
   * const development = NODE_ENV === 'development' && DEPLOYED_NET_ENV === 'local'
   *
   * TODO:
   * production === app.ciphershooters.io === mainnet
   * development === dev.ciphershooters.io === testnet
   * staging === stage.ciphershooters.io === testnet2
   * local === localhost:3000 === local eth truffle development / ganache-cli
   */
  publicRuntimeConfig: {
    /**
     * access in app:
     *
     *      this.$config.NETWORK_ID
     *
     * https://nuxtjs.org/docs/2.x/directory-structure/nuxt-config#runtimeconfig
     *
     */

    baseURL,
    networkData,
    NODE_ENV,
    DEPLOYED_NET_ENV,
    NETWORK_ID,
  },
  privateRuntimeConfig: {
    DEPLOYED_NET_ENV,
  },
  // https://pwa.nuxtjs.org/
  pwa: {
    workbox: false,
    manifest: {
      name: 'CipherShooters',
      short_name: 'CS',
    },
    meta: {
      viewport: 'width=device-width, initial-scale=0.9',
      appleStatusBarStyle: 'black-translucent',
      nativeUI: true,
      name: 'CipherShooters',
      author: 'Humble DAO',
      description: 'Truly sustainable Play and Earn Cyberpunk RPG Battler',
      ogTitle: 'CipherShooters',
      ogDescription: 'Truly sustainable Play and Earn Cyberpunk RPG Battler',
      ogHost: baseURL,
      ogImage: '/CypherShooters_Logo_9.png',
    },
  },

  sitemap: {
    hostname: baseURL,
    gzip: true,
  },

  srcDir: '/',

  rootDir: './',

  tailwindcss: {
    cssPath: '~/assets/styles/tailwind.css',
    configPath: '~/../tailwind.config.js',
    exposeConfig: true,
    config: {},
  },

  router: {},
}
