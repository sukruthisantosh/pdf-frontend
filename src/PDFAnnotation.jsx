import { useLocation } from 'react-router-dom'
import { Document, Page } from 'react-pdf'
import { useState, useEffect, useRef } from 'react'
import './PDFAnnotation.css'

function PDFAnnotation() {
    const location = useLocation()
    const [pdfUrl, setPdfUrl] = useState(null)
    const [numPages, setNumPages] = useState(null)
    const pollingRef = useRef(null)

    useEffect(() => {
        function checkForPdfUrl() {
            if (location.state?.pdfUrl) {
                setPdfUrl(location.state.pdfUrl)
                if (pollingRef.current) clearInterval(pollingRef.current)
            }
        }
        checkForPdfUrl()
        if (!pdfUrl) {
            pollingRef.current = setInterval(checkForPdfUrl, 500)
        }
        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current)
        }
    }, [location.state, pdfUrl])

    return (
        <div style={{
            display: 'flex',
            height: '80vh',
            gap: '2rem',
            marginTop: '2rem',
            justifyContent: 'center',
            alignItems: 'flex-start'
        }}>
            <div
                style={{
                    flex: 1,
                    border: '2px dashed #888',
                    borderRadius: 8,
                    padding: 40,
                    background: '#fafafa',
                    color: '#888',
                    minWidth: 0,
                    minHeight: 400,
                    textAlign: 'center',
                    overflow: 'auto'
                }}
            >
                {!pdfUrl ? (
                    <span>Loading PDF...</span>
                ) : (
                    <Document
                        file={pdfUrl}
                        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                        loading="Loading PDF..."
                        error={<span style={{ color: 'red' }}>Failed to load PDF.</span>}
                    >
                        {numPages
                            ? Array.from(new Array(numPages), (el, index) => (
                                <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                              ))
                            : <span>Loading pages...</span>
                        }
                    </Document>
                )}
            </div>
            <div
                style={{
                    flex: 1,
                    border: '2px solid #eee',
                    borderRadius: 8,
                    padding: 40,
                    background: '#fff',
                    minWidth: 0,
                    minHeight: 400,
                    textAlign: 'center',
                }}
            >
                <span style={{ color: '#bbb' }}>Annotation tools will go here</span>
            </div>
        </div>
    )
}

export default PDFAnnotation