import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

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

  return (
    <div className="min-h-screen px-4 py-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        {/* Header with toggle */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-center w-full">Auto Background Remover</h1>
          <button
            className="absolute right-6"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>

        {/* File input area */}
        <div className="border-2 border-dashed rounded-lg p-6 text-center dark:border-gray-600">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-2"
          />
          <p className="text-sm">Upload or drag & drop an image</p>
        </div>

        <div className="text-center mt-4">
          <button
            onClick={handleUpload}
            disabled={!image || loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Remove Background'}
          </button>
        </div>

        {result && (
          <div className="mt-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Result</h2>
            <img
              src={result}
              alt="Background Removed"
              className="max-w-full mx-auto border rounded-lg"
            />
            <button
              onClick={handleDownload}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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
