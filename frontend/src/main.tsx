import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 2500,
        style: {
          background: '#1e1e2a',
          color: '#f0f0f8',
          border: '1px solid #2a2a38',
          borderRadius: '12px',
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
          maxWidth: '380px',
        },
        success: {
          iconTheme: {
            primary: '#8b5cf6',
            secondary: '#1e1e2a',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#1e1e2a',
          },
        },
      }}
    />
  </React.StrictMode>,
)
