import React from 'react';
import MessageBoard from './components/MessageBoard';

export default function App() {
	return (
		<div style={{padding:20, fontFamily: 'sans-serif'}}>
			<h1>掲示板アプリ</h1>
			<MessageBoard />
		</div>
	);
}
