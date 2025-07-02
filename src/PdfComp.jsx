import React from 'react';
import './PdfComp.css';
import "react-pdf-highlighter/dist/style.css";
import { PdfHighlighter, PdfLoader } from "react-pdf-highlighter";

function PdfComp() {
  const pdfUrl = localStorage.getItem('uploadedPdfUrl') || "https://arxiv.org/pdf/1708.08021.pdf";

  return (
    <div className="pdf-main-container">
      <div className="pdf-viewer-panel">
        <div style={{ position: "relative", width: "100%", height: "90vh", minHeight: "400px", minWidth: "300px" }}>
          <PdfLoader url={pdfUrl} beforeLoad={<div>Loading PDF...</div>}>
            {pdfDocument => (
              <PdfHighlighter
                pdfDocument={pdfDocument}
                highlights={[]}
                onSelectionFinished={() => null}
                highlightTransform={() => null}
              />
            )}
          </PdfLoader>
        </div>
      </div>
      {/* Annotations Panel on the right (can be left empty for now) */}
      <div className="annotations-panel">
        <div className="annotations-card">
          <h2 className="annotations-title">Notes</h2>
          <div className="annotations-placeholder">
            No notes yet. Select text in the PDF to add notes.
          </div>
        </div>
      </div>
    </div>
  );
}

export default PdfComp;