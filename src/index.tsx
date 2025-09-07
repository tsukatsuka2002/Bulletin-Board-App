import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

// このファイルは React アプリのエントリポイントです。
// 役割:
// - `index.html` のマウント要素（通常は <div id="root">）を取得し、
// - React の root を作成して App コンポーネントを描画します。
//
// 注意点:
// - `index.html` のマウント要素の id がこのファイルと一致している必要があります。
// - グローバルな Provider（Redux, Router, Theme 等）を追加する場合はここで App をラップします。
// - ServiceWorker の登録や初回データフェッチなど、アプリ全体に影響する初期化処理もこのファイルに置くことが多いです。

const container = document.getElementById('root')!
const root = createRoot(container)
root.render(<App />)

