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

import CustomNode from './llm_node';

const nodeTypes = {
  custom: CustomNode,
};

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [textboxValue, setTextboxValue] = useState('');

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  function downloadJsonButton(nodes, edges, nodeInfo = "this might not be necessary if we can just store attributes in node class") { 
    
    var downloadJsonString = 'Download not working yet'
    alert(downloadJsonString);
    var jsonDict = {'test': downloadJsonString}
    var dictstring = JSON.stringify(jsonDict)
  }

  function runFlowButton(nodes, edges) {
    var runFlowString = 'runFlow not working yet'
    alert(runFlowString);
    initialEdges[0]['']

  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <input type="text" value={textboxValue} onChange={e => setTextboxValue(e.target.value)} />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        
      >
      <div style={{float: 'right'}}>
        <button onClick={() => downloadJsonButton(nodes, edges)}>Download Flow as Json</button>
      </div>
      <button onClick={() => runFlowButton(nodes, edges)}>Run flow</button>
        <Controls />
        <Background variant="dots" gap={12} size={1} />
        
        
      </ReactFlow>
      
    </div>
  );

  // Usage

}
