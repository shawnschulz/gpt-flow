import React, { useCallback, useEffect } from 'react';
import 'reactflow/dist/style.css';
import ReactFlow, {
  Controls,
  Background,
  useEdgesState,
  addEdge
} from 'reactflow';
import { useState } from 'react';

import TextInputNode from './TextInputNode';
import Chatbot, { createChatBotMessage } from 'react-chatbot-kit'
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
import axios from 'axios'
import './RunSchema.js'
import runSchema from './RunSchema.js';

//Change this to use the api later
import shblog_icon from "./shblog_icon.png"
import run_icon from "./run_icon.png"
import plus_icon from "./plus_icon.png"
//

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addChildNode: state.addChildNode,
  setNodes: state.setNodes,
  getNodes: state.getNodes
});

const rfStyle = {
  backgroundColor: '#faf5ff',
};

const nodeTypes = { textInput: TextInputNode };

//edges stuff should probably be moved to store.ts later
const initialEdges = [];

function Flow() {
  const { nodes, onNodesChange, setNodes, getNodes, addChildNode } = useStore(selector, shallow);
  
  //is this necessary anymore?
  const store = useStoreApi();

  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  
////Buttons////
  function downloadJsonButton(dictionary) { 
      //This just turns dictionary style objects itno a json and then downloads it
    const fileData = JSON.stringify(dictionary);
    const blob = new Blob([fileData], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "gpt_flow_schema.json";
    link.click();
  }
  const [getMessage, setGetMessage] = useState({})
  function runFlowButton(data) {
    //once i get the backend set up can use "getNodes()" and another function to getEdges to send info to the backend
    //or just do what the download button does idk
    
    console.log(runSchema(data))
    // need to call backend API somehow to send the schema to python script

  }
 
 const onRestore = (selectedFile) =>{
  //this function uses the set functions to restore flow from an uploaded file, 
  //TODO: put setEdges in store.ts as well, i'm still using the one defined here for no reason.
  if (selectedFile){
    const flow = JSON.parse(selectedFile);
    setNodes(flow["nodes"] || []);
    setEdges(flow["edges"] || []);
  } else {
    setNodes([
      {
        id: '00001',
        type: 'textInput',
        data: { prompt: '[Insert a prompt here]' },
        position: { x: 0, y: 0 },
      },
    ]);
    setEdges(initialEdges);
  }
  
 }


  //stuff for copy pasting nodes


  // const [ctrlState, setCtrlState] = useState('');

  //   useEffect(() => {
  //     const handleKeyDown = (event) => {
  //       event.preventDefault();
  //       const code = event.which || event.keyCode;

  //       let charCode = String.fromCharCode(code).toLowerCase();
  //       if ((event.shiftKey || event.metaKey) && charCode === 's') {
  //         setCtrlState('CTRL+S');
  //      //   downloadJsonButton({nodes: nodes, edges: edges});
  //       } else if ((event.shiftKey || event.metaKey) && charCode === 'c') {
  //      //   setCtrlState('SHIFT+C');
          
  //         for (var i =0; i < edges.length; i++){
  //           alert(JSON.stringify(edges[i]))
  //           if (edges[i]['selected']){
  //             alert("node is selected")
  //           }
  //         }
  //       //  alert('SHIFT C')
  //         const selectedElements = useStoreState((store) => store.selectedElements);

  //       } else if ((event.shiftKey || event.metaKey) && charCode === 'v') {
  //         setCtrlState('SHIFT+V');
  //      //   alert('SHIFT+V Pressed');
  //       }
  //     };

  //     window.addEventListener('keydown', handleKeyDown);

  //     return () => window.removeEventListener('keydown', handleKeyDown);
  //   }, []);
  //
  const [selectedFile, setSelectedFile] = useState();

  const handleFileVariable = (e) => {
    //gets the file from the upload button and turns it to a string, which then gets parsed into JSON
    //I'm not actually sure why JSON.stringify or JSON.parse didn't work to start, but this makes it work now
      const fileReader = new FileReader();
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = e => {
        console.log("e.target.result", e.target.result);
        setSelectedFile(e.target.result)
      };      
     };

  // API calls for communication with backend


  const testBackend = () => {
    axios.get('http://127.0.0.1:5000/flask/hello').then(response => {
          console.log("SUCCESS", response)
          setGetMessage(response)
        }).catch(error =>{
          console.log(error)
        })
  }

  // end of code blocks for API calls
  
  return (
    <div className="container">
  
      <div className="otherComponents">

        <div style={{ width: '75vw', height: '96vh' }}>
          
          <div style={{float: 'right'}}>
            <button onClick={() => downloadJsonButton({nodes: nodes, edges: edges})}>Download Flow as Json</button>
          </div>

          <div style={{float: 'right'}}>
            <input type="file" name="file" accept=".json" onChange={(e) => handleFileVariable(e)} /> <button onClick={() => onRestore(selectedFile)}>Load</button>
          </div>
          
          <div style = {{float: 'left'}}>
            <a href="http://localhost:5173/" target="_blank" rel="noopener noreferrer">
              <img src={shblog_icon} style= {{width: 40, height: 40, position: 'relative', left: 2}}/>
            </a>
          </div>

          <div style={{float: 'left', position: 'relative', left: 4}}>
            <button onClick={addChildNode}><img src={plus_icon} style= {{width: 30, height: 30, position: 'relative', top: -4}}/></button>
          </div>

          <div style={{float: 'left', position: 'relative', left: 4}}>
            <button onClick={() => runFlowButton({nodes:nodes, edges:edges})}><img src={run_icon} style= {{width: 30, height: 30, position: 'relative', top: -4}}/></button>
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


    <div className="myComponent">
      
      <Chatbot  
        config={config} 
        actionProvider={ActionProvider} 	    
        messageParser={MessageParser} 
      />

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
