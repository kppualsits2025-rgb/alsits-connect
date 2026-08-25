import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// Register Service Worker untuk PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // SW gagal register — app tetap berjalan normal
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)