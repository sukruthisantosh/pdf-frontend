import React, { useState, useRef } from "react";
import { PdfLoader, PdfHighlighter, Highlight, IHighlight, NewHighlight } from "react-pdf-highlighter";
import "react-pdf-highlighter/dist/style.css";
import "./PdfComp.css";

const url = localStorage.getItem('uploadedPdfUrl') || "https://arxiv.org/pdf/1708.08021.pdf";

let highlightIdCounter = 0;

export default function PdfComp() {
    const [highlights, setHighlights] = useState<IHighlight[]>([]);
    const [scrolledToHighlightId, setScrolledToHighlightId] = useState<string | null>(null);
    const scrollViewerTo = useRef<((highlight: IHighlight) => void) | null>(null);

    const addHighlight = (highlight: NewHighlight) => {
        setHighlights([{ ...highlight, id: `highlight-${highlightIdCounter++}` }, ...highlights]);
    };

    const deleteHighlight = (id: string) => {
        setHighlights(highlights.filter(h => h.id !== id));
    };

    const handleView = (highlight: IHighlight) => {
        if (scrollViewerTo.current) {
            setScrolledToHighlightId(highlight.id);
            scrollViewerTo.current(highlight);
            setTimeout(() => setScrolledToHighlightId(null), 2000);
        }
    };

    return (
        <div className="pdf-main-container">
            <div className="pdf-viewer-panel">
                <PdfLoader url={url} beforeLoad={<div>Loading PDF...</div>}>
                    {pdfDocument => (
                        <PdfHighlighter
                            pdfDocument={pdfDocument}
                            highlights={highlights}
                            scrollRef={scrollTo => {
                                scrollViewerTo.current = scrollTo;
                            }}
                            onScrollChange={() => setScrolledToHighlightId(null)}
                            enableAreaSelection={() => false}
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
                                                addHighlight({ content, position, comment: { text: input, emoji: "" } });
                                                hideTipAndSelection();
                                            }}
                                        >
                                            Save
                                        </button>
                                    </div>
                                );
                            }}
                            highlightTransform={highlight => (
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
            <div className="annotations-panel">
                <div className="annotations-card">
                    <h2 className="annotations-title">Notes</h2>
                    {highlights.length === 0 ? (
                        <div className="annotations-placeholder">
                            No notes yet. Select text in the PDF to add notes.
                        </div>
                    ) : (
                        <div className="notes-list">
                            {highlights.map(highlight => (
                                <div
                                    key={highlight.id}
                                    className={`note-item ${scrolledToHighlightId === highlight.id ? 'note-item--scrolled-to' : ''}`}
                                >
                                    <div className="note-header">
                                        <strong>Page {highlight.position.pageNumber || '?'} </strong>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <button
                                                className="view-note-btn"
                                                onClick={() => handleView(highlight)}
                                                title="View in PDF"
                                            >
                                                View
                                            </button>
                                            <button
                                                className="delete-note-btn"
                                                onClick={() => deleteHighlight(highlight.id)}
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