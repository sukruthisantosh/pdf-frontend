import { useState } from 'react';
import { Document, Page } from 'react-pdf';
// import * as pdfjs from 'pdfjs-dist/webpack';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`


function PdfComp() {
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const pdfUrl = localStorage.getItem('uploadedPdfUrl')
  console.log('PDF URL:', pdfUrl);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div>
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>
      <p>
        Page {pageNumber} of {numPages}
      </p>
    </div>
  );
}
export default PdfComp;