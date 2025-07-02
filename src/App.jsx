import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import './App.css'
import PdfList from "./PdfList"

function App() {
  const [uploadStatus, setUploadStatus] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const navigate = useNavigate()

  const onDrop = useCallback(async (acceptedFiles, fileRejections) => {
    if (fileRejections.length > 0) {
      setUploadStatus('File type not accepted or file too large.')
      return
    }
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    setSelectedFile(file)
    setUploadStatus('Uploading...')
    setIsUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('https://pdf-backend-vc88.onrender.com/api/upload/', {
      // const res = await fetch('http://localhost:8000/api/upload/', {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        setUploadStatus('Upload successful!')
        const data = await res.json()
        // Store the PDF URL in localStorage
        const pdfUrl = data.url.startsWith('http')
          ? data.url
          // : `https://pdf-backend-vc88.onrender.com${data.url}`
          : `http://localhost:8000${data.url}`
        localStorage.setItem('uploadedPdfUrl', pdfUrl)
      } else {
        setUploadStatus('Upload failed.')
      }
    } catch {
      setUploadStatus('Upload failed.')
    } finally {
      setIsUploading(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const isReadyToContinue = selectedFile && uploadStatus === 'Upload successful!'

  return (
    <div className="app-container">
      <div className="app-content">
        <header className="app-header">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="app-title">Smart PDF Annotation</h1>
          <p className="app-subtitle">Upload your PDF and start annotating</p>
        </header>

        <main className="main-content">
          <div className="upload-card">
            <div className="upload-area">
              <div
                {...getRootProps()}
                className={`dropzone${isDragActive ? ' active' : ''}${isUploading ? ' uploading' : ''}`}
              >
                <input {...getInputProps()} />
                <div className="upload-icon">
                  {isUploading ? (
                    <div className="loading-spinner">
                      <div className="spinner"></div>
                    </div>
                  ) : (
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>

                {isDragActive ? (
                  <h3 className="upload-text">Drop your PDF here</h3>
                ) : (
                  <>
                    <h3 className="upload-text">Upload your PDF</h3>
                    <p className="upload-description">
                      Drag and drop your PDF file here, or click to browse
                    </p>
                  </>
                )}

                <div className="upload-requirements">
                  <span className="requirement">PDF files only</span>
                  <span className="requirement">Max 10MB</span>
                </div>
              </div>
            </div>

            {selectedFile && (
              <div className="file-info">
                <div className="file-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="file-details">
                  <span className="file-name">{selectedFile.name}</span>
                  <span className="file-size">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              </div>
            )}

            {uploadStatus && (
              <div className={`status-message ${uploadStatus.includes('successful') ? 'success' : uploadStatus.includes('failed') ? 'error' : 'info'}`}>
                {uploadStatus.includes('successful') && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                {uploadStatus.includes('failed') && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                <span>{uploadStatus}</span>
              </div>
            )}
          </div>

          <button
            className={`continue-button${isReadyToContinue ? ' enabled' : ' disabled'}`}
            onClick={() => navigate('/myapp')}
            disabled={!isReadyToContinue}
          >
            <span>Continue to Annotation</span>
            {isReadyToContinue && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </main>
      </div>
      <PdfList />
    </div>
  )
}

export default App
