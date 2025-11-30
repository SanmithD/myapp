import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter } from 'react-router-dom'
import { registerSW } from "virtual:pwa-register"
import App from './App'
import './index.css'

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

registerSW();