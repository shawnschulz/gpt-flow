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

import { MarkerType, Position } from 'reactflow';

import 'reactflow/dist/style.css';
import { useState } from 'react';
//import CustomNode from './CustomNode'

const exportToJson = (data) => {
  //This just turns dictionary style objects itno a json and then downloads it
  const fileData = JSON.stringify(data);
  const blob = new Blob([fileData], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "nodes_edges_data.json";
  link.click();
};

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1', selects: {'handle-0': 'smoothstep'} } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];



export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [textboxValue, setTextboxValue] = useState('');

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  function downloadJsonButton(data) { 
    
    exportToJson(data)
  }

  function runFlowButton(data) {
    var runFlowString = JSON.stringify(data)
    var runFlowString = JSON.stringify(nodes.find((n) => n.id === nodeId))
    alert(runFlowString);

  }

  function makeJsonData(nodes, edges){
    // Makes a properly formatted json given the node info and edges THIS MAY NEED TO CHANGE TO TAKE CUSTOM NODE INFO INPUT
  }

  const data = {
    nodes: nodes,
    edges: edges,
  };
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <button onClick={() => runFlowButton(data)}>Run flow</button>
      <div style={{float: 'right'}}>
        <button onClick={() => downloadJsonButton(data)}>Download Flow as Json</button>
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
        <Background variant="dots" gap={12} size={1} />

        
      </ReactFlow>

    </div>
  );

  // Usage

}
