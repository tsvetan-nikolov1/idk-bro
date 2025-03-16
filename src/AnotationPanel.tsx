// AnnotationPanel.tsx

import * as THREE from 'three';

type AnnotationPanelProps = {
    highlightedObject: THREE.Object3D | null;
    highlightedObjectAnnotations: string | null;
};

const AnnotationPanel = ({ highlightedObject, highlightedObjectAnnotations }: AnnotationPanelProps) => {
    return (
        <div style={{
            position: 'absolute',
            top: 20,
            left: 20,
            backgroundColor: 'white',
            color: 'black',
            border: '1px solid gray',
            borderRadius: '5px',
            padding: '5px',
            zIndex: 1000,
            height: `${window.innerHeight - 60}px`,
            overflowY: 'scroll',
            width: '420px',
        }}>
            {highlightedObject && (
                <div>
                    <h3>{highlightedObject.name?.replace(/_/g, ' ').replace(/[0-9]/g, '').trim() || ''}</h3>
                    <p>{highlightedObjectAnnotations || 'No annotation available.'}</p>
                </div>
            )}
        </div>
    );
};

export default AnnotationPanel;