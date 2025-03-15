import { Html, useProgress } from '@react-three/drei';

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{ color: 'white' }}>{progress.toFixed(2)}% loaded</div>
    </Html>
  );
}

export default Loader;