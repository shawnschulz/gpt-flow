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
import { Handle, Position } from 'reactflow';
import { useState } from 'react';

import TextInputNode from './TextInputNode';
import Chatbot from 'react-chatbot-kit'
import {useEffect} from 'react';
import './TextInputNodeStyle.css';

import { shallow } from 'zustand/shallow';
import {ReactFlowProvider} from 'reactflow'
import useStore, { RFState } from '../store';
import {useStoreApi} from 'reactflow'
import ActionProvider from './bot/ActionProvider';
import MessageParser from './bot/MessageParser';
import config from './bot/Config';
import 'react-chatbot-kit/build/main.css';
import './App.css'
//import './updateNode.css';

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addChildNode: state.addChildNode,
  setNodes: state.setNodes
});

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

//Couldn't figure out how to get this to work so copied my custom node in


//


const nodeTypes = { textInput: TextInputNode };


const initialNodes = [
  { id: "000001", position: { x: 0, y: 0 }, type: 'textInput', data: { label: '[Enter a prompt here]' } },
  { id: "000002", position: { x: 0, y: 100 }, type: 'textInput', data: { label: '[Enter a prompt here]' } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];




function Flow() {
  const { nodes, onNodesChange, setNodes, addChildNode } = useStore(selector, shallow);
  const store = useStoreApi();

 // const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  
  //Buttons
  function downloadJsonButton(dictionary) { 
    
    exportToJson(dictionary)
  }

  function runFlowButton(data) {
    alert(JSON.stringify(nodes));

  }

  

//  const data = {
//    nodes: nodes,
 //   edges: edges,
 // };

 const onRestore = (selectedFile) =>{
  const jsonFile = selectedFile
  alert(jsonFile)

  const uploadedJson = jsonFile
  const flow = JSON.parse(uploadedJson);
  alert(JSON.stringify(flow))
  setNodes(flow.nodes || []);
  setEdges(flow.edges || []);
 }
  


 


  const [selectedFile, setSelectedFile] = useState();
  const changeHandler = (event) => {
    setSelectedFile(event.target.file);
  };
  const handleSubmission = () => {
  };

  return (
    <div className="container">
  
      <div className="otherComponents">

        <div style={{ width: '79vw', height: '96vh' }}>
          
          <div style={{float: 'right'}}>
            <button onClick={() => downloadJsonButton({nodes: nodes, edges: edges})}>Download Flow as Json</button>
          </div>

          <div style={{float: 'right'}}>
            <input type="file" name="file" onChange={changeHandler} /> <button onClick={(selectedFile) => onRestore(selectedFile)}>Load</button>
          </div>
          
          <div style={{float: 'left'}}>
            <button onClick={addChildNode}>Add node</button>
          </div>

          <div>
            <button onClick={function(event){ {onNodesChange}; () => runFlowButton({nodes: nodes, edges: edges})} }>Run flow</button>
          </div>

      
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

    </div>


    <div className="myComponent" style={{ width: '100', height: '100vh' }}>
      <Chatbot  style={{ width: '100000', height: '1000vh' }} config={config} actionProvider={ActionProvider} 	    messageParser={MessageParser} />

    </div>
      

    </div>
      

    
   

    
  );

  // Usage

}
export default () => (
  <ReactFlowProvider>
    <Flow />
  </ReactFlowProvider>
);
