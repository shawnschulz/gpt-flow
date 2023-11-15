import React, { useCallback, useRef, useEffect } from 'react';
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
import ActionProvider from './bot/ActionProvider.js';
import MessageParser from './bot/MessageParser.js';
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
  const actionProviderRef = useRef(new ActionProvider());

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
 
  const [getMessage, setGetMessage] = useState({ActionProvider})
  let sharedActionProvider = new ActionProvider
  async function runFlowButton (data)  {
 	async function runAPI(data) {
		return(runSchema(data));
	}
	const returnValue = await runAPI(data);
	console.log(returnValue);
	let chatLogOutputList = returnValue['output_text']
	for (const chatMessage of chatLogOutputList){
        //our last task pretty much, need to somehow get these chatMessages to output to a component
        setGetMessage(chatMessage)
    }
	return returnValue;
 }
 
 const onRestore = (selectedFile) =>{
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

  const [selectedFile, setSelectedFile] = useState();

  const handleFileVariable = (e) => {
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
            <a href="http://localhost:5173/about" target="_blank" rel="noopener noreferrer">
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
