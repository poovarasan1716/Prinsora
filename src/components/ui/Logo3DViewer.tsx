'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

function Model({ url, size }: { url: string; size: number }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.8;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={5} rotationIntensity={0.5} floatIntensity={0.5}>
        <primitive object={scene} scale={size / 20} />
      </Float>
    </group>
  );
}

export default function Logo3DViewer({ size = 42 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 35 }} 
        style={{ width: '100%', height: '100%' }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={1.5} />
        <pointLight position={[5, 5, 5]} intensity={2} color="#D4AF37" />
        
        <Suspense fallback={null}>
          <Model url="/prinsora_logo.glb" size={size} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
