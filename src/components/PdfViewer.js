import React, { useState, useEffect, useCallback } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { useDropzone } from "react-dropzone";

const PdfViewer = () => {
    const [jsonData, setJsonData] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://127.0.0.1:5000/get-extracted-data")
            .then((response) => response.json())
            .then((data) => {
                setJsonData(data);
                if (data.pdf_url) {
                    setPdfUrl(data.pdf_url);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setError(error.message);
                setLoading(false);
            });
    }, []);

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            const fileUrl = URL.createObjectURL(file);
            setPdfUrl(fileUrl);
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: "application/pdf",
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div style={styles.container}>
            {/* Upload Section - Full Width */}
            {/* <div style={styles.uploadContainerFullWidth}>
                <h2 style={styles.header}>📂 Upload PDF</h2>
                <div {...getRootProps()} style={styles.dropzone}>
                    <input {...getInputProps()} />
                    <p>Drag & drop a PDF file here, or click to select one</p>
                </div>
            </div> */}

            {/* PDF Viewer and Extracted Data Section - Below Upload */}
            <div style={styles.viewerDataContainer}>
                {/* PDF Viewer Section */}
                <div style={styles.pdfContainer}>
                    <h2 style={styles.header}>📄 PDF Preview</h2>
                    <div style={styles.pdfWrapper}>
                        {pdfUrl ? (
                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.10.111/build/pdf.worker.min.js">
                                <Viewer fileUrl={pdfUrl} />
                            </Worker>
                        ) : (
                            <p>No PDF available</p>
                        )}
                    </div>
                </div>

                {/* Extracted Data Section */}
                <div style={styles.dataContainer}>
                    <h2 style={styles.header}>📋 Extracted PDF Data</h2>
                    <div style={styles.dataCard}>
                        {jsonData ? (
                            <pre style={styles.jsonData}>{JSON.stringify(jsonData, null, 2)}</pre>
                        ) : (
                            <p>No data available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Styles
const styles = {
    container: {
        display: "flex",
        flexDirection: "column", // Changed to column to stack elements vertically
        justifyContent: "center",
        alignItems: "stretch", // Stretch elements to fill the width
        gap: "20px",
        padding: "20px",
        backgroundColor: "#f4f4f4",
        height: "100vh",
    },
    uploadContainerFullWidth: {
        width: "100%", // Full width for the upload section
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    },
    dropzone: {
        border: "2px dashed #007bff",
        padding: "20px",
        textAlign: "center",
        borderRadius: "8px",
        cursor: "pointer",
        backgroundColor: "#f8f9fa",
    },
    viewerDataContainer: {
        display: "flex",
        flexDirection: "row", // Side-by-side layout for PDF viewer and extracted data
        gap: "20px",
        flex: "1",
    },
    pdfContainer: {
        flex: "1", // Take up equal space as the data container
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    },
    pdfWrapper: {
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "10px",
        maxHeight: "500px",
        overflow: "auto",
    },
    dataContainer: {
        flex: "1", // Take up equal space as the PDF container
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    },
    dataCard: {
        padding: "10px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        maxHeight: "500px",
        overflow: "auto",
    },
    jsonData: {
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#333",
    },
    header: {
        marginBottom: "10px",
        color: "#333",
        fontSize: "18px",
        fontWeight: "bold",
    },
};

export default PdfViewer;