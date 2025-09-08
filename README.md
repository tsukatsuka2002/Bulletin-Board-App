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
