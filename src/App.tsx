import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import AnatomyModel from './AnatomyModel';
import Loader from './Loader';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: 'black' }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Suspense fallback={<Loader />}>
          <AnatomyModel />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default App;