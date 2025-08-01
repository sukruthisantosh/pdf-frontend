import React, { useState, useRef, useCallback } from 'react';
import './PdfComp.css';
import "react-pdf-highlighter/dist/style.css";
import { PdfHighlighter, PdfLoader, Highlight } from "react-pdf-highlighter";

let highlightIdCounter = 0;

function PdfComp() {
  const pdfUrl = localStorage.getItem('uploadedPdfUrl') || "https://arxiv.org/pdf/1708.08021.pdf";
  const [highlights, setHighlights] = useState([]);
  const [scrolledToHighlightId, setScrolledToHighlightId] = useState(null);

  // Reference to the scroll function
  const scrollViewerTo = useRef(null);

  // Add unique, stable id to each highlight, preserving all structure
  const addHighlight = (highlight) => {
    const newHighlight = { ...highlight, id: `highlight-${highlightIdCounter++}` };
    console.log('Adding highlight:', newHighlight);
    setHighlights((prev) => [
      newHighlight,
      ...prev,
    ]);
  };

  // Delete highlight by id
  const deleteHighlight = (highlightId) => {
    setHighlights((prev) => prev.filter(highlight => highlight.id !== highlightId));
  };

  // Handle clicking on an annotation to scroll to it
  const handleAnnotationClick = useCallback((highlight) => {
    console.log('Scroll function available:', !!scrollViewerTo.current);
    console.log('Highlight passed to scroll function:', highlight);
    if (scrollViewerTo.current) {
      setScrolledToHighlightId(highlight.id);
      scrollViewerTo.current(highlight);
      setTimeout(() => setScrolledToHighlightId(null), 2000);
    } else {
      // fallback: scroll to page
      if (highlight.position && highlight.position.pageNumber) {
        const pageElement = document.querySelector(`[data-page-number="${highlight.position.pageNumber}"]`);
        if (pageElement) {
          pageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setScrolledToHighlightId(highlight.id);
          setTimeout(() => setScrolledToHighlightId(null), 2000);
        }
      }
    }
  }, []);

  // Reset scrolled highlight when user scrolls manually
  const handleScrollChange = useCallback(() => {
    setScrolledToHighlightId(null);
  }, []);

  return (
    <div className="pdf-main-container">
      <div className="pdf-viewer-panel">
        <div style={{ position: "relative", width: "100%", height: "100vh", minHeight: "400px", minWidth: "300px" }}>
          <PdfLoader url={pdfUrl} beforeLoad={<div>Loading PDF...</div>}>
            {pdfDocument => (
              <PdfHighlighter
                pdfDocument={pdfDocument}
                highlights={highlights}
                onScrollChange={handleScrollChange}
                scrollRef={scrollTo => {
                  console.log('Setting scroll function:', scrollTo);
                  scrollViewerTo.current = scrollTo;
                }}
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
                highlightTransform={(highlight) => (
                  <Highlight
                    key={highlight.id}
                    isScrolledTo={scrolledToHighlightId === highlight.id}
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
              {highlights.map((highlight) => (
                <div
                  key={highlight.id}
                  className={`note-item ${scrolledToHighlightId === highlight.id ? 'note-item--scrolled-to' : ''}`}
                >
                  <div className="note-header">
                    <strong>Page {highlight.position.pageNumber || '?'} </strong>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button
                        className="view-note-btn"
                        onClick={() => handleAnnotationClick(highlight)}
                        title="View in PDF"
                      >
                        View
                      </button>
                      <button
                        className="delete-note-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteHighlight(highlight.id);
                        }}
                        title="Delete note"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <div className="note-content-wrapper">
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