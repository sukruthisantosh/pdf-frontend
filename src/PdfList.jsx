import React, { useState, useEffect } from 'react';
import './PdfList.css';

const PdfList = () => {
    const [pdfs, setPdfs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPdfs();
    }, []);

    const fetchPdfs = async () => {
        try {
            setLoading(true);
            // Use your deployed backend URL
            const response = await fetch('https://pdf-backend-vc88.onrender.com/api/list_pdfs/');
            if (!response.ok) {
                throw new Error('Failed to fetch PDFs');
            }
            const data = await response.json();
            setPdfs(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handlePdfClick = (pdfUrl) => {
        window.open(pdfUrl, '_blank');
    };

    if (loading) {
        return (
            <div className="pdf-list-container">
                <div className="loading">Loading PDFs...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="pdf-list-container">
                <div className="error">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="pdf-list-container">
            <div className="pdf-list-header">
                <h1>Previously Uploaded PDFs</h1>
                <p>{pdfs.length} PDF{pdfs.length !== 1 ? 's' : ''} found</p>
            </div>

            {pdfs.length === 0 ? (
                <div className="no-pdfs">
                    <div className="no-pdfs-icon">📄</div>
                    <h3>No PDFs uploaded yet</h3>
                    <p>Upload your first PDF to see it here</p>
                </div>
            ) : (
                <div className="pdf-grid">
                    {pdfs.map((pdf) => (
                        <div key={pdf.id} className="pdf-card" onClick={() => handlePdfClick(pdf.url)}>
                            <div className="pdf-icon">📄</div>
                            <div className="pdf-info">
                                <h3 className="pdf-name">{pdf.original_name}</h3>
                                <p className="pdf-date">Uploaded: {formatDate(pdf.uploaded_at)}</p>
                            </div>
                            <div className="pdf-actions">
                                <button className="view-btn">View</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PdfList; 