import React, { useState } from 'react';

function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setResult(null); //return with new img
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
      }); //catch backend

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

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h1>Auto Background Remover</h1>

      <input type="file" accept="image/*" onChange={handleImageChange} />
      <br /><br />

      <button onClick={handleUpload} disabled={!image || loading}>
        {loading ? 'Processing...' : 'Remove Background'}
      </button>

      {result && (
        <div style={{ marginTop: '20px' }}>
          <h2>Result</h2>
          <img
            src={result}
            alt="Background Removed"
            style={{ maxWidth: '100%', height: 'auto', border: '1px solid #ccc' }}
          />
          <br /><br />
          <button onClick={handleDownload}>Download Image (PNG)</button>
        </div>
      )}
    </div>
  );
}

export default App;
