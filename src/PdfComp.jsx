import React, { useState } from 'react';
import './PdfComp.css';
import "react-pdf-highlighter/dist/style.css";
import { PdfHighlighter, PdfLoader, Highlight } from "react-pdf-highlighter";

function PdfComp() {
  const pdfUrl = localStorage.getItem('uploadedPdfUrl') || "https://arxiv.org/pdf/1708.08021.pdf";
  const [highlights, setHighlights] = useState([]);

  // Add unique id to each highlight
  const addHighlight = (highlight) => {
    setHighlights((prev) => [
      { ...highlight, id: String(Math.random()) },
      ...prev,
    ]);
  };

  return (
    <div className="pdf-main-container">
      <div className="pdf-viewer-panel">
        <div style={{ position: "relative", width: "100%", height: "100vh", minHeight: "400px", minWidth: "300px" }}>
          <PdfLoader url={pdfUrl} beforeLoad={<div>Loading PDF...</div>}>
            {pdfDocument => (
              <PdfHighlighter
                pdfDocument={pdfDocument}
                highlights={highlights}
                onSelectionFinished={(position, content, hideTipAndSelection) => {
                  let input = "";
                  return (
                    <div className="custom-annotation-popup">
                      <textarea
                        className="custom-annotation-textarea"
                        placeholder="Your comment"
                        onChange={e => (input = e.target.value)}
                      />
                      <button
                        className="custom-annotation-save-btn"
                        onClick={() => {
                          addHighlight({ content, position, comment: { text: input } });
                          hideTipAndSelection();
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
      <div className="annotations-panel">
        <div className="annotations-card">
          <h2 className="annotations-title">Notes</h2>
          {highlights.length === 0 ? (
            <div className="annotations-placeholder">
              No notes yet. Select text in the PDF to add notes.
            </div>
          ) : (
            <div className="notes-list">
              {highlights.map((highlight, idx) => (
                <div
                  key={highlight.id || idx}
                  className="note-item"
                // onClick removed for now
                >
                  <div className="note-header">
                    <strong>Page {highlight.position.pageNumber || '?'} </strong>
                  </div>
                  <div className="selected-text">
                    {highlight.content && highlight.content.text
                      ? `"${highlight.content.text}"`
                      : <em>No text selected</em>}
                  </div>
                  <div className="note-content">
                    {highlight.comment && highlight.comment.text
                      ? highlight.comment.text
                      : <em>No annotation</em>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PdfComp;