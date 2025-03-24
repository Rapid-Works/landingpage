import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Analytics } from '@vercel/analytics/react'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource/inter/100.css'; // Thin
import '@fontsource/inter/200.css'; // Extra Light
import '@fontsource/inter/300.css'; // Light
import '@fontsource/inter/400.css'; // Regular
import '@fontsource/inter/500.css'; // Medium
import '@fontsource/inter/600.css'; // Semi Bold
import '@fontsource/inter/700.css'; // Bold
import '@fontsource/inter/800.css'; // Extra Bold
import '@fontsource/inter/900.css'; // Black

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Analytics />
    </BrowserRouter>
  </React.StrictMode>,
) 