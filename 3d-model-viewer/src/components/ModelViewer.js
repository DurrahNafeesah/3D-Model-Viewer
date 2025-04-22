import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function Loading() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

function Model({ url }) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('Attempting to load model from URL:', url);
  }, [url]);

  if (!url) {
    console.log('No URL provided');
    return <Loading />;
  }

  try {
    const { scene } = useGLTF(url);
    console.log('Model loaded successfully:', scene);
    return (
      <primitive 
        object={scene} 
        scale={[1, 1, 1]} 
        position={[0, 0, 0]}
        onLoad={() => {
          console.log('Model rendered successfully');
          setIsLoading(false);
        }}
      />
    );
  } catch (e) {
    console.error("Error loading model:", e);
    setError(e.message);
    return <Loading />;
  }
}

export default function ModelViewer({ modelUrl }) {
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('ModelViewer received modelUrl:', modelUrl);
    if (modelUrl && modelUrl.trim() !== '') {
      // Ensure the URL is absolute
      const absoluteUrl = modelUrl.startsWith('http') 
        ? modelUrl 
        : `${window.location.origin}${modelUrl}`;
      console.log('Absolute URL:', absoluteUrl);
      setIsValidUrl(true);
    } else {
      setIsValidUrl(false);
    }
  }, [modelUrl]);

  return (
    <div style={{ width: '100%', height: '500px', position: 'relative' }}>
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: '#f0f0f0' }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <Suspense fallback={<Loading />}>
          {isValidUrl ? (
            <Model url={modelUrl} />
          ) : (
            <Loading />
          )}
        </Suspense>
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
        />
      </Canvas>
      {!isValidUrl && (
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          background: 'rgba(255,255,255,0.8)',
          padding: '10px',
          borderRadius: '5px'
        }}>
          Please upload a 3D model to view
        </div>
      )}
      {error && (
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255,0,0,0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px'
        }}>
          Error: {error}
        </div>
      )}
    </div>
  );
}
