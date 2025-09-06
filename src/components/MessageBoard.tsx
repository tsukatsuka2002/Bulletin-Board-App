import React, { useEffect, useState } from 'react'

type Post = {
	id: string
	text: string
	createdAt: string
}

const STORAGE_KEY = 'bbs_posts_v1'

export default function MessageBoard() {
	const [posts, setPosts] = useState<Post[]>(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY)
			return raw ? JSON.parse(raw) : []
		} catch (e) {
			return []
		}
	})
	const [text, setText] = useState('')

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
	}, [posts])

	const add = () => {
		if (!text.trim()) return
		const p: Post = { id: String(Date.now()), text: text.trim(), createdAt: new Date().toISOString() }
		setPosts([p, ...posts])
		setText('')
	}

	const remove = (id: string) => setPosts(posts.filter(p => p.id !== id))

	return (
		<div>
			<div style={{marginBottom:12}}>
				<textarea value={text} onChange={e => setText(e.target.value)} rows={4} style={{width:'100%'}} />
				<div style={{display:'flex', gap:8, marginTop:8}}>
					<button onClick={add}>投稿</button>
					<button onClick={() => setText('')}>クリア</button>
				</div>
			</div>

			<div>
				{posts.length === 0 && <div>投稿がありません</div>}
				{posts.map(p => (
					<div key={p.id} style={{border:'1px solid #ddd', padding:8, marginBottom:8}}>
						<div style={{whiteSpace:'pre-wrap'}}>{p.text}</div>
						<div style={{fontSize:12, color:'#666', marginTop:6}}>{new Date(p.createdAt).toLocaleString()}</div>
						<div style={{marginTop:6}}>
							<button onClick={() => remove(p.id)}>削除</button>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

