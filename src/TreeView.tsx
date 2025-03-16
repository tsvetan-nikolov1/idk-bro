import React, { useState } from 'react';

// Define the Tree Node Type
export type TreeNode = {
    name: string;
    children: TreeNode[];
};

type TreeViewProps = {
    tree: TreeNode[];
    onGroupChange: (groupName: string) => void;
};

const TreeNodeComponent = ({ node, onGroupChange }: { node: TreeNode; onGroupChange: (groupName: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false); // State to track open/closed
    const hasChildren = node.children.length > 0;

    return (
        <div style={{ marginLeft: '20px' }}>
            <div>
                <span onClick={() => { if (hasChildren) setIsOpen(!isOpen) }} style={{ cursor: 'pointer' }}>
                    {hasChildren ? (isOpen ? '[-] ' : '[+] ') : '  '}
                </span>
                <span onClick={() => onGroupChange(node.name)}>{node.name}</span>
            </div>
            {isOpen && hasChildren && (
                <div>
                    {node.children.map((child) => (
                        <TreeNodeComponent key={child.name} node={child} onGroupChange={onGroupChange} />
                    ))}
                </div>
            )}
        </div>
    );
};

const TreeView: React.FC<TreeViewProps> = ({ tree, onGroupChange }) => {
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
            height: `${window.innerHeight - 60}px`, // Adjust height as needed
            overflowY: 'scroll', // Make the filter scrollable if needed
            width: '420px', // Adjust width as needed
        }}>
            {tree.map(node => (
                <TreeNodeComponent key={node.name} node={node} onGroupChange={onGroupChange} />
            ))}
        </div>
    );
};

export default TreeView;