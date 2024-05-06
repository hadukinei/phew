import { resolve } from 'path';
import { defineConfig } from 'vite';
import vitePluginPugStatic from '@macropygia/vite-plugin-pug-static';
import { ViteMinifyPlugin } from 'vite-plugin-minify';
import globule from 'globule';
import { configDotenv } from 'dotenv';
const dotenvData = configDotenv({path: '.env'}).parsed;

let mode = process.env.NODE_ENV ?? '', dist = 'local';
for(let i = 0, l = process.argv.length; i < l; i ++){
  if(process.argv[i] === '-server'){
    dist = 'server';
  }
}

/**
 * PRODモードのパス書き換えを忘れないように
 * データ自体は.envに保存しています
 */
const baseHref = {
  production: (dist === 'server') ? dotenvData?.BASEDIR_SERVER : dotenvData?.BASEDIR_LOCAL,
  development: '/',
};

const htmlFiles = globule.find(['*.pug', 'src/**/*.pug'], {
  ignore: [
    'src/**/_*.*',
    '_*.*',
  ],
});

export default defineConfig({
  root: './',
  base: baseHref[mode],
  build: {
    emptyOutDir: true,
    outDir: resolve(__dirname, 'dist'),
    rollupOptions: {
      input: htmlFiles,
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: assetInfo => {
          if(/[.](pug)$/.test(assetInfo.name ?? '')){
            return '../[name][extname].html';
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
      buildLocals: {mode: 'PROD', dist: dist, baseHref: baseHref[mode]},
      buildOptions: {basedir: "src"},
      serveLocals: {mode: 'DEV', dist: dist, baseHref: baseHref[mode]},
      serveOptions: {basedir: "src"},
    }),
    ViteMinifyPlugin({}),
  ],
});
