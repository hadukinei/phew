# Viteの導入手順
mkdir project-folder
drag_and_drop project-folder into vscode
npm init -y
npm create vite@latest .

- Current directory is not empty. Please choose how to proceed:
  - Ignore fires and continue
- Select a framework
  - Vanilla
- Select a variant
  - TypeScript

npm i -D @macropygia/vite-plugin-pug-static sass globule @types/globule vite-plugin-minify fs bootstrap tailwindcss postcss autoprefixer
npx tailwindcss init -p

vi .gitignore -add -- :last package-lock.json
vi tailwind.config.js -change -- :from content:[], :to content:['./src/**/*.{ts,pug}'],
mkdir _default
mkdir _default/src
mkdir _default/public
mv index.html -to _default
mv src/* -to _default/src
mv public/* -to _default/public

vi vite.config.ts -new
> baseHref変数のPRODモード指定を変更し忘れないように

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
``
  import '../css/index.scss'
  import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
``

### Git管理
この時点ではPrivateリポジトリなので自由に制作可能
