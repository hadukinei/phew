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
    break;
  }
  if(process.argv[i] === '-xserver'){
    dist = 'xserver';
    break;
  }
}
console.log(mode, dist);

/**
 * PRODモードのパス書き換えを忘れないように
 * データ自体は.envに保存しています
 */
const baseHref = {
  production: (dist === 'server') ? dotenvData?.BASEDIR_SERVER : (dist === 'xserver' ? dotenvData?.BASEDIR_XSERVER : dotenvData?.BASEDIR_LOCAL),
  development: '/',
};

const htmlFiles = globule.find(['*.pug', 'src/**/*.pug'], {
  ignore: [
    'src/**/_*.*',
    '_*.*',
  ],
});

export default defineConfig({
  root: 'src',
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
          if(/[.](jpe?g|png|gif|svg)$/.test(assetInfo.name ?? '')){
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
