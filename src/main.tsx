import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ReloadPrompt from './ReloadPrompt'
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ReloadPrompt />
    <App />
  </React.StrictMode>
)
