import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

function PdfComp() {
  const [numPages, setNumPages] = useState();
  const pdfUrl = localStorage.getItem('uploadedPdfUrl');
  console.log('PDF URL:', pdfUrl);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
      {/* PDF Viewer on the left */}
      <div style={{ flex: 2, paddingRight: '2rem', minWidth: 0 }}>
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
        <p>
          {numPages ? `Total pages: ${numPages}` : 'Loading...'}
        </p>
      </div>
      {/* Annotations Placeholder on the right */}
      <div style={{
        flex: 1,
        background: '#f7f7f7',
        borderLeft: '1px solid #ddd',
        padding: '2rem',
        minHeight: '100vh',
        boxSizing: 'border-box'
      }}>
        <h2>Annotations</h2>
        <div style={{ color: '#888' }}>
          {/* Placeholder content */}
          No annotations yet. Select text in the PDF to add notes.
        </div>
      </div>
    </div>
  );
}
export default PdfComp;