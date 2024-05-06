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

npm i -D @macropygia/vite-plugin-pug-static sass globule @types/globule vite-plugin-minify fs dotenv bootstrap tailwindcss postcss autoprefixer
npx tailwindcss init -p

## 設定変更
vi .gitignore -add -- :last package-lock.json
vi .gitignore -commentout -- dist
vi package.json :change scripts
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
# 制作
srcフォルダに、pug, scss, tsファイルを作成する

npm run devで開発し、npm run buildで書き出す
buildはApacheが通っているフォルダを検証可能
サーバー用に書き出す場合はnpm run build:serverしてからnpm run copyする
> ビルドをするとdistフォルダがクリーンアップされるので都度コピーする必要がある

DEVのアドレスは`http://localhost:5173`辺り（ポート番号は変わるかも）

制作中は、GA/GTAGの設定は後回し
URLは確定しているのだが、そのURLが未だprivate状態で公開されていないので登録ができない

- `URL`: https://**GitHubアカウント名**.github.io/**リポジトリ名**/

## pug
基本的には通常のpug
src/*.pugの階層を基本とする

注意点は次の通り

+ cssファイルの読み込みは書かない
+ 末尾に`script(type="module", src="ts/index.ts")`を追記
+ srcフォルダ以下の階層にあるリソースファイルは自動的にバンドルされる

## scss
src/css/*.scssの階層を基本とする

Tailwind CSSを利用する場合、先頭に次の設定を追記
``
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
``

## ts
src/ts/*.tsの階層を基本とする

CSS/Scssファイルのインポート処理を行う
Bootstrapを利用する場合は下例のように読み込むだけでいい
``
  import '../css/index.scss'
  import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
``

## img
src/img/*.{png,jpe?g,gif,svg}の階層を基本とする

## Git管理
この時点ではPrivateリポジトリなので自由に制作可能

## ちなみに
本来のViteではbody直下には#appとscript(type="module")しかない
SSRとしての機能を一切使わないのでPugでゴリ押しした

RootDirをデプロイするのでなくdistをデプロイ対象にするので、publicフォルダが機能しない
公開前に`npm run copy`でdist/publicへとコピーする


---
---
# GitHub Pagesでの公開

## パブリックに変更
github.comのリポジトリページへ移動

- Settings
- General
- Danger Zone (下の方)
- Change repository visibility
- `Click`: Change visibility
- `Select`: Change to public
- `Click`: I want to make this repository public [*&#x2020; 1a*](#1a-注釈)
- `Click`: I have read and understand these effects [*&#x2020; 1a*](#1a-注釈)
- `Click`: Make this repository public [*&#x2020; 1a*](#1a-注釈)


### 1a. 注釈
```
- 要はprivateからpublishにするために、
- 「本当にやってもいいんですね？！」
- と力強く念押しをしてくれているのでクリックする回数が~~無駄に~~多くなっている
```

## 公開設定
そのままgithub.comで設定処理

- Settings
- Pages
- Build and deployment
- Branch
- `Select`: from **None** to **master** [*&#x2020; 2a*](#2a-注釈)
- `Change`: from **/(root)** to **DocumentRootにしたいフォルダ** [*&#x2020; 2b*](#2b-注釈)
- `Click`: Save


### 2a. 注釈
```
- 公開するブランチをmaster以外にする場合は適宜変更
- 例えば公開後に大規模な更新が発生し、それをチームで処理する場合
- 一度作業用のブランチを切って、そちらでGitの更新を掛ける分にはオートデプロイ処理は行われない
- フィックスしたらマスターブランチへマージすればよい
```

### 2b. 注釈
```
- リポジトリのトップフォルダを希望するならそのまま
- そこのindex.htmlがDirectoryIndexになる
```

## Vite用のデプロイ設定
通常の方法であればこれで公開処理は完了
GitHubのページをブラウザリロードすればURLが表示されるようになる
distフォルダをルートディレクトリにするための設定変更を行う

- Settings
- Pages
- Build and deployment
- Source
- `Change`: Deploy from a branchからGitHub Actionsに変更する
- `Click`: Static HTMLのConfigure
- `Edit`: jobs.deploy.steps.with.pathを"."から"./dist/"に変更
- `Click`: Commit changes

static.ymlを保存すると、自動的にデプロイ処理が走って完了
distがルートディレクトリになっている
> .github/workflows/static.ymlが新たに作成されるのでフェッチすること

---
---
# 独自ドメインでの公開
- Settings
- Pages
- Custom domain
- `Input`: domain
> https://hoge.fuga.com/でなく、hoge.fuga.comと「ドメイン名」にすること

これで可能と思うが、独自ドメインを持っていないので検証不能
XServerのサブドメインで実験してみたが駄目だった

---
---
# レンタルサーバーでの公開
distフォルダ以下を、そのままFTPでアップロードする
ドメイン名がGitHub Pagesの時からは変わっているので要注意
