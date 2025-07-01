import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import PdfComp from './PdfComp.jsx'
import PdfList from './PdfList.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/myapp" element={<PdfComp />} />
        <Route path="/myapp/list" element={<PdfList />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
