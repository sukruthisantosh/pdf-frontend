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
    <div>
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
  );
}
export default PdfComp;