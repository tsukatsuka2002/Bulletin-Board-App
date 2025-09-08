import React, { useEffect, useState } from 'react'

// 投稿データの型定義
type Post = {
	id: string
	text: string
	createdAt: string
}

// 投稿の最大文字数
const MAX_LENGTH = 500

// API のベースパス（開発環境では vite dev と異なるポートで動くためサーバー側のポートを想定）
const API_BASE = '/api'

// MessageBoard コンポーネント（API ベースの実装）
// - フロントはローカルの storage ではなくサーバーの /api/posts を使って CRUD を行う
export default function MessageBoard() {
	// 投稿一覧
	const [posts, setPosts] = useState<Post[]>([])
	// テキスト入力、検証エラー
	const [text, setText] = useState('')
	const [error, setError] = useState<string | null>(null)

	// 編集用 state
	const [editingId, setEditingId] = useState<string | null>(null)
	const [editText, setEditText] = useState('')

	// ページネーション
	const [pageSize, setPageSize] = useState<number>(5)
	const [currentPage, setCurrentPage] = useState<number>(1)

	// ローディング / リモートエラー表示
	const [loading, setLoading] = useState(false)
	const [remoteError, setRemoteError] = useState<string | null>(null)

	// 入力検証関数
	const validate = (value: string) => {
		const v = value.trim()
		if (!v) return '投稿内容を入力してください。'
		if (v.length > MAX_LENGTH) return `投稿は ${MAX_LENGTH} 文字以内で入力してください。`
		return null
	}

	// サーバーから投稿一覧を取得
	const fetchPosts = async () => {
		setLoading(true)
		setRemoteError(null)
		try {
			const res = await fetch(`${API_BASE}/posts`)
			if (!res.ok) throw new Error(`fetch posts failed: ${res.status}`)
			const data: Post[] = await res.json()
			setPosts(data)
			// ページ補正
			const totalPages = Math.max(1, Math.ceil(data.length / pageSize))
			if (currentPage > totalPages) setCurrentPage(totalPages)
		} catch (e: any) {
			setRemoteError(e.message || 'リモート取得に失敗しました')
		} finally {
			setLoading(false)
		}
	}

	// 初回マウントで読み込み
	useEffect(() => {
		fetchPosts()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// 総ページ数と表示範囲
	const totalPages = Math.max(1, Math.ceil(posts.length / pageSize))
	const startIndex = (currentPage - 1) * pageSize
	const visiblePosts = posts.slice(startIndex, startIndex + pageSize)

	// 投稿追加（サーバーへ POST）
	const add = async () => {
		const v = text.trim()
		const err = validate(text)
		setError(err)
		if (err) return
		setRemoteError(null)
		try {
			const res = await fetch(`${API_BASE}/posts`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text: v })
			})
			if (!res.ok) throw new Error(`作成に失敗しました: ${res.status}`)
			const post: Post = await res.json()
			setPosts(prev => [post, ...prev])
			setCurrentPage(1)
			setText('')
			setError(null)
		} catch (e: any) {
			setRemoteError(e.message || '作成に失敗しました')
		}
	}

	// 投稿削除（サーバーへ DELETE）
	const remove = async (id: string) => {
		setRemoteError(null)
		try {
			const res = await fetch(`${API_BASE}/posts/${id}`, { method: 'DELETE' })
			if (res.status === 204) {
				setPosts(prev => prev.filter(p => p.id !== id))
			} else {
				const body = await res.json().catch(() => ({}))
				throw new Error(body.error || `削除に失敗しました: ${res.status}`)
			}
		} catch (e: any) {
			setRemoteError(e.message || '削除に失敗しました')
		}
	}

	// 編集開始
	const startEdit = (p: Post) => {
		setEditingId(p.id)
		setEditText(p.text)
		setError(null)
	}

	// 編集キャンセル
	const cancelEdit = () => {
		setEditingId(null)
		setEditText('')
		setError(null)
	}

	// 編集保存（サーバーへ PUT）
	const saveEdit = async () => {
		const v = editText.trim()
		const err = validate(editText)
		setError(err)
		if (err || !editingId) return
		setRemoteError(null)
		try {
			const res = await fetch(`${API_BASE}/posts/${editingId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text: v })
			})
			if (!res.ok) {
				const body = await res.json().catch(() => ({}))
				throw new Error(body.error || `更新に失敗しました: ${res.status}`)
			}
			const updated: Post = await res.json()
			setPosts(prev => prev.map(item => item.id === editingId ? updated : item))
			setEditingId(null)
			setEditText('')
			setError(null)
		} catch (e: any) {
			setRemoteError(e.message || '更新に失敗しました')
		}
	}

	return (
		<div>
			{/* 入力フォーム領域 */}
			<div style={{ marginBottom: 12 }}>
				<textarea
					value={text}
					onChange={e => {
						const next = e.target.value
						setText(next)
						setError(validate(next))
					}}
					rows={4}
					style={{ width: '100%' }}
					maxLength={MAX_LENGTH}
					aria-label="投稿内容"
				/>

				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
					<div style={{ display: 'flex', gap: 8 }}>
						<button onClick={add} disabled={!!validate(text)}>投稿</button>
						<button onClick={() => { setText(''); setError(null) }}>クリア</button>
					</div>
					<div style={{ fontSize: 12, color: text.length > MAX_LENGTH ? 'red' : '#666' }}>
						{text.length} / {MAX_LENGTH}
					</div>
				</div>

				{error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
				{remoteError && <div style={{ color: 'red', marginTop: 8 }}>{remoteError}</div>}
			</div>

			{/* 投稿一覧 */}
			<div>
				{loading && <div>読み込み中...</div>}
				{!loading && posts.length === 0 && <div>投稿がありません</div>}

				{visiblePosts.map(p => (
					<div key={p.id} style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
						{editingId === p.id ? (
							<div>
								<textarea value={editText} onChange={e => { setEditText(e.target.value); setError(validate(e.target.value)) }} rows={4} style={{ width: '100%' }} maxLength={MAX_LENGTH} />
								<div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
									<button onClick={saveEdit} disabled={!!validate(editText)}>保存</button>
									<button onClick={cancelEdit}>キャンセル</button>
								</div>
								{error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
							</div>
						) : (
							<>
								<div style={{ whiteSpace: 'pre-wrap' }}>{p.text}</div>
								<div style={{ fontSize: 12, color: '#666', marginTop: 6 }}>{new Date(p.createdAt).toLocaleString()}</div>
								<div style={{ marginTop: 6, display: 'flex', gap: 8 }}>
									<button onClick={() => startEdit(p)}>編集</button>
									<button onClick={() => remove(p.id)}>削除</button>
								</div>
							</>
						)}
					</div>
				))}

				{/* ページネーション表示 */}
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
					<div>
						ページ {currentPage} / {totalPages}
					</div>
					<div style={{ display: 'flex', gap: 8 }}>
						<button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>最初</button>
						<button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>前へ</button>
						<button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>次へ</button>
						<button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>最後</button>
					</div>
				</div>

				{/* ページサイズ切替 */}
				<div style={{ marginTop: 8 }}>
					表示件数:
					<select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1) }} style={{ marginLeft: 8 }}>
						<option value={3}>3</option>
						<option value={5}>5</option>
						<option value={10}>10</option>
					</select>
				</div>
			</div>
		</div>
	)
}

