import React from 'react'
import { Document, Page, pdfjs} from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// Set workerSrc for pdfjs
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

function PdfAnnotation() {
  const pdfUrl = localStorage.getItem('uploadedPdfUrl')
  console.log('PDF URL:', pdfUrl)

  return (
    <div>
      <h2>PDF Annotation Page</h2>
      {!pdfUrl ? (
        <p>No PDF uploaded.</p>
      ) : (
        <div style={{ border: '1px solid #ccc', margin: '16px 0' }}>
          <Document file={pdfUrl}>
            <Page pageNumber={1} />
          </Document>
        </div>
      )}
    </div>
  )
}

export default PdfAnnotation