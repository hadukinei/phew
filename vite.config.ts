import { resolve } from 'path';
import { defineConfig } from 'vite';
import vitePluginPugStatic from '@macropygia/vite-plugin-pug-static';
import { ViteMinifyPlugin } from 'vite-plugin-minify';
import globule from 'globule';
import { configDotenv } from 'dotenv';
const dotenvData = configDotenv({path: '.env'}).parsed;

let mode = process.env.NODE_ENV ?? '';
let version = dotenvData?.VERSION;
let path = {
  strictAbsPath: [dotenvData?.DOMAIN_DEV, dotenvData?.DOCROOT_DEV, dotenvData?.SUBDIR_DEV].join(''),
  rootAbsPath: [dotenvData?.DOCROOT_DEV, dotenvData?.SUBDIR_DEV].join(''),
  innerPublicPath: [dotenvData?.PUBLIC_DEV].join(''),
  outerPublicPath: [dotenvData?.DOMAIN_DEV, dotenvData?.DOCROOT_DEV, dotenvData?.SUBDIR_DEV, dotenvData?.PUBLIC_DEV].join(''),
};

for(let i = 0, l = process.argv.length; i < l; i ++){
  if(process.argv[i] === '-local'){
    mode += process.argv[i];
    path.strictAbsPath = [dotenvData?.DOMAIN_LOCAL, dotenvData?.DOCROOT_LOCAL, dotenvData?.SUBDIR_LOCAL].join('');
    path.rootAbsPath = [dotenvData?.DOCROOT_LOCAL, dotenvData?.SUBDIR_LOCAL].join('');
    path.innerPublicPath = [dotenvData?.PUBLIC_LOCAL].join('');
    path.outerPublicPath = [dotenvData?.DOMAIN_LOCAL, dotenvData?.DOCROOT_LOCAL, dotenvData?.SUBDIR_LOCAL, dotenvData?.PUBLIC_LOCAL].join('');
    break;
  }
  if(process.argv[i] === '-githubpages'){
    mode += process.argv[i];
    path.strictAbsPath = [dotenvData?.DOMAIN_GITHUBPAGES, dotenvData?.DOCROOT_GITHUBPAGES, dotenvData?.SUBDIR_GITHUBPAGES].join('');
    path.rootAbsPath = [dotenvData?.DOCROOT_GITHUBPAGES, dotenvData?.SUBDIR_GITHUBPAGES].join('');
    path.innerPublicPath = [dotenvData?.PUBLIC_GITHUBPAGES].join('');
    path.outerPublicPath = [dotenvData?.DOMAIN_GITHUBPAGES, dotenvData?.DOCROOT_GITHUBPAGES, dotenvData?.SUBDIR_GITHUBPAGES, dotenvData?.PUBLIC_GITHUBPAGES].join('');
    break;
  }
  if(process.argv[i] === '-xserver'){
    mode += process.argv[i];
    path.strictAbsPath = [dotenvData?.DOMAIN_XSERVER, dotenvData?.DOCROOT_XSERVER, dotenvData?.SUBDIR_XSERVER].join('');
    path.rootAbsPath = [dotenvData?.DOCROOT_XSERVER, dotenvData?.SUBDIR_XSERVER].join('');
    path.innerPublicPath = [dotenvData?.PUBLIC_XSERVER].join('');
    path.outerPublicPath = [dotenvData?.DOMAIN_XSERVER, dotenvData?.DOCROOT_XSERVER, dotenvData?.SUBDIR_XSERVER, dotenvData?.PUBLIC_XSERVER].join('');
    break;
  }
}

/**
 * PRODモードのパス書き換えを忘れないように
 * データ自体は.envに保存しています
 */
/*
const baseHref = {
  production: (() => {
    switch(dist){
      case 'githubpages':
      return dotenvData?.BASEDIR_GITHUBPAGES;
      case 'xserver':
      return dotenvData?.BASEDIR_XSERVER;
      default:
      return dotenvData?.BASEDIR_LOCAL;
    }
  })(),
  development: '/',
};
const baseUri = (() => {
  switch(dist){
    case 'githubpages':
    return dotenvData?.ABSPATH_GITHUBPAGES;
    case 'xserver':
    return dotenvData?.ABSPATH_XSERVER;
    default:
    return dotenvData?.ABSPATH_LOCAL;
  }
})();
*/

const htmlFiles = globule.find(['*.pug', 'src/**/*.pug'], {
  ignore: [
    'src/**/_*.*',
    '_*.*',
  ],
});

export default defineConfig({
  root: 'src',
  base: path.rootAbsPath,
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
      buildLocals: {mode: mode, version: version, strictAbsPath: path.strictAbsPath, rootAbsPath: path.rootAbsPath, innerPublicPath: path.innerPublicPath, outerPublicPath: path.outerPublicPath},
      buildOptions: {basedir: "src"},
      serveLocals: {mode: mode, version: version, strictAbsPath: path.strictAbsPath, rootAbsPath: path.rootAbsPath, innerPublicPath: path.innerPublicPath, outerPublicPath: path.outerPublicPath},
      serveOptions: {basedir: "src"},
    }),
    ViteMinifyPlugin({}),
  ],
});
