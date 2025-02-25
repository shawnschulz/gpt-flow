import React, { useCallback } from 'react';
import 'reactflow/dist/style.css';
import ReactFlow, {
  Controls,
  Background,
  useEdgesState,
  addEdge
} from 'reactflow';
import { useState } from 'react';

import TextInputNode from './TextInputNode';
import './TextInputNodeStyle.css';
import { shallow } from 'zustand/shallow';
import {ReactFlowProvider} from 'reactflow'
import useStore, { RFState } from '../store';
import {useStoreApi} from 'reactflow'
import Chatbot from './ChatBotContainer.jsx';
import 'react-chatbot-kit/build/main.css';
import './App.css'
import './RunSchema.js'
import runSchema from './RunSchema.js';
import promptOneMessage from './RunSchema.js';
//Change this to use the api later
import shblog_icon from "./shblog_icon.png"
import run_icon from "./run_icon.png"
import plus_icon from "./plus_icon.png"

import { RotatingLines } from "react-loader-spinner";

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
  const [isRequestPending, setIsRequestPending] = useState(false);


  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  
  var messageHistory = {};
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

  function downloadMessageHistory (){
      let historyJSON = chatMessages?.textContent;
    const blob = new Blob([historyJSON], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "gpt_flow_chat_history.txt";
    link.click();
  }

const onEnterPress = (e) => {
    console.log("Debug: key press detected")
     if(e.key == 'Enter' && e.shiftKey == false) {
         e.preventDefault();
         sendMessage(e);
     }
 }

  const [chatInputMessage, setChatInputMessage] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [inputText, setInputText] = useState("");
  const chatMessages = document.querySelector('.chat-messages')
    var message = {
        sender:"you",
        text:""
    }
  const chatMessageElement = (message) => `
    <div class="message usr-bg">
        <b class="message-sender">${message.sender}</b>
        <div class="message-text">${message.text}</div>
    </div>
  `

  function changeText(event) {
      setInputText(event.target.value);
  }

  async function sendMessage(e) {
    e.preventDefault();
    console.log(inputText);
    drawElement("you", inputText);
    setSavedMessage(inputText);
    setInputText("");
    setIsRequestPending(true);
    async function tempRunAPI(data) {
        return(promptOneMessage(data));
    }
    const outputDict = await tempRunAPI({"prompt":inputText});
    setIsRequestPending(false);
    drawElement("shbot", outputDict["response"]);    
  }


  function drawElement(sender: string, text: string){
        message = {
            sender: sender,
            text: text,
        }
      const new_element = chatMessageElement(message)
      chatMessages.innerHTML += new_element
      const d = new Date()
      let time = d.getTime()
      let uniqueMessageId = time + "_" + sender
      messageHistory[uniqueMessageId] = text
  }
  async function runFlowButton(data) {
    //once i get the backend set up can use "getNodes()" and another function to getEdges to send info to the backend
    //or just do what the download button does idk
    
    // need to call backend API somehow to send the schema to python script

 	async function runAPI(data) {
		return(runSchema(data));
	}
    setIsRequestPending(true);
    console.log(Chatbot)
	const returnValue = await runAPI(data);
    setIsRequestPending(false);
	let chatLogOutputList = returnValue['output_text']
	for (const chatMessage of chatLogOutputList){

		drawElement("shbot", chatMessage);
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


function Loader() {
  return (
    <RotatingLines
      strokeColor="purple"
      strokeWidth="10"
      animationDuration="0.75"
      width="24"
      visible={true}
    />
  )
}

  // end of code blocks for API calls
  
  return (
    <div className="container" style={{overflow: "hidden"}}>
  
      <div className="otherComponents">

        <div style={{ width: '75vw', height: '96vh' }}>
          
          <div style={{float: 'right'}}>
            <button onClick={() => downloadJsonButton({nodes: nodes, edges: edges})}>Download Flow as Json</button>
          </div>

          <div style={{float: 'right'}}>
            <input type="file" name="file" accept=".json" onChange={(e) => handleFileVariable(e)} /> <button onClick={() => onRestore(selectedFile)}>Load</button>
          </div>
          
          <div style = {{float: 'left'}}>
            <a href="https://shawnschulz.github.io/" target="_blank" rel="noopener noreferrer">
              <img src={shblog_icon} style= {{marginLeft: '1em', marginTop: '0.5em', width: 40, height: 40, position: 'relative', left: 2}}/>
            </a>
          </div>

          <div style={{float: 'left', position: 'relative'}}>
            <button onClick={addChildNode}><img src={plus_icon} style= {{marginRight: '0em', width: 20, height: 20, position: 'relative'}}/></button>
          </div>

          <div style={{float: 'left', position: 'relative', left: 4}}>
            <button onClick={() => runFlowButton({nodes:nodes, edges:edges})}><img src={run_icon} style= {{marginLeft: '0em', width: 20, height: 20, position: 'relative'}}/></button>
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
      <div style={{float: 'right', position: 'relative'}}>
        <button onClick={downloadMessageHistory}>Download History</button>
      </div>

    <div> 
        <head>
            <meta charSet='UTF-8'/>
            <meta name = 'viewport' content="width=device-width, initial-scale=1.0"/>
            <title> GPT-Flow </title>
            <link rel='stylesheet' href="style.css" />
        </head>
        <body>
            <div class="chat-container"> 
                <h2 class="chat-header">GPT-flow chatbot...</h2>
                <h2 class="chat-header"></h2>
            <div class="chat-messages">
                <div class="message usr-bg">
                    <b class="message-sender">shbot</b>
                    <div class="message-text">Welcome to GPT Flow! shbot is currently running deepseek-r1:7b served by ollama.</div>
                </div>
                <div class="mesage usr-bg">
                    <b class="message-sender">shbot</b>
                    <div class="message-text">You can type your prompt into the input below, or construct a flow chart and run it using the play button. Outputs from the flow chart will appear here automatically.</div>
                </div>
            </div>
            <form class="chat_input">
                <textarea 
                    onKeyDown={onEnterPress}
                    type="text" 
                    class="chat-input" 
                    onChange={changeText}
                    value={inputText}
                    required placeholder="Type here..."/>
                {isRequestPending? <Loader /> : <button 
                    type="submit" 
                    onClick={sendMessage}
                    class="button send-button">Send</button>}
            </form>
              <script src="App.tsx"></script>
            </div>
        </body>
    </div>

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
