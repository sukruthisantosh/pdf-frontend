import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [uploadStatus, setUploadStatus] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)

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
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
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
    </>
  )
}

export default App
