import { resolve } from 'path';
import { defineConfig } from 'vite';
import vitePluginPugStatic from '@macropygia/vite-plugin-pug-static';
import { ViteMinifyPlugin } from 'vite-plugin-minify';
import globule from 'globule';
import { configDotenv } from 'dotenv';
const dotenvData = configDotenv({path: '.env'}).parsed;

/**
 * 必要なURLやPATHを.envから取得
 * @requires PRODモードのパス書き換えを忘れないように
 */
let path: {mode: string, strictAbsPath: string, rootAbsPath: string, innerPublicPath: string, outerPublicPath: string, version: string} = (() => {
  let mode = process.env.NODE_ENV ?? '';
  let strictAbsPath = [dotenvData?.DOMAIN_DEV, dotenvData?.DOCROOT_DEV, dotenvData?.SUBDIR_DEV].join('');
  let rootAbsPath = [dotenvData?.DOCROOT_DEV, dotenvData?.SUBDIR_DEV].join('');
  let innerPublicPath = [dotenvData?.PUBLIC_DEV].join('');
  let outerPublicPath = [dotenvData?.DOMAIN_DEV, dotenvData?.DOCROOT_DEV, dotenvData?.SUBDIR_DEV, dotenvData?.PUBLIC_DEV].join('');
  let version = dotenvData?.VERSION ?? '';

  let isTerminate = false;

  for(let i = 0, l = process.argv.length; i < l; i ++){
    switch(process.argv[i]){
      case '-local':
        mode += process.argv[i];
        strictAbsPath = [dotenvData?.DOMAIN_LOCAL, dotenvData?.DOCROOT_LOCAL, dotenvData?.SUBDIR_LOCAL].join('');
        rootAbsPath = [dotenvData?.DOCROOT_LOCAL, dotenvData?.SUBDIR_LOCAL].join('');
        innerPublicPath = [dotenvData?.PUBLIC_LOCAL].join('');
        outerPublicPath = [dotenvData?.DOMAIN_LOCAL, dotenvData?.DOCROOT_LOCAL, dotenvData?.SUBDIR_LOCAL, dotenvData?.PUBLIC_LOCAL].join('');
        isTerminate = true;
      break;

      case '-githubpages':
        mode += process.argv[i];
        strictAbsPath = [dotenvData?.DOMAIN_GITHUBPAGES, dotenvData?.DOCROOT_GITHUBPAGES, dotenvData?.SUBDIR_GITHUBPAGES].join('');
        rootAbsPath = [dotenvData?.DOCROOT_GITHUBPAGES, dotenvData?.SUBDIR_GITHUBPAGES].join('');
        innerPublicPath = [dotenvData?.PUBLIC_GITHUBPAGES].join('');
        outerPublicPath = [dotenvData?.DOMAIN_GITHUBPAGES, dotenvData?.DOCROOT_GITHUBPAGES, dotenvData?.SUBDIR_GITHUBPAGES, dotenvData?.PUBLIC_GITHUBPAGES].join('');
        isTerminate = true;
      break;

      case '-xserver':
        mode += process.argv[i];
        strictAbsPath = [dotenvData?.DOMAIN_XSERVER, dotenvData?.DOCROOT_XSERVER, dotenvData?.SUBDIR_XSERVER].join('');
        rootAbsPath = [dotenvData?.DOCROOT_XSERVER, dotenvData?.SUBDIR_XSERVER].join('');
        innerPublicPath = [dotenvData?.PUBLIC_XSERVER].join('');
        outerPublicPath = [dotenvData?.DOMAIN_XSERVER, dotenvData?.DOCROOT_XSERVER, dotenvData?.SUBDIR_XSERVER, dotenvData?.PUBLIC_XSERVER].join('');
        isTerminate = true;
      break;
    }

    if(isTerminate) break;
  }

  return {
    mode: mode,
    strictAbsPath: strictAbsPath,
    rootAbsPath: rootAbsPath,
    innerPublicPath: innerPublicPath,
    outerPublicPath: outerPublicPath,
    version: version,
  }
})();
/*
let path: {mode: string, strictAbsPath: string, rootAbsPath: string, innerPublicPath: string, outerPublicPath: string, version: string} = {
  mode: process.env.NODE_ENV ?? '',
  strictAbsPath: [dotenvData?.DOMAIN_DEV, dotenvData?.DOCROOT_DEV, dotenvData?.SUBDIR_DEV].join(''),
  rootAbsPath: [dotenvData?.DOCROOT_DEV, dotenvData?.SUBDIR_DEV].join(''),
  innerPublicPath: [dotenvData?.PUBLIC_DEV].join(''),
  outerPublicPath: [dotenvData?.DOMAIN_DEV, dotenvData?.DOCROOT_DEV, dotenvData?.SUBDIR_DEV, dotenvData?.PUBLIC_DEV].join(''),
  version: dotenvData?.VERSION ?? '',
};

for(let i = 0, l = process.argv.length; i < l; i ++){
  if(process.argv[i] === '-local'){
    path.mode += process.argv[i];
    path.strictAbsPath = [dotenvData?.DOMAIN_LOCAL, dotenvData?.DOCROOT_LOCAL, dotenvData?.SUBDIR_LOCAL].join('');
    path.rootAbsPath = [dotenvData?.DOCROOT_LOCAL, dotenvData?.SUBDIR_LOCAL].join('');
    path.innerPublicPath = [dotenvData?.PUBLIC_LOCAL].join('');
    path.outerPublicPath = [dotenvData?.DOMAIN_LOCAL, dotenvData?.DOCROOT_LOCAL, dotenvData?.SUBDIR_LOCAL, dotenvData?.PUBLIC_LOCAL].join('');
    break;
  }
  if(process.argv[i] === '-githubpages'){
    path.mode += process.argv[i];
    path.strictAbsPath = [dotenvData?.DOMAIN_GITHUBPAGES, dotenvData?.DOCROOT_GITHUBPAGES, dotenvData?.SUBDIR_GITHUBPAGES].join('');
    path.rootAbsPath = [dotenvData?.DOCROOT_GITHUBPAGES, dotenvData?.SUBDIR_GITHUBPAGES].join('');
    path.innerPublicPath = [dotenvData?.PUBLIC_GITHUBPAGES].join('');
    path.outerPublicPath = [dotenvData?.DOMAIN_GITHUBPAGES, dotenvData?.DOCROOT_GITHUBPAGES, dotenvData?.SUBDIR_GITHUBPAGES, dotenvData?.PUBLIC_GITHUBPAGES].join('');
    break;
  }
  if(process.argv[i] === '-xserver'){
    path.mode += process.argv[i];
    path.strictAbsPath = [dotenvData?.DOMAIN_XSERVER, dotenvData?.DOCROOT_XSERVER, dotenvData?.SUBDIR_XSERVER].join('');
    path.rootAbsPath = [dotenvData?.DOCROOT_XSERVER, dotenvData?.SUBDIR_XSERVER].join('');
    path.innerPublicPath = [dotenvData?.PUBLIC_XSERVER].join('');
    path.outerPublicPath = [dotenvData?.DOMAIN_XSERVER, dotenvData?.DOCROOT_XSERVER, dotenvData?.SUBDIR_XSERVER, dotenvData?.PUBLIC_XSERVER].join('');
    break;
  }
}
*/

/**
 * PRODモードのパス書き換えを忘れないように
 * データ自体は.envに保存しています
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
      buildLocals: {mode: path.mode, version: path.version, strictAbsPath: path.strictAbsPath, rootAbsPath: path.rootAbsPath, innerPublicPath: path.innerPublicPath, outerPublicPath: path.outerPublicPath},
      buildOptions: {basedir: "src"},
      serveLocals: {mode: path.mode, version: path.version, strictAbsPath: path.strictAbsPath, rootAbsPath: path.rootAbsPath, innerPublicPath: path.innerPublicPath, outerPublicPath: path.outerPublicPath},
      serveOptions: {basedir: "src"},
    }),
    ViteMinifyPlugin({}),
  ],
});
