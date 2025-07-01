import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import PdfComp from './PdfComp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/annotation" element={<PdfAnnotation />} />
        <Route path="/myapp" element={<PdfComp />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
