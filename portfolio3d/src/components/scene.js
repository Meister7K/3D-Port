'use client'
import { Canvas, useLoader } from '@react-three/fiber'
import { Environment, OrbitControls, Text3D } from '@react-three/drei';
import { useRef, useState } from 'react';
import font from '../../public/fonts/helvetiker_regular.typeface.json'
import { Button3D } from './3d/Buttons'

const WelcomeText = () => {
    return (
        <Text3D 
            font={font}  
            size={1} 
            height={0.2} 
            bevelEnabled={true} 
            bevelSize={0.05} 
            anchorX="center"
            anchorY="middle"
            position={[-3.5, 0, 0]}
        >
            Hello world!
            <meshNormalMaterial />
        </Text3D>
    );
};

const Scene = () => {
    const [active, setActive] = useState(false)

    return (
        <div className='scene'>
            <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                
                <WelcomeText onClick={() => setActive(!active)}/>
                
                {/* Updated Button with camera position control */}
                <Button3D 
                    position={[0, 5, -1]} 
                    label="Change View"
                    cameraPosition={[0, 4, 15]} // New camera position when clicked
                    onClick={() => {
                        console.log('Camera view changing');
                    }}
                />

                <OrbitControls />
                <Environment preset="sunset" background />
            </Canvas>
        </div>
    );
};

export default Scene;