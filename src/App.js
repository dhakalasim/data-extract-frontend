import React from 'react';
import './App.css';
import PdfViewer from './components/PdfViewer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Data Extraction with Gemini AI</h1>  {/* Optional: You can add a header if you'd like */}
      </header>
      <main>
        <PdfViewer /> {/* Render the PdfViewer component here */}
      </main>
    </div>
  );
}

export default App;
