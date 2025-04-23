// ModelViewer.js
import React, { Suspense, useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

function Loading() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" wireframe />
    </mesh>
  );
}

function Model({ url }) {
  const gltf = useGLTF(url); // Use hook unconditionally
  const { scene } = gltf;

  // Center and scale the model
  useEffect(() => {
    if (!scene) return;

    scene.position.set(0, 0, 0);
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxSize = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxSize;
    scene.scale.setScalar(scale);
  }, [scene]);

  return <primitive object={scene} dispose={null} />;
}

export default function ModelViewer({ modelUrl }) {
  const [fullUrl, setFullUrl] = useState('');

  useEffect(() => {
    if (modelUrl && modelUrl.trim() !== '') {
      const baseUrl = window.location.origin;
      const absoluteUrl = modelUrl.startsWith('http')
        ? modelUrl
        : `${baseUrl}${modelUrl}`;
      setFullUrl(absoluteUrl);
    } else {
      setFullUrl('');
    }
  }, [modelUrl]);

  return (
    <div style={{ width: '100%', height: '500px', position: 'relative' }}>
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }} style={{ background: '#f0f0f0' }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Suspense fallback={<Loading />}>
          {fullUrl ? (
            <>
              <Model url={fullUrl} />
              <Environment preset="studio" />
            </>
          ) : (
            <Loading />
          )}
        </Suspense>
        <OrbitControls autoRotate makeDefault />
      </Canvas>
      {!fullUrl && (
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
    </div>
  );
}
