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
npm run devで開発モードの起動、終了はCtrl+Cを2回入力

URLは`http://localhost:5173`辺りになるがポート番号は変わる恐れあり
vscodeのターミナルに表示されるURLを、Ctrl+左クリックしてブラウザで開く

制作中は、GA/GTAGの設定は後回し
まだ公開していない状態で開発モードをガンガン回していると、無駄にアナリティクス情報が送信されてしまうので

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

---
---
# 書き出し
開発モード(npm run dev)を終了(Ctrl+Cを2回入力)
GA/GTAG関連の設定入力は、この時点で行う

## localhost
Apacheが効いているフォルダで、localhostによる書き出しチェックを行う
npm run buildで書き出し

http://localhost/【distへの相対パス】/dist/

## レンタルサーバー
npm run build:xserverで書き出し
そしてpublicフォルダも同梱するため、npm run copyを実行
> npm run copyは、publicフォルダをdist/publicフォルダとしてコピーする命令
> ビルドをするとdistフォルダがクリーンアップされる上にdistフォルダをドキュメントルートとした場合はpublicフォルダにアクセスできなくなるので都度コピーする必要がある

distフォルダの中身を、FTPソフトでアップロードして動作確認

## GitHub Pages
npm run build:githubpagesで書き出し
そしてpublicフォルダも同梱するため、npm run copyを実行
> npm run copyは以下略
> この処理はGitHub Pagesの方で特に重大な問題となり用意した

URLは`https://【GitHubアカウント名】.github.io/【リポジトリ名】/`になるとして話を進める

### GitHub Pagesでの公開
GitHubで管理していたものを、そのまま公開する方法

- 自前でサーバー契約をする必要がない
- masterブランチにプッシュするだけで自動的に更新内容が変更される

しかし今回はリポジトリのルートディレクトリでなく、その下のdistディレクトリをドキュメントルートとして公開するため少し手順に一手間かかる
Vite・Pugなどを使わず、直接HTMLを書いていて、リポジトリのルートディレクトリとサーバーとしてのドキュメントルートが同じである場合はすごく簡単に公開できる

#### パブリックに変更
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


##### 1a. 注釈
```
- 要はprivateからpublishにするために、
- 「本当にやってもいいんですね？！」
- と力強く念押しをしてくれているのでクリックする回数が~~無駄に~~多くなっている
```


### Vite用にdistフォルダ公開
distフォルダをルートディレクトリにするための設定をして、オートデプロイできるようにする

- Settings
- Pages
- Build and deployment
- Source
- `Change`: Deploy from a branchからGitHub Actionsに変更する
- `Click`: Static HTMLのConfigure
- `Edit`: jobs.deploy.steps.with.pathを"."から"./dist/"に変更
- `Click`: Commit changes

static.ymlを保存すると、自動的にデプロイ処理が走って完了
distがルートディレクトリになっているのを確認
> .github/workflows/static.ymlが新たに作成されるのでフェッチすること

### 生のHTMLをそのまま公開
リポジトリーのルートディレクトリを、そのままドキュメントルートとして利用する方法をついでに補足説明
この設定を終えれば、同じくオートデプロイできるようになる

- Settings
- Pages
- Build and deployment
- Branch
- `Select`: from **None** to **master** [*&#x2020; 2a*](#2a-注釈)
- `Change`: from **/(root)** to **DocumentRootにしたいフォルダ** [*&#x2020; 2b*](#2b-注釈)
- `Click`: Save


##### 2a. 注釈
```
- 公開するブランチをmaster以外にする場合は適宜変更
- 例えば公開後に大規模な更新が発生し、それをチームで処理する場合
- 一度作業用のブランチを切って、そちらでGitの更新を掛ける分にはオートデプロイ処理は行われない
- フィックスしたらマスターブランチへマージすればよい
```

##### 2b. 注釈
```
- リポジトリのトップフォルダを希望するならそのまま
- そこのindex.htmlがDirectoryIndexになる
```

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
