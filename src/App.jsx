import React, { useCallback } from 'react';
import { applyEdgeChanges, applyNodeChanges } from 'reactflow';
import 'reactflow/dist/style.css';
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

import TextInputNode from './TextInputNode.jsx';

import './TextInputNodeStyle.css';



//import './updateNode.css';


const rfStyle = {
  backgroundColor: '#faf5ff',
};

const exportToJson = (dictionary) => {
  //This just turns dictionary style objects itno a json and then downloads it
  const fileData = JSON.stringify(dictionary);
  const blob = new Blob([fileData], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "nodes_edges_data.json";
  link.click();
};

const createNode = (node_id, nodes) => {
  const node = { id: String(node_id), position: { x: 0, y: 0 }, type: 'textInput', data: { value: 123 } }
  nodes.push(node)
  return(nodes)
};

const nodeTypes = { textInput: TextInputNode };

const initialNodes = [
  { id: 'node-1', position: { x: 0, y: 0 }, type: 'textInput', data: { value: 123 } },
  { id: 'node-2', position: { x: 0, y: 100 }, type: 'textInput', data: { value: 123 } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];



export default function App() {

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  
  //Buttons
  function downloadJsonButton(dictionary) { 
    
    exportToJson(dictionary)
  }

  function runFlowButton(data) {
    var runFlowString = JSON.stringify(data)
    var runFlowString = JSON.stringify(nodes.find((n) => n.id === nodeId))
    alert(runFlowString);

  }

  

  const data = {
    nodes: nodes,
    edges: edges,
  };

  const getNodeId = () => `${String(+new Date()).slice(6)}`;

const onAdd = () => {
    const id = getNodeId();
    const newNode = {
      id,
      data: { label: `${id})` },
      position: {
        x: 0,
        y: 0 + (nodes.length + 1) * 20
      },
      type:'textInput'
    };
    setNodes((nds) => nds.concat(newNode));
  }; 
  
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <button onClick={() => runFlowButton(data)}>Run flow</button>
      <div style={{float: 'right'}}>
        <button onClick={() => downloadJsonButton(data)}>Download Flow as Json</button>
      </div>

      <button onClick={onAdd}>Add node</button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        style={rfStyle}
      >
        <Controls />
        <Background variant="dots" gap={12} size={1} />

        
      </ReactFlow>

    </div>
  );

  // Usage

}
