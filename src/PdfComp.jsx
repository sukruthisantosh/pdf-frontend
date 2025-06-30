import React, { useState } from 'react';
import { highlightPlugin, MessageIcon } from '@react-pdf-viewer/highlight';
import { Button, Position, Tooltip, Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';
import './PdfComp.css';

function PdfComp() {
  const pdfUrl = localStorage.getItem('uploadedPdfUrl');
  const [highlights, setHighlights] = useState([]);

  if (!pdfUrl) {
    return <div>No PDF uploaded.</div>;
  }

  const renderHighlightTarget = (props) => (
    <div
      style={{
        background: '#eee',
        display: 'flex',
        position: 'absolute',
        left: `${props.selectionRegion.left}%`,
        top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
        transform: 'translate(0, 8px)',
        zIndex: 1,
      }}
    >
      <Tooltip
        position={Position.TopCenter}
        target={
          <Button onClick={props.toggle}>
            <MessageIcon />
          </Button>
        }
        content={() => <div style={{ width: '100px' }}>Add a note</div>}
        offset={{ left: 0, top: -8 }}
      />
    </div>
  );

  const highlightPluginInstance = highlightPlugin({
    renderHighlightTarget,
    onSelectionFinished: (selection, content, hideTipAndSelection) => {
      const comment = window.prompt('Add a comment for this highlight:');
      if (comment && comment.trim()) {
        setHighlights([
          ...highlights,
          {
            id: Math.random().toString(36).slice(2, 11),
            pageIndex: selection.startPageIndex,
            comment: comment.trim(),
            content: content.text,
          },
        ]);
      }
      hideTipAndSelection();
    },
  });

  return (
    <div className="pdf-main-container">
      {/* PDF Viewer on the left */}
      <div className="pdf-viewer-panel">
        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
          <Viewer fileUrl={pdfUrl} plugins={[highlightPluginInstance]} />
        </Worker>
      </div>
      {/* Annotations Panel on the right */}
      <div className="annotations-panel">
        <div className="annotations-card">
          <h2 className="annotations-title">Annotations</h2>
          {highlights.length === 0 ? (
            <div className="annotations-placeholder">
              No annotations yet. Select text in the PDF to add notes.
            </div>
          ) : (
            <div>
              {highlights.map((highlight) => (
                <div key={highlight.id} style={{ marginBottom: '1rem', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
                  <strong>Page {highlight.pageIndex + 1}</strong>
                  <p style={{ fontSize: '0.9em', color: '#666', margin: '0.25rem 0' }}>"{highlight.content}"</p>
                  <p>{highlight.comment}</p>
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