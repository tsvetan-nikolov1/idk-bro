import { ThreeEvent } from '@react-three/fiber';
import { ReactNode, useEffect, useState } from 'react';
import * as THREE from 'three';
import { annotations } from './annotations';

type AnatomyModelProps = {
    scene: THREE.Group;
    selectedGroups: string[];
    selectedObject: THREE.Object3D | null;
    onHighlightChange: (object: THREE.Object3D | null, annotations: string | null) => void; // Added prop type
};

function AnatomyModel({ scene, selectedGroups, selectedObject, onHighlightChange }: AnatomyModelProps) {
    const [wrappedScene, setWrappedScene] = useState<ReactNode | null>(null);
    const [highlightedObject, setHighlightedObject] = useState<THREE.Object3D | null>(null);
    const [highlightedObjectAnnotations, setHighlightedObjectAnnotations] = useState<string | null>(null);
    
    const wrapMeshes = (object: THREE.Object3D): ReactNode => {
        const commonProps = {
            position: object.position,
            rotation: object.rotation,
            scale: object.scale,
            onClick: (event: ThreeEvent<PointerEvent>) => handleClick(event, object),
        };

        // Check if the object is the highlighted object
        const isHighlighted = highlightedObject && highlightedObject.uuid === object.uuid;

        if (object instanceof THREE.Mesh) {
            const highlightMaterial = new THREE.MeshStandardMaterial({
                color: 'yellow', // Set to desired highlight color
                transparent: true,
                opacity: 0.7,
            });

            return (
                <mesh
                    key={object.uuid}
                    {...commonProps}
                    geometry={object.geometry}
                    material={isHighlighted ? highlightMaterial : object.material} // Use highlight material if highlighted
                />
            );
        } else if (object instanceof THREE.Group || object instanceof THREE.Object3D) {
            return (
                <group key={object.uuid} {...commonProps}>
                    {object.children.map((child) => wrapMeshes(child))}
                </group>
            );
        }
        return null;
    };

    useEffect(() => {
        let objectToWrap;
        const topLevelGroups = scene.children[0].children; // TODO: This is hard-coded. Should be dynamic to handle deeper groups.
        objectToWrap = selectedGroups.length ? 
            topLevelGroups.filter(group => selectedGroups.includes(group.name)) : 
            topLevelGroups;

        const wrappedObjects = Array.isArray(objectToWrap) ?
            objectToWrap.map(group => wrapMeshes(group)) :
            wrapMeshes(objectToWrap);

        setWrappedScene(wrappedObjects);
    }, [scene, selectedGroups, highlightedObject]);
    
    const getAnnotationsKey = (object: THREE.Object3D) => object.name.replace(/_/g, ' ').replace(/[0-9]/g, '').trim();
    
    const handleClick = (event: ThreeEvent<PointerEvent>, object: THREE.Object3D) => {
        event.stopPropagation();
        const newHighlightedObject = highlightedObject && highlightedObject.uuid === object.uuid ? null : object;
        setHighlightedObject(newHighlightedObject);
        const key = getAnnotationsKey(object);
        const annotationsText = annotations[key] ?? annotations[`(${key})`] ?? null;

        // Call onHighlightChange function to update the parent component
        onHighlightChange(newHighlightedObject, annotationsText);
    };

    return (
        <>
            {wrappedScene}
            {/* Annotation display is now handled in AnnotationPanel in App component. */}
            {/* No need to show annotations here anymore */}
        </>
    );
}

export default AnatomyModel;