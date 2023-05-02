import React, { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  EdgeText
} from 'reactflow';

import 'reactflow/dist/style.css';
import { useState } from 'react';

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [textboxValue, setTextboxValue] = useState('');

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  function downloadJsonButton() { 
    
    var downloadJsonString = 'Download not working yet'
    alert(downloadJsonString);
    var jsonDict = {'test': downloadJsonString}
    var dictstring = JSON.stringify(jsonDict)
  }

  function runFlowButton() {
    var runFlowString = 'runFlow not working yet'
    alert(runFlowString);
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <button onClick={runFlowButton}>Run flow</button>
      <div style={{float: 'right'}}>
        <button onClick={downloadJsonButton}>Download Flow as Json</button>
      </div>
      <input type="text" value={textboxValue} onChange={e => setTextboxValue(e.target.value)} />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
        
        
      </ReactFlow>
      
    </div>
  );

  // Usage

}
