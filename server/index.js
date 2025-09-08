const express = require('express')
const fs = require('fs')
const path = require('path')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 4000
const DATA_FILE = path.resolve(__dirname, 'data.json')

app.use(cors())
app.use(express.json())

// ヘルスチェック
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// データファイル読み書きユーティリティ
function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8')
    return JSON.parse(raw)
  } catch (e) {
    return { posts: [] }
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8')
}

// 投稿一覧取得
app.get('/api/posts', (req, res) => {
  const data = readData()
  res.json(data.posts)
})

// 投稿追加
app.post('/api/posts', (req, res) => {
  const { text } = req.body
  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'text is required' })
  }
  const data = readData()
  const post = { id: String(Date.now()), text: text.trim(), createdAt: new Date().toISOString() }
  data.posts.unshift(post)
  writeData(data)
  res.status(201).json(post)
})

// 投稿更新
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

// 投稿削除
app.delete('/api/posts/:id', (req, res) => {
  const { id } = req.params
  const data = readData()
  const before = data.posts.length
  data.posts = data.posts.filter(p => p.id !== id)
  if (data.posts.length === before) return res.status(404).json({ error: 'not found' })
  writeData(data)
  res.status(204).end()
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
