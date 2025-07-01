import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyPdfs.css';

function MyPdfs() {
    const [pdfs, setPdfs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadPdfs();
    }, []);

    const loadPdfs = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/pdfs/');
            if (response.ok) {
                const data = await response.json();
                setPdfs(data.pdfs);
            } else {
                setError('Failed to load PDFs');
            }
        } catch (error) {
            console.error('Error loading PDFs:', error);
            setError('Error loading PDFs');
        } finally {
            setLoading(false);
        }
    };

    const openPdf = (pdf) => {
        // Store PDF info in localStorage
        localStorage.setItem('uploadedPdfUrl', pdf.url);
        localStorage.setItem('currentPdfId', pdf.id.toString());
        // Navigate to annotation page
        navigate('/myapp');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) {
        return <div className="loading">Loading your PDFs...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="my-pdfs-container">
            <div className="my-pdfs-header">
                <h1>My PDFs</h1>
                <button
                    className="upload-new-btn"
                    onClick={() => navigate('/')}
                >
                    Upload New PDF
                </button>
            </div>

            {pdfs.length === 0 ? (
                <div className="no-pdfs">
                    <p>No PDFs uploaded yet.</p>
                    <button
                        className="upload-first-btn"
                        onClick={() => navigate('/')}
                    >
                        Upload Your First PDF
                    </button>
                </div>
            ) : (
                <div className="pdfs-grid">
                    {pdfs.map((pdf) => (
                        <div key={pdf.id} className="pdf-card" onClick={() => openPdf(pdf)}>
                            <div className="pdf-icon">📄</div>
                            <div className="pdf-info">
                                <h3 className="pdf-name">{pdf.name}</h3>
                                <p className="pdf-date">Uploaded: {formatDate(pdf.uploaded_at)}</p>
                                <p className="pdf-annotations">
                                    {pdf.annotation_count} annotation{pdf.annotation_count !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <div className="pdf-arrow">→</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyPdfs; 