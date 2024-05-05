import { resolve } from 'path';
import { defineConfig } from 'vite';
import vitePluginPugStatic from '@macropygia/vite-plugin-pug-static';
import { ViteMinifyPlugin } from 'vite-plugin-minify';
import globule from 'globule';

/**
 * PRODモードのパス書き換えを忘れないように
 */
const baseHref = {
  production: '/_local/phew/dist/', // '/phew/',
  development: '/',
};

const htmlFiles = globule.find('src/**/*.pug', {
  ignore: [
    'src/**/_*.pug',
  ],
});

export default defineConfig({
  root: 'src',
  base: (process.env.NODE_ENV === 'production') ? baseHref.production : baseHref.development,
  build: {
    emptyOutDir: true,
    outDir: resolve(__dirname, 'dist'),
    rollupOptions: {
      input: htmlFiles,
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: assetInfo => {
          if(/^_/.test(assetInfo.name ?? '')){
            return '';
          }else if(/[.](jpe?g|png|gif|svg)$/.test(assetInfo.name ?? '')){
            return 'assets/img/[name][extname]';
          }else if(/[.](woff2?|ttf|otf)$/.test(assetInfo.name ?? '')){
            return 'assets/fonts/[name][extname]';
          }else{
            return 'assets/[name][extname]';
          }
        },
      }
    },
  },
  plugins: [
    vitePluginPugStatic({
      buildLocals: {mode: 'PROD', baseHref: baseHref.production},
      buildOptions: {basedir: "src"},
      serveLocals: {mode: 'DEV', baseHref: baseHref.development},
      serveOptions: {basedir: "src"},
    }),
    ViteMinifyPlugin({}),
  ],
});
