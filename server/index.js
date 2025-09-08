// シンプルな開発用 Express サーバー
// - データはローカルの JSON ファイルに保存します（server/data.json）
// - 本番運用や高並列アクセスには向きません。SQLite 等の永続 DB を推奨します。
const express = require('express')
const fs = require('fs')
const path = require('path')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 4000
// データファイルの絶対パス
const DATA_FILE = path.resolve(__dirname, 'data.json')

// ミドルウェア
// - CORS を許可（開発時のフロントエンドと別ポートでの通信を想定）
// - JSON ボディをパース
app.use(cors())
app.use(express.json())

// ----- ヘルスチェック -----
// GET /api/health
// 目的: サーバー起動確認用の簡易エンドポイント
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// ----- データ読み書きユーティリティ -----
// readData: data.json を同期的に読み込み、JSON を返す
// - ファイルが存在しない、またはパースに失敗した場合は { posts: [] } を返す
// - 同期 I/O を使っているため負荷の高い環境ではパフォーマンスやブロッキングに注意
function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8')
    return JSON.parse(raw)
  } catch (e) {
    // ファイルがない or JSON パース失敗 -> 空の構造でフォールバック
    return { posts: [] }
  }
}

// writeData: 与えられたオブジェクトを JSON ファイルに同期的に書き込む
// - 競合（同時書き込み）を考慮していないため、複数プロセス/リクエストの並行書き込みがある場合は
//   データ破壊のリスクがあります。開発用の簡易実装として扱ってください。
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8')
}

// ----- 投稿一覧取得 -----
// GET /api/posts
// レスポンス: JSON 配列 of post オブジェクト
// post = { id, text, createdAt }
app.get('/api/posts', (req, res) => {
  const data = readData()
  res.json(data.posts)
})

// ----- 投稿追加 -----
// POST /api/posts
// ボディ: { text: string }
// バリデーション: text が存在し、非空文字列であること
// 成功: 201 Created + 作成した post を返す
app.post('/api/posts', (req, res) => {
  const { text } = req.body
  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'text is required' })
  }

  const data = readData()
  const post = { id: String(Date.now()), text: text.trim(), createdAt: new Date().toISOString() }
  // 新しい投稿を先頭に追加（表示順を想定）
  data.posts.unshift(post)
  writeData(data)
  res.status(201).json(post)
})

// ----- 投稿更新 -----
// PUT /api/posts/:id
// ボディ: { text: string }
// 成功: 更新した post を返す。見つからなければ 404。
app.put('/api/posts/:id', (req, res) => {
  const { id } = req.params
  const { text } = req.body
  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'text is required' })
  }

  const data = readData()
  const idx = data.posts.findIndex(p => p.id === id)
  if (idx === -1) return res.status(404).json({ error: 'not found' })
  data.posts[idx].text = text.trim()
  writeData(data)
  res.json(data.posts[idx])
})

// ----- 投稿削除 -----
// DELETE /api/posts/:id
// 成功: 204 No Content。見つからなければ 404。
app.delete('/api/posts/:id', (req, res) => {
  const { id } = req.params
  const data = readData()
  const before = data.posts.length
  data.posts = data.posts.filter(p => p.id !== id)
  if (data.posts.length === before) return res.status(404).json({ error: 'not found' })
  writeData(data)
  res.status(204).end()
})

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
