import React, { useState } from 'react';
import './PdfComp.css';
import "react-pdf-highlighter/dist/style.css";
import { PdfHighlighter, PdfLoader, Tip, Highlight } from "react-pdf-highlighter";

function PdfComp() {
  const pdfUrl = localStorage.getItem('uploadedPdfUrl') || "https://arxiv.org/pdf/1708.08021.pdf";
  const [highlights, setHighlights] = useState([]);

  const addHighlight = (highlight) => {
    setHighlights((prev) => [
      { ...highlight, id: String(Math.random()) },
      ...prev,
    ]);
  };

  return (
    <div className="pdf-main-container">
      <div className="pdf-viewer-panel">
        <div style={{ position: "relative", width: "100%", height: "90vh", minHeight: "400px", minWidth: "300px" }}>
          <PdfLoader url={pdfUrl} beforeLoad={<div>Loading PDF...</div>}>
            {pdfDocument => (
              <PdfHighlighter
                pdfDocument={pdfDocument}
                highlights={highlights}
                onSelectionFinished={(position, content, hideTipAndSelection) => {
                  let input = "";
                  return (
                    <div
                      style={{
                        background: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: 4,
                        padding: 12,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        minWidth: 200,
                      }}
                    >
                      <textarea
                        placeholder="Your comment"
                        style={{ width: "100%", minHeight: 60, marginBottom: 8 }}
                        onChange={e => (input = e.target.value)}
                      />
                      <button
                        onClick={() => {
                          addHighlight({ content, position, comment: { text: input } });
                          hideTipAndSelection();
                        }}
                        style={{
                          padding: "6px 16px",
                          borderRadius: 4,
                          border: "none",
                          background: "#4b6cb7",
                          color: "#fff",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Save
                      </button>
                    </div>
                  );
                }}
                highlightTransform={(highlight, index, setTip, hideTip, viewportToScaled, screenshot, isScrolledTo) => (
                  <Highlight
                    key={index}
                    isScrolledTo={isScrolledTo}
                    position={highlight.position}
                    comment={highlight.comment}
                  />
                )}
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