import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!image) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', image);

    try {
      const res = await fetch('http://localhost:8000/remove-bg', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to process image');
      }

      const blob = await res.blob();
      setResult(URL.createObjectURL(blob));
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result;
    link.download = 'no-background.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div
      style={{
        backgroundColor: darkMode ? '#121212' : '#f5f5f5',
        color: darkMode ? '#f5f5f5' : '#121212',
        minHeight: '100vh',
        padding: '40px 20px',
        fontFamily: 'Arial, sans-serif',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Auto Background Remover</h1>
          <button onClick={toggleTheme} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>

        <div style={{ border: '2px dashed #ccc', padding: '30px', marginTop: '20px', borderRadius: '10px' }}>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <p style={{ margin: '10px 0 0' }}>Upload or drag & drop an image</p>
        </div>

        <br />
        <button
          onClick={handleUpload}
          disabled={!image || loading}
          style={{
            backgroundColor: '#007bff',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {loading ? 'Processing...' : 'Remove Background'}
        </button>

        {result && (
          <div style={{ marginTop: '30px' }}>
            <h2>Result</h2>
            <img
              src={result}
              alt="Background Removed"
              style={{ maxWidth: '100%', height: 'auto', border: '1px solid #ccc', borderRadius: '10px' }}
            />
            <br /><br />
            <button
              onClick={handleDownload}
              style={{
                backgroundColor: '#28a745',
                color: '#fff',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Download Image (PNG)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
