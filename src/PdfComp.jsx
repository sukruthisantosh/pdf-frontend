import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

function PdfComp() {
  const [numPages, setNumPages] = useState();
  const pdfUrl = localStorage.getItem('uploadedPdfUrl');

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div
      style={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        background: '#f4f6fa',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
      }}
    >
      {/* PDF Viewer on the left */}
      <div
        style={{
          flex: 1,
          padding: '2rem',
          minWidth: 0,
          background: '#fff',
          height: '100%',
          overflowY: 'auto',
          boxShadow: '2px 0 8px rgba(0,0,0,0.03)',
          borderRight: '1px solid #e5e7eb',
        }}
      >
        <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(
            new Array(numPages),
            (el, index) => (
              <div key={`page_${index + 1}`} style={{ marginBottom: '2rem' }}>
                <Page pageNumber={index + 1} />
                <div style={{ textAlign: 'center', marginTop: '0.5rem', color: '#555' }}>
                  Page {index + 1}
                </div>
              </div>
            ),
          )}
        </Document>
        <p style={{ color: '#888', textAlign: 'center' }}>
          {numPages ? `Total pages: ${numPages}` : 'Loading...'}
        </p>
      </div>
      {/* Annotations Placeholder on the right */}
      <div
        style={{
          flex: 1.5,
          background: '#f4f6fa',
          padding: '2rem',
          height: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 420,
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            padding: '2.5rem 2rem',
            minHeight: '300px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h2 style={{ color: '#222', marginBottom: '1rem', fontWeight: 700, textAlign: 'center' }}>Annotations</h2>
          <div style={{ color: '#888', textAlign: 'center' }}>
            No annotations yet. Select text in the PDF to add notes.
          </div>
        </div>
      </div>
    </div>
  );
}
export default PdfComp;