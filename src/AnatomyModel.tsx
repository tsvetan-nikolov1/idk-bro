import { Html, useGLTF } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import { useState } from 'react';
import * as THREE from 'three';
import { annotations } from './annotations';

function AnatomyModel() {
  const { scene } = useGLTF('/anatomy2.glb');
  const [selectedMesh, setSelectedMesh] = useState<THREE.Object3D | null>(null);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    const clickedObject = event.object;
    if (clickedObject instanceof THREE.Mesh) {
      event.stopPropagation();
      console.log('Clicked on:', clickedObject);
      setSelectedMesh(clickedObject);
      
      const name = clickedObject.name.replace(/_/g, ' ').replace(/[0-9]/g, '').trim();
      console.log('Name:', name);
      console.log('Annotations:', annotations);
      const annotation = annotations[name] || annotations[`(${name})`];
      console.log('Annotation:', annotation);
    }
  };

  const handleReset = () => {
    setSelectedMesh(null);
  };

  return (
    <>
      {selectedMesh ? (
        <>
          <primitive object={selectedMesh} />
          <Html position={[0, 0, 0]}>
            <button onClick={handleReset} style={{ position: 'absolute', top: 10, left: 10 }}>
              Reset View
            </button>
          </Html>
        </>
      ) : (
        <primitive object={scene} onClick={handleClick} />
      )}
    </>
  );
}

export default AnatomyModel;