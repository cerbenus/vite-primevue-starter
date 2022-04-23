import { resolve } from 'path';
import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import pkg from './package.json';
import Restart from 'vite-plugin-restart';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import Inspect from 'vite-plugin-inspect';
import Unocss from 'unocss/vite';
import { presetUno, presetAttributify } from 'unocss';
import presetIcons from '@unocss/preset-icons';

process.env.VITE_APP_BUILD_EPOCH = new Date().getTime();
process.env.VITE_APP_VERSION = pkg.version;

/**
 * @type {import('vite').UserConfig}
 */
export default defineConfig({
  server: {
    https: false,
    port: 8000,
    proxy: {
      '/api': {
        target: 'http://your.api.com',
        changeOrigin: true,
        secure: false,
        //rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    hmr: {
      port: false,
      path: '/ws'
    }
  },
  build: {
    sourcemap: true,
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
    ],
    exclude: [
    ],
  },
  plugins: [
    Unocss({
      presets: [
        presetUno(),
        presetAttributify({ /* preset options */}),
        presetIcons({ /* options */ })
        // ...custom presets
      ]
    }),
    Vue({
      include: [/\.vue$/],
      template: {
        compilerOptions: {
          directiveTransforms: {
            styleclass: () => ({
              props: [],
              needRuntime: true,
            }),
            ripple: () => ({
              props: [],
              needRuntime: true,
            }),
          }
        }
      }
    }),
    Components({
      resolvers: [
      ],
    }),
    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        'vue-router',
      ],
      exclude: [
        '**/dist/**',
      ],
    }),
    Restart({
      ////restart: ['./vite.config.js'],
    }),

    // https://github.com/antfu/vite-plugin-inspect
    Inspect({
      // change this to enable inspect for debugging
      enabled: false,
    }),
  ],
  resolve: {
    preserveSymlinks: true,
    alias: {
      '@': resolve(__dirname, './src'),
      src: resolve(__dirname, './src'),
      '~': resolve(__dirname, 'node_modules/'),
    },
  },
  css:
    {
      preprocessorOptions:
        {
          scss:
            {
              additionalData: `@import "@/sass/variables"; @import "@/sass/sakai/mixins";`
            }
        }
    }
});
