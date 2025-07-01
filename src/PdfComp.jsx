import React, { useState } from 'react';
import { createPortal } from 'react-dom';
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

  function HighlightContentPortal({ props, message, setMessage, addNote }) {
    const [portalPos, setPortalPos] = useState(null);
    const PORTAL_WIDTH = 320;
    const PORTAL_HEIGHT = 180;

    React.useEffect(() => {
      if (props.highlightAreas && props.highlightAreas[0]) {
        const { left, top, height } = props.highlightAreas[0];
        const viewer = document.querySelector('.pdf-viewer-panel');
        if (viewer) {
          const rect = viewer.getBoundingClientRect();
          let absLeft = rect.left + (left / 100) * rect.width;
          let absTop = rect.top + ((top + height) / 100) * rect.height;
          if (absLeft + PORTAL_WIDTH > window.innerWidth - 12) {
            absLeft = window.innerWidth - PORTAL_WIDTH - 12;
          }
          if (absTop + PORTAL_HEIGHT > window.innerHeight - 12) {
            absTop = rect.top + (top / 100) * rect.height - PORTAL_HEIGHT - 8;
            if (absTop < 12) absTop = 12;
          }
          setPortalPos({ left: absLeft, top: absTop });
        }
      }
    }, [props.highlightAreas]);

    if (!portalPos) return null;
    return createPortal(
      <div
        className="highlight-content"
        style={{
          left: portalPos.left,
          top: portalPos.top,
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
          className="note-popup-textarea note-textarea"
        />
        <div className="note-popup-actions">
          <Button onClick={props.cancel} className="note-action-btn">
            Cancel
          </Button>
          <Button onClick={addNote} className="note-action-btn add">
            Add Note
          </Button>
        </div>
      </div>,
      document.body
    );
  }

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
    return <HighlightContentPortal props={props} message={message} setMessage={setMessage} addNote={addNote} />;
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
      className="highlight-rect"
      style={{
        left: `${props.area.left}%`,
        top: `${props.area.top}%`,
        height: `${props.area.height}%`,
        width: `${props.area.width}%`,
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

  // Add this function to remove a note by id
  const removeNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

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
                    <button
                      className="remove-note-btn"
                      title="Remove note"
                      onClick={() => removeNote(note.id)}
                      aria-label="Remove note"
                    >
                      ×
                    </button>
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