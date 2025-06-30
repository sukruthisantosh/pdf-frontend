import React, { useState } from 'react';
import { highlightPlugin, MessageIcon } from '@react-pdf-viewer/highlight';
import { Button, Position, Tooltip, Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';
import './PdfComp.css';

function PdfComp() {
  const pdfUrl = localStorage.getItem('uploadedPdfUrl');
  const [notes, setNotes] = useState([]);
  const [noteId, setNoteId] = useState(0);
  const [message, setMessage] = useState('');

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

  const renderHighlightContent = (props) => {
    const addNote = () => {
      // Only add message if it's not empty
      if (message !== '') {
        const note = {
          // Increase the id manually
          id: noteId + 1,
          content: message,
          highlightAreas: props.highlightAreas,
          quote: props.selectedText,
        };
        setNotes(notes.concat([note]));
        setNoteId(noteId + 1);
        setMessage(''); // Clear the message

        // Close the form
        props.cancel();
      }
    };

    return (
      <div
        style={{
          background: '#fff',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '8px',
          position: 'absolute',
          left: `${props.highlightAreas[0].left}%`,
          top: `${props.highlightAreas[0].top + props.highlightAreas[0].height}%`,
          transform: 'translate(0, 8px)',
          zIndex: 2,
          minWidth: '200px',
        }}
      >
        <div style={{ marginBottom: '8px' }}>
          <strong>Selected text:</strong>
          <div style={{ fontSize: '0.9em', color: '#666', marginTop: '4px' }}>
            "{props.selectedText}"
          </div>
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add your note here..."
          style={{
            width: '100%',
            minHeight: '60px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '4px',
            marginBottom: '8px',
            resize: 'vertical',
          }}
        />
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button onClick={props.cancel} style={{ fontSize: '0.8em' }}>
            Cancel
          </Button>
          <Button onClick={addNote} style={{ fontSize: '0.8em', background: '#007bff', color: 'white' }}>
            Add Note
          </Button>
        </div>
      </div>
    );
  };

  const highlightPluginInstance = highlightPlugin({
    renderHighlightTarget,
    renderHighlightContent,
    onSelectionFinished: (selection, content, hideTipAndSelection) => {
      // This will be handled by renderHighlightContent now
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
          <h2 className="annotations-title">Notes</h2>
          {notes.length === 0 ? (
            <div className="annotations-placeholder">
              No notes yet. Select text in the PDF to add notes.
            </div>
          ) : (
            <div>
              {notes.map((note) => (
                <div key={note.id} style={{ marginBottom: '1rem', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '4px' }}>
                  <strong>Note #{note.id}</strong>
                  <p style={{ fontSize: '0.9em', color: '#666', margin: '0.25rem 0', fontStyle: 'italic' }}>
                    "{note.quote}"
                  </p>
                  <p>{note.content}</p>
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