import React, { useState, useCallback, useEffect } from 'react';
import './PdfComp.css';
import "react-pdf-highlighter/dist/style.css";
import { PdfHighlighter, PdfLoader, Highlight } from "react-pdf-highlighter";

function PdfComp() {
  const pdfUrl = localStorage.getItem('uploadedPdfUrl') || "https://arxiv.org/pdf/1708.08021.pdf";
  const [highlights, setHighlights] = useState([]);
  const [scrolledToHighlightId, setScrolledToHighlightId] = useState(null);
  // Use state for scroll function
  const [scrollToFunc, setScrollToFunc] = useState(null);

  // Parse highlight ID from URL hash
  const parseIdFromHash = () => {
    const hash = document.location.hash;
    if (hash.startsWith('#highlight-')) {
      return hash.slice('#highlight-'.length);
    }
    return null;
  };

  // Update URL hash when a highlight is clicked
  const updateHash = (highlight) => {
    document.location.hash = `highlight-${highlight.id}`;
  };

  // Reset hash when user scrolls manually
  const resetHash = () => {
    document.location.hash = '';
  };

  // Get highlight by ID
  const getHighlightById = (id) => {
    return highlights.find((highlight) => highlight.id === id);
  };

  // Enhanced scroll to highlight with retry and fallback
  const enhancedScrollToHighlight = useCallback((highlight) => {
    let attempts = 0;
    const maxAttempts = 10; // 10 x 200ms = 2s
    function tryScroll() {
      if (scrollToFunc) {
        setScrolledToHighlightId(highlight.id);
        scrollToFunc(highlight);
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(tryScroll, 200);
      } else {
        // Fallback: manual scroll to page
        if (highlight.position && highlight.position.pageNumber) {
          const pageElement = document.querySelector(`[data-page-number="${highlight.position.pageNumber}"]`);
          if (pageElement) {
            pageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setScrolledToHighlightId(highlight.id);
          }
        }
      }
    }
    tryScroll();
  }, [scrollToFunc]);

  // Scroll to highlight from hash
  const scrollToHighlightFromHash = useCallback(() => {
    const highlightId = parseIdFromHash();
    const highlight = getHighlightById(highlightId);
    console.log('Trying to scroll to:', highlightId, highlight, 'Scroll function available:', !!scrollToFunc);
    if (highlightId && highlight) {
      enhancedScrollToHighlight(highlight);
    }
  }, [highlights, scrollToFunc, enhancedScrollToHighlight]);

  // Listen for hash changes
  useEffect(() => {
    const handler = () => {
      scrollToHighlightFromHash();
    };
    window.addEventListener('hashchange', handler, false);
    return () => {
      window.removeEventListener('hashchange', handler, false);
    };
  }, [scrollToHighlightFromHash]);

  // When highlights or scroll function change, try to scroll to hash
  useEffect(() => {
    scrollToHighlightFromHash();
  }, [highlights, scrollToFunc, scrollToHighlightFromHash]);

  // Add unique id to each highlight
  const addHighlight = (highlight) => {
    const newHighlight = {
      ...highlight,
      id: String(Math.random()).slice(2)
    };
    console.log('Adding highlight:', newHighlight);
    setHighlights((prev) => [
      newHighlight,
      ...prev,
    ]);
  };

  // Handle clicking on an annotation to scroll to it
  const handleAnnotationClick = useCallback((highlight) => {
    updateHash(highlight);
    setTimeout(() => {
      enhancedScrollToHighlight(highlight);
    }, 0);
  }, [enhancedScrollToHighlight]);

  // Reset scrolled highlight when user scrolls manually
  const handleScrollChange = useCallback(() => {
    setScrolledToHighlightId(null);
    resetHash();
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
                scrollRef={setScrollToFunc}
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
                highlightTransform={(highlight, index) => (
                  <Highlight
                    key={index}
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
              {highlights.map((highlight, idx) => (
                <div
                  key={highlight.id || idx}
                  className={`note-item ${scrolledToHighlightId === highlight.id ? 'note-item--scrolled-to' : ''}`}
                  onClick={() => handleAnnotationClick(highlight)}
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