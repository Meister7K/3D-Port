import React, { useState, useRef, useEffect } from 'react';
import { Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const Button3D = ({ 
  position, 
  label, 
  onClick, 
  width = 2, 
  height = 0.8, 
  depth = 0.2,
  cameraPosition,
  children 
}) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const meshRef = useRef();
  const { camera } = useThree();
  const animationProgress = useRef(0);

  // Animation for hover and click effects
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.y = THREE.MathUtils.lerp(
        meshRef.current.scale.y,
        clicked ? 0.9 : hovered ? 1.1 : 1,
        0.1
      );
      meshRef.current.scale.x = THREE.MathUtils.lerp(
        meshRef.current.scale.x,
        clicked ? 0.95 : hovered ? 1.05 : 1,
        0.1
      );
    }

    // Animate camera position
    if (isAnimating && cameraPosition) {
      animationProgress.current += 0.02; // Control animation speed
      const progress = Math.min(animationProgress.current, 1);
      
      camera.position.lerp(new THREE.Vector3(...cameraPosition), 0.05);
      
      if (progress >= 1) {
        setIsAnimating(false);
        animationProgress.current = 0;
      }
    }
  });

  const handleClick = () => {
    if (cameraPosition) {
      setIsAnimating(true);
      animationProgress.current = 0;
    }
    if (onClick) onClick();
  };

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => {
          setHovered(false);
          setClicked(false);
        }}
        onPointerDown={() => setClicked(true)}
        onPointerUp={() => {
          setClicked(false);
          handleClick();
        }}
      >
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={hovered ? '#2196f3' : clicked ? '#4caf50' : '#1976d2'}
          metalness={0.1}
          roughness={0.2}
        />

        <Text
          position={[0, 0, depth / 2 + 0.01]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </mesh>
      {children}
    </group>
  );
};

export { Button3D };