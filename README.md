# Viteの導入手順

## フォルダ作り
mkdir project-folder
drag_and_drop project-folder into vscode

## npm
npm init -y
npm create vite@latest .

- Current directory is not empty. Please choose how to proceed:
  - Ignore files and continue
- Select a framework
  - Vanilla
- Select a variant
  - TypeScript

npm i -D @macropygia/vite-plugin-pug-static sass globule @types/globule vite-plugin-minify fs bootstrap tailwindcss postcss autoprefixer
npx tailwindcss init -p

## 設定変更
vi .gitignore -add -- :last package-lock.json
vi .gitignore -commentout -- dist
vi package.json :add scripts.copy
vi copyPublic.js -- take_from_previous_project
vi tailwind.config.js -change -- :from content:[], :to content:['./src/**/*.{ts,pug}'],
vi vite.config.ts -new
> baseHref変数のPRODモード指定を変更し忘れないように

## デフォルトのプロジェクトファイルを撤去
mkdir _default
mkdir _default/src
mkdir _default/public
mv index.html -to _default
mv src/* -to _default/src
mv public/* -to _default/public
> 使い方のファイルを一式撤去する
> 方法を振り返る必要がないのなら削除しても構わない

## GitHub
drag_and_drop project-folder into GitHub_Desktop
> Click: create a repository
> Click: Create repository
> Click: Publish repository
> Click: Publish repository

**以上でViteの環境設定は完了**

---
---
## 制作
srcフォルダに、pug, scss, tsファイルを作成する

npm run devで開発し、npm run buildで書き出す
DEVのアドレスは`http://localhost:5173`辺り（ポート番号は変わるかも）

### pug
基本的には通常のpug
src/*.pugの階層を基本とする

注意点は次の通り

+ cssファイルの読み込みは書かない
+ 末尾に`script(type="module", src="ts/index.ts")`を追記
+ srcフォルダ以下の階層にあるリソースファイルは自動的にバンドルされる

### scss
src/css/*.scssの階層を基本とする

Tailwind CSSを利用する場合、先頭に次の設定を追記
``
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
``

### ts
src/ts/*.tsの階層を基本とする

CSS/Scssファイルのインポート処理を行う
Bootstrapを利用する場合は下例のように読み込むだけでいい
``
  import '../css/index.scss'
  import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
``

### img
src/img/*.{png,jpe?g,gif,svg}の階層を基本とする

### Git管理
この時点ではPrivateリポジトリなので自由に制作可能

### ちなみに
本来のViteではbody直下には#appとscript(type="module")しかない
SSRとしての機能を一切使わないのでPugでゴリ押しした

RootDirをデプロイするのでなくdistをデプロイ対象にしたため、publicフォルダが機能しない恐れがある
