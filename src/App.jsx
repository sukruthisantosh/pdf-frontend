import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import './App.css'


function App() {
  const [uploadStatus, setUploadStatus] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
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

    const formData = new FormData()
    formData.append('file', file)

    try {
      // const res = await fetch('https://pdf-backend-vc88.onrender.com/api/upload/', {
      const res = await fetch('http://localhost:8000/api/upload/', {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        setUploadStatus('Upload successful!')
        const data = await res.json()
        console.log('Backend response:', data)
        // Store the PDF URL in localStorage
        const pdfUrl = data.url.startsWith('http')
          ? data.url
          : `http://localhost:8000${data.url}`
        localStorage.setItem('uploadedPdfUrl', pdfUrl)
        console.log('PDF URL stored:', pdfUrl)
      } else {
        setUploadStatus('Upload failed.')
      }
    } catch (err) {
      setUploadStatus('Upload failed.')
      console.error(err)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  return (
    <>
      {/* Removed logo images */}
      <h1>Smart PDF Annotation</h1>
      <div className="card">
        <div
          {...getRootProps()}
          style={{
            border: '2px dashed #888',
            borderRadius: 8,
            padding: 24,
            textAlign: 'center',
            background: isDragActive ? '#f0f8ff' : '#fafafa',
            cursor: 'pointer',
            marginBottom: 16,
          }}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the PDF file here ...</p>
          ) : (
            <p>
              Drag & drop a PDF file here, or click to select a file<br />
              <span style={{ fontSize: '0.9em', color: '#888' }}>
                (Only PDF files, max 10MB)
              </span>
            </p>
          )}
        </div>
        {selectedFile && (
          <div style={{ marginBottom: 8 }}>
            <strong>Selected file:</strong> {selectedFile.name}
          </div>
        )}
        {uploadStatus && <p>{uploadStatus}</p>}
      </div>
      <button
        style={{
          marginTop: 24,
          padding: '12px 32px',
          fontSize: '1.1em',
          borderRadius: 8,
          border: 'none',
          background: selectedFile && uploadStatus === 'Upload successful!' ? '#646cff' : '#ccc',
          color: '#fff',
          cursor: selectedFile && uploadStatus === 'Upload successful!' ? 'pointer' : 'not-allowed',
          fontWeight: 600,
        }}
        onClick={() => {
          navigate('/myapp')
        }}
        disabled={!(selectedFile && uploadStatus === 'Upload successful!')}
      >
        Continue to Annotation
      </button>
    </>
  )
}

export default App
