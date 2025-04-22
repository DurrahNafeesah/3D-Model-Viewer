import React, { useState } from 'react';
import ModelViewer from './components/ModelViewer';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [modelUrl, setModelUrl] = useState('');

  return (
    <div className="App">
      <header className="App-header">
        <h1>3D Model Viewer</h1>
      </header>
      
      <main className="App-main">
        <div className="container">
          <Dashboard setModelUrl={setModelUrl} />
          
          <div className="viewer-container">
            <h2>Model Viewer</h2>
            <ModelViewer modelUrl={modelUrl} />
          </div>
        </div>
      </main>
      
      <footer className="App-footer">
        <p>3D Model Viewer Application - Built with React and Three.js</p>
      </footer>
    </div>
  );
}

export default App; 