# ✨ 掲示板アプリ

このリポジトリは React + TypeScript（Vite）を使ったシンプルな掲示板フロントエンドです。

---

## 目次
- 概要
- 前提条件
- クイックスタート
- 開発コンテナ (Dev Container)
- 実行・ビルド
- バックエンド (ローカル開発用)

---

## 概要
ローカルで軽く動かせるフロントエンド実装です。Vite を使った開発フローで、`npm run dev` で開発サーバーが立ちます。

## 前提条件
- Node.js（推奨: 16+ または package.json の engines に準拠）
- npm
- Git
- （任意）VS Code + Dev Containers 拡張 / Docker - 開発コンテナを使う場合

## クイックスタート（ローカル）
1. リポジトリをクローン

```bash
git clone https://github.com/tsukatsuka2002/Bulletin-Board-App.git
cd Bulletin-Board-App
```

2. 依存をインストール

```bash
npm install
```

3. 開発サーバーを起動

```bash
npm run dev
```

ブラウザで http://localhost:5173 を開いて動作確認してください。

## 開発コンテナ (Dev Container)
このプロジェクトは `.devcontainer/devcontainer.json` を含み、Dev Container 用の設定が入っています。

- コンテナを使う場合: VS Code のコマンドパレットで `Dev Containers: Rebuild Container` を選んでください。
- postCreateCommand により依存インストールと git の user 設定を自動で行います。
- ホストの ssh-agent をコンテナ内で使う設定を追加しています。ホストで以下を実行してからコンテナを再ビルドしてください:

## 実行・ビルド
- 開発サーバー

```bash
npm run dev
```

- 本番用ビルド

```bash
npm run build
```

ブラウザで http://localhost:5173 を開いて確認してください。

## バックエンド (ローカル開発用)

簡易的な Express サーバーを `server/` に追加しました。フロントエンドから API を叩く場合は以下を参考にしてください。

- サーバー起動: `npm run server`（デフォルトでポート 4000）
- 開発中に自動再起動: `npm run dev:server`（nodemon が必要です）

API エンドポイントの例:

- GET  http://localhost:4000/api/posts
- POST http://localhost:4000/api/posts  (JSON body: { "text": "投稿内容" })

データは `server/data.json` に保存されます。簡易的な開発用の実装です。

## バックエンドとフロントエンドの接続 — 重要事項と確認手順

このプロジェクトではフロントエンド（Vite）とローカルの Express バックエンドを分けて動かします。開発中にフロントから `fetch('/api/...')` を使ってバックエンドにアクセスするための重要な項目と、接続確認の手順を以下にまとめます。

### 重要事項
- Vite 開発サーバーと Express サーバーは別プロセス・別ポートで動作します（デフォルト: Vite=5173、Express=4000）。
- 開発中は `vite.config.ts` の proxy 設定により `/api` をバックエンドへ転送しています。`vite.config.ts` を編集した場合は Vite を再起動してください。
- CORS はサーバー側で許可していますが、プロキシ未設定時や本番環境でのドメイン設定に注意してください。
- データは `server/data.json` に同期的に書き込まれます。並列書き込みに弱い実装なので、本番や高負荷では SQLite や他の DB を検討してください。
- バックエンド起動コマンドはプロジェクトルートで `npm run server`（もしくは `npm run dev:server`）です。ポートは環境変数 `PORT` で変更できます。

### よくある問題と原因
- エラー "Unexpected token '<', \"<!doctype \"... is not valid JSON": フロントからの `/api` リクエストが Vite の `index.html` を返している（プロキシが効いていない）場合に発生します。対策: `vite.config.ts` の proxy 設定を確認し、Vite を再起動。
- CORS エラー: サーバーが CORS を許可していない、またはオリジンが制限されている場合に発生します。開発中はサーバーで CORS を有効にしています。
- 404 や 500: サーバーログ（コンソール）を確認してください。`server/data.json` のパーミッションや JSON の整合性も確認。

### 開発時の接続確認手順（最小限）
1. 依存インストール（初回のみ）

```bash
npm install
```

2. バックエンドを起動（別ターミナル）

```bash
npm run server
# または開発時は自動リロード付きで
npm run dev:server
```

3. フロントエンドを起動（別ターミナル）

```bash
npm run dev -- --host
```

4. ヘルスチェック（サーバー応答確認）

```bash
curl -sS http://localhost:4000/api/health
# 正常なら { "status": "ok" } が返る
```

5. 投稿一覧取得（フロント経由の確認: プロキシ有り）

```bash
# Vite 側のプロキシを使う場合（ブラウザと同じ origin を模す）
curl -sS http://localhost:5173/api/posts

# 直接バックエンドに叩く場合
curl -sS http://localhost:4000/api/posts
```

6. ブラウザ確認
- 開発フロントをブラウザで開く: http://localhost:5173
- ブラウザの DevTools → Network タブで `/api/posts` 等のリクエストを選び、Response が JSON で返っているか確認。HTML (`<!doctype`) が返っている場合はプロキシが効いていません。

### トラブル時の追加調査
- サーバーログ: Express を起動したターミナルの出力（エラー/例外）を確認。
- `server/data.json` を直接確認して不正な JSON になっていないか見る。手動編集した場合は構文エラーがないか注意。
- Vite のキャッシュが原因であれば再起動、またはブラウザのハードリロードを試す。

