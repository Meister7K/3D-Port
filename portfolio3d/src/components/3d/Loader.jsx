import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import * as THREE from 'three';

const LoadingBar = ({ progress }) => {
  const progressRef = useRef(0);
  const targetProgress = useRef(progress);
  const barRef = useRef();
  const textRef = useRef();

  // Smooth progress interpolation
  useFrame(() => {
    targetProgress.current = progress;
    progressRef.current = THREE.MathUtils.lerp(
      progressRef.current,
      targetProgress.current,
      0.1
    );

    if (barRef.current) {
      // Update bar position and scale
      barRef.current.position.x = -2 + (progressRef.current * 2);
      barRef.current.scale.x = progressRef.current * 4;
    }

    if (textRef.current) {
      // Update text
      textRef.current.text = `${Math.round(progressRef.current * 100)}%`;
    }
  });

  return (
    <group position={[0, -2, 0]}>
      {/* Background bar */}
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[4, 0.2, 0.1]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      
      {/* Progress bar */}
      <mesh ref={barRef} position={[-2, 0, 0]} scale={[0.001, 0.2, 0.1]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#4CAF50" />
      </mesh>
      
      {/* Percentage text */}
      <Text
        ref={textRef}
        position={[0, 0.5, 0]}
        fontSize={0.3}
        color="#ffffff"
      >
        0%
      </Text>
    </group>
  );
};

const LoadingCube = () => {
  const cubeRef = useRef();

  useFrame((state) => {
    if (cubeRef.current) {
      cubeRef.current.rotation.y += 0.01;
      cubeRef.current.rotation.x += 0.01;
    }
  });

  return (
    <motion.mesh
      ref={cubeRef}
      animate={{
        y: [0, 0.5, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#4CAF50" wireframe />
    </motion.mesh>
  );
};

const LoadingScreen = ({ progress = 0, minLoadingTime = 2000 }) => {
  const startTime = useRef(Date.now());
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    // Ensure we don't progress faster than the minimum loading time
    const elapsed = Date.now() - startTime.current;
    const normalizedProgress = Math.min(progress, elapsed / minLoadingTime);
    setDisplayProgress(normalizedProgress);
  }, [progress, minLoadingTime]);

  return (
    <div className="scene">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        <LoadingCube />
        <LoadingBar progress={displayProgress} />
        
        {/* <OrbitControls enableZoom={false} /> */}
      </Canvas>
    </div>
  );
};

export default LoadingScreen;