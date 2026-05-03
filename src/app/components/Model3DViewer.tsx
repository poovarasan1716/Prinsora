'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, ContactShadows, useGLTF, Float, PresentationControls, Sparkles, Stars } from '@react-three/drei';
import * as THREE from 'three';

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  
  // Calculate position based on screen width. 
  const isMobile = viewport.width < 6;
  const targetX = isMobile ? 0 : viewport.width * 0.22;

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Gentle continuous rotation
      groupRef.current.rotation.y += delta * 0.15;
      // Smoothly animate to target position
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.05);
    }
  });

  return (
    <group ref={groupRef} position={[targetX, -0.5, 0]}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <primitive object={scene} scale={1.8} />
      </Float>
    </group>
  );
}

function GoldenStars() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      // Moving around the 3d model horizontally, vertically, and circularly
      groupRef.current.rotation.y = time * 0.4; // Circular / Horizontal
      groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.3; // Vertical tilt
      groupRef.current.rotation.z = Math.cos(time * 0.3) * 0.3; // Depth tilt
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.5; // Vertical movement
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer golden dust */}
      <Sparkles count={100} scale={8} size={3} speed={0.8} opacity={0.8} color="#ffdf00" />
      {/* Inner orange/gold spark */}
      <Sparkles count={50} scale={4} size={4} speed={1.2} opacity={0.9} color="#ff8c00" />
    </group>
  );
}

export default function Model3DViewer() {
  return (
    <div className="w-full h-full min-h-[400px] lg:min-h-[600px] relative z-10 flex items-center justify-center cursor-grab active:cursor-grabbing mix-blend-screen">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} className="w-full h-full" dpr={[1, 2]}>
        <ambientLight intensity={0.8} />
        <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={2} castShadow color="#ecc082" />
        <directionalLight position={[-10, -10, -10]} intensity={1} color="#ecc082" />
        
        <Suspense fallback={null}>
          <PresentationControls
            global
            config={{ mass: 2, tension: 500 }}
            snap={{ mass: 4, tension: 1500 }}
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 2, Math.PI / 2]}
          >
            <Model url="/prinsora_logo.glb" />
            
            <GoldenStars />
            
            <Environment preset="city" />
            <ContactShadows position={[0, -2.5]} opacity={0.5} scale={15} blur={2.5} far={10} color="#000000" />
          </PresentationControls>
        </Suspense>
      </Canvas>
    </div>
  );
}
