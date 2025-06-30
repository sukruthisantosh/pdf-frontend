import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import './PdfComp.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

function PdfComp() {
  const [numPages, setNumPages] = useState();
  const pdfUrl = localStorage.getItem('uploadedPdfUrl');

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className="pdf-main-container">
      {/* PDF Viewer on the left */}
      <div className="pdf-viewer-panel">
        <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(
            new Array(numPages),
            (el, index) => (
              <div key={`page_${index + 1}`} className="pdf-page-wrapper">
                <Page pageNumber={index + 1} width={900} />
                <div className="pdf-page-label"></div>
              </div>
            ),
          )}
        </Document>
        <p className="pdf-total-pages">
          {numPages ? `Total pages: ${numPages}` : 'Loading...'}
        </p>
      </div>
      {/* Annotations Placeholder on the right */}
      <div className="annotations-panel">
        <div className="annotations-card">
          <h2 className="annotations-title">Annotations</h2>
          <div className="annotations-placeholder">
            No annotations yet. Select text in the PDF to add notes.
          </div>
        </div>
      </div>
    </div>
  );
}
export default PdfComp;