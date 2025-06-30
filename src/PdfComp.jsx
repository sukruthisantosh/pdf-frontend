import React, { useState } from 'react';
import { highlightPlugin, MessageIcon } from '@react-pdf-viewer/highlight';
import { Button, Position, Tooltip, Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';
import './PdfComp.css';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';

function PdfComp() {
  const pdfUrl = localStorage.getItem('uploadedPdfUrl');
  const [notes, setNotes] = useState([]);
  const [noteId, setNoteId] = useState(0);
  const [message, setMessage] = useState('');

  // Page navigation plugin
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const { jumpToPage, CurrentPageLabel, NumberOfPages } = pageNavigationPluginInstance;

  if (!pdfUrl) {
    return <div>No PDF uploaded.</div>;
  }

  const renderHighlightTarget = (props) => (
    <div
      className="highlight-target"
      style={{
        left: `${props.selectionRegion.left}%`,
        top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
      }}
    >
      <Tooltip
        position={Position.TopCenter}
        target={
          <Button onClick={props.toggle}>
            <MessageIcon />
          </Button>
        }
        content={() => <div className="add-note-tooltip">Add a note</div>}
        offset={{ left: 0, top: -8 }}
      />
    </div>
  );

  const renderHighlightContent = (props) => {
    const addNote = () => {
      if (message !== '') {
        const pageIndex = props.highlightAreas[0]?.pageIndex ?? 0;
        const note = {
          id: noteId + 1,
          content: message,
          highlightAreas: props.highlightAreas,
          quote: props.selectedText,
          pageIndex, // Use correct pageIndex
          timestamp: new Date().toISOString(),
        };
        setNotes(notes.concat([note]));
        setNoteId(noteId + 1);
        setMessage('');
        props.cancel();
      }
    };

    return (
      <div
        className="highlight-content"
        style={{
          left: `${props.highlightAreas[0].left}%`,
          top: `${props.highlightAreas[0].top + props.highlightAreas[0].height}%`,
        }}
      >
        <div className="selected-text-label">
          <strong>Selected text:</strong>
          <div className="selected-text-value">
            "{props.selectedText}"
          </div>
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add your note here..."
          className="note-textarea"
        />
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button onClick={props.cancel} className="note-action-btn">
            Cancel
          </Button>
          <Button onClick={addNote} className="note-action-btn add">
            Add Note
          </Button>
        </div>
      </div>
    );
  };

  // Function to navigate to a specific annotation (jump to page)
  const navigateToAnnotation = (note) => {
    if (jumpToPage) {
      jumpToPage(note.pageIndex);
    }
  };

  // Function to get all highlight areas for a given page
  const getHighlightAreas = (pageIndex) => {
    return notes
      .filter((note) => note.pageIndex === pageIndex)
      .flatMap((note) => note.highlightAreas.map(area => ({ ...area, noteId: note.id })));
  };

  // Render persistent highlights with a unique data-note-id
  const renderHighlight = (props) => (
    <div
      data-note-id={props.area.noteId}
      style={{
        background: 'rgba(255, 230, 0, 0.4)',
        borderRadius: '2px',
        position: 'absolute',
        left: `${props.area.left}%`,
        top: `${props.area.top}%`,
        height: `${props.area.height}%`,
        width: `${props.area.width}%`,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );

  const highlightPluginInstance = highlightPlugin({
    renderHighlightTarget,
    renderHighlightContent,
    onSelectionFinished: (selection, content, hideTipAndSelection) => {
      hideTipAndSelection();
    },
    getHighlightAreas,
    renderHighlight,
  });

  // Add a renderPage function to show page number at the end of each page
  const renderPage = (props) => (
    <div className="pdf-page-wrapper">
      {props.canvasLayer.children}
      {props.annotationLayer.children}
      {props.textLayer.children}
      <div className="pdf-page-label">Page {props.pageIndex + 1}</div>
    </div>
  );

  return (
    <div className="pdf-main-container">
      {/* PDF Viewer on the left */}
      <div className="pdf-viewer-panel">
        {/* Show current page/total pages */}
        <div className="pdf-page-current-label">
          Page <CurrentPageLabel /> of <NumberOfPages />
        </div>
        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
          <Viewer
            fileUrl={pdfUrl}
            plugins={[highlightPluginInstance, pageNavigationPluginInstance]}
            renderPage={renderPage}
          />
        </Worker>
      </div>
      {/* Annotations Panel on the right */}
      <div className="annotations-panel">
        <div className="annotations-card">
          <h2 className="annotations-title">Notes</h2>
          {notes.length === 0 ? (
            <div className="annotations-placeholder">
              No notes yet. Select text in the PDF to add notes.
            </div>
          ) : (
            <div className="notes-list">
              {notes.map((note) => (
                <div key={note.id} className="note-item">
                  <div className="note-header">
                    <strong>Note #{note.id}</strong>
                    <span className="page-number">Page {note.pageIndex + 1}</span>
                  </div>
                  <div className="selected-text">
                    "{note.quote}"
                  </div>
                  <div className="note-content">
                    {note.content}
                  </div>
                  <div className="note-actions">
                    <Button
                      onClick={() => navigateToAnnotation(note)}
                      className="view-button"
                    >
                      View
                    </Button>
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