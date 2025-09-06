import React, { useEffect, useState } from 'react'

// 投稿データの型定義
type Post = {
	id: string
	text: string
	createdAt: string
}

// localStorage に保存するキー（バージョン管理のためにサフィックスを付与）
const STORAGE_KEY = 'bbs_posts_v1'

// 投稿の最大文字数
const MAX_LENGTH = 500

// MessageBoard コンポーネント
// ・投稿の入力・バリデーション
// ・投稿一覧の表示（localStorage に永続化）
export default function MessageBoard() {
	// posts: 投稿一覧。初期化時に localStorage から復元する。
	// JSON.parse が失敗した場合は空配列を返すように try/catch している。
	const [posts, setPosts] = useState<Post[]>(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY)
			return raw ? JSON.parse(raw) : []
		} catch (e) {
			// パースエラー等があっても UI が壊れないように安全にフォールバック
			return []
		}
	})

	// text: テキストエリアの現在の入力値
	const [text, setText] = useState('')
	// error: バリデーションエラーメッセージ（あれば表示する）
	const [error, setError] = useState<string | null>(null)

	// posts が変わるたびに localStorage に保存する（永続化）
	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
	}, [posts])

	// 入力値の検証関数
	// - 空文字は不可
	// - 最大文字数を超えていないか確認
	// 成功時は null、問題がある場合はエラーメッセージを返す
	// 重要な補足:
	// - この関数は画面に直接出力するのではなく、呼び出し元が戻り値（文字列 or null）を受け取って
	//   state に保存したり（例: setError）表示に使ったりします。
	// - したがって validate の `return` 自体はコンソールや UI に直接現れない点に注意してください。
	// - 現在の実装では onChange で setError(validate(...)) を行い、エラー表示は `error` state を通じて行っています。
	// - ボタンの disabled に直接 `validate(text)` を使うと validate を複数回評価することになり得るため、
	//   onChange で error を更新しているなら disabled は `!!error` を使う方が一貫します（必要なら将来的に変更推奨）。
	const validate = (value: string) => {
		const v = value.trim()
		if (!v) return '投稿内容を入力してください。'
		if (v.length > MAX_LENGTH) return `投稿は ${MAX_LENGTH} 文字以内で入力してください。`
		return null
	}

	// 投稿追加処理
	// - validate を使って入力を検証
	// - 成功したら新しい Post を作り、配列の先頭に追加
	// 注意: 現状は setPosts([p, ...posts]) を使っているため、複数更新が同時発生する可能性がある。
	//（競合回避のためには関数型アップデートを使うことを推奨）
	const add = () => {
		const v = text.trim()
		const err = validate(text)
		setError(err)
		if (err) return
		const p: Post = { id: String(Date.now()), text: v, createdAt: new Date().toISOString() }
		setPosts([p, ...posts])
		setText('')
		setError(null)
	}

	// 投稿削除
	const remove = (id: string) => setPosts(posts.filter(p => p.id !== id))

	return (
		<div>
			{/* 入力フォーム領域 */}
			<div style={{marginBottom:12}}>
				{/* テキストエリア: 入力中にバリデーションを実行して error を更新 */}
				<textarea
					value={text}
					onChange={e => {
						const next = e.target.value
						// 入力を保持しつつエラー状態をリアルタイムで評価
						setText(next)
						setError(validate(next))
					}}
					rows={4}
					style={{width:'100%'}}
					maxLength={MAX_LENGTH}
					aria-label="投稿内容"
				/>

				{/* 投稿ボタンと文字数表示 */}
				<div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8}}>
					<div style={{display:'flex', gap:8}}>
						{/* バリデーションに失敗しているときは投稿を無効化 */}
						<button onClick={add} disabled={!!validate(text)}>投稿</button>
						<button onClick={() => { setText(''); setError(null) }}>クリア</button>
					</div>
					<div style={{fontSize:12, color: text.length > MAX_LENGTH ? 'red' : '#666'}}>
						{text.length} / {MAX_LENGTH}
					</div>
				</div>

				{/* エラーメッセージ表示 */}
				{error && <div style={{color:'red', marginTop:8}}>{error}</div>}
			</div>

			{/* 投稿一覧 */}
			<div>
				{posts.length === 0 && <div>投稿がありません</div>}
				{posts.map(p => (
					<div key={p.id} style={{border:'1px solid #ddd', padding:8, marginBottom:8}}>
						{/* 本文は改行を保持して表示 */}
						<div style={{whiteSpace:'pre-wrap'}}>{p.text}</div>
						{/* 作成日時をローカル表記で表示 */}
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

