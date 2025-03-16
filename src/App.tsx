import { OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import * as THREE from 'three';
import AnatomyModel from './AnatomyModel';
import AnnotationPanel from './AnotationPanel'; // Import the new AnnotationPanel component
import Loader from './Loader';

type TreeNode = {
    name: string;
    children: TreeNode[];
};

function App() {
    const [tree, setTree] = useState<TreeNode[]>([]);
    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
    const [selectedObject, setSelectedObject] = useState<THREE.Object3D | null>(null);
    const gltf = useGLTF('/anatomy2.glb');
    const [highlightedObject, setHighlightedObject] = useState<THREE.Object3D | null>(null);
    const [highlightedObjectAnnotations, setHighlightedObjectAnnotations] = useState<string | null>(null);

    const extractGroupTree = (object: THREE.Object3D): TreeNode[] => {
        const treeNodes: TreeNode[] = [];
        const seenNames = new Set<string>();
        const stack: { obj: THREE.Object3D; parentNode: TreeNode | null }[] = [{ obj: object, parentNode: null }];
        
        while (stack.length > 0) {
            const { obj, parentNode } = stack.pop()!;

            if (obj instanceof THREE.Object3D && !seenNames.has(obj.name)) {
                seenNames.add(obj.name);
                
                const node: TreeNode = {
                    name: obj.name,
                    children: []
                };

                if (parentNode) {
                    parentNode.children.push(node);
                } else {
                    treeNodes.push(node);
                }

                for (let i = obj.children.length - 1; i >= 0; i--) {
                    stack.push({ obj: obj.children[i], parentNode: node });
                }
            }
        }

        return treeNodes;
    };

    useEffect(() => {
        const groupTree = extractGroupTree(gltf.scene);
        setTree(groupTree);
    }, [gltf]);

    const handleGroupChange = (groupName: string) => {
        setSelectedGroups((prevSelected) => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(groupName)) {
                newSelected.delete(groupName);
            } else {
                newSelected.add(groupName);
            }
            return Array.from(newSelected);
        });

        const object = gltf.scene.getObjectByName(groupName) ?? null;
        setSelectedObject(object);
    };

    const handleHighlightChange = (object: THREE.Object3D | null, annotations: string | null) => {
        setHighlightedObject(object);
        setHighlightedObjectAnnotations(annotations);
    };

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', backgroundColor: 'black' }}>
            <Canvas>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <Suspense fallback={<Loader />}>
                    <AnatomyModel 
                        scene={gltf.scene} 
                        selectedGroups={selectedGroups} 
                        selectedObject={selectedObject}
                        onHighlightChange={handleHighlightChange} // Pass the highlight change handler
                    />
                </Suspense>
                <OrbitControls />
            </Canvas>
            <AnnotationPanel 
                highlightedObject={highlightedObject} 
                highlightedObjectAnnotations={highlightedObjectAnnotations} 
            />
        </div>
    );
}

export default App;