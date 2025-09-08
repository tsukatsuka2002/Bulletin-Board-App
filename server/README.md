ローカルで動くシンプルな Express サーバーです。

- 起動: `npm run server` （プロジェクトルート）
- 開発: `npm run dev:server` （変更を監視して自動再起動）
- API:
  - GET  /api/health
  - GET  /api/posts
  - POST /api/posts   { text }
  - PUT  /api/posts/:id  { text }
  - DELETE /api/posts/:id

注意: データは `server/data.json` に保存されます。単純な開発用ストレージとして使ってください。
