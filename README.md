# ✨ 掲示板アプリ

このリポジトリは React + TypeScript（Vite）を使ったシンプルな掲示板フロントエンドです。

---

## 目次
- 概要
- 前提条件
- クイックスタート
- 開発コンテナ (Dev Container)
- 実行・ビルド

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



```bash
npm run dev
```

ブラウザで http://localhost:5173 を開いて確認してください。
