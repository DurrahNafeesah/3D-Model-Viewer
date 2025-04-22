import React, { useState } from 'react';

export default function Dashboard({ setModelUrl }) {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modelId, setModelId] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log('Selected file:', selectedFile);
    setFile(selectedFile);
    setError(null); // Reset error on new file selection
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    // Check if the file is a GLB or GLTF format
    if (!file.name.toLowerCase().endsWith('.glb') && !file.name.toLowerCase().endsWith('.gltf')) {
      setError("Please upload a GLB or GLTF format 3D model");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('model', file);

      console.log('Uploading file:', file.name);
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Upload response:', data);
      
      setModelId(data.id);
      const modelUrl = `/model/${data.id}`;
      console.log('Setting model URL:', modelUrl);
      setModelUrl(modelUrl);
      
    } catch (err) {
      console.error('Upload error:', err);
      setError(`Error uploading model: ${err.message}`);
      setModelUrl('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h2>Upload 3D Model</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="model-upload" style={{ display: 'block', marginBottom: '5px' }}>
            Select a 3D model file (GLB or GLTF format):
          </label>
          <input 
            type="file" 
            id="model-upload" 
            onChange={handleFileChange}
            accept=".glb,.gltf"
            disabled={isLoading}
            style={{ width: '100%' }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading || !file}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading || !file ? 'not-allowed' : 'pointer',
            opacity: isLoading || !file ? 0.7 : 1
          }}
        >
          {isLoading ? 'Uploading...' : 'Upload Model'}
        </button>
        
        {error && (
          <div style={{ 
            color: 'red', 
            marginTop: '10px',
            padding: '10px',
            backgroundColor: '#ffebee',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}
        
        {modelId && !error && !isLoading && (
          <div style={{ 
            color: 'green', 
            marginTop: '10px',
            padding: '10px',
            backgroundColor: '#e8f5e9',
            borderRadius: '4px'
          }}>
            Model uploaded successfully! ID: {modelId}
          </div>
        )}
      </form>
    </div>
  );
} 