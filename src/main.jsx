import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
import App from './App'
import './index.css'

// PWA auto-update setup
const updateSW = registerSW({
  onNeedRefresh() {
    // Called when a new version is available
    console.log('New version available!')
    // You can show a toast or button here
    const reload = window.confirm("New version available! Reload now?")
    if (reload) {
      updateSW(true) // apply update
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline!')
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-center"
        toastOptions={{
          className: 'toast-custom',
          duration: 2000,
          style: {
            background: '#343541',
            color: '#ececf1',
            border: '1px solid #565869',
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
)
