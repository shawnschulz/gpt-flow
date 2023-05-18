import { useCallback } from 'react';
import React, { useState } from 'react';

import { Handle, Position } from 'reactflow';
import { useEffect } from 'react';
import ReactFlow, { useNodesState, useEdgesState } from 'reactflow';



function TextInputNode({ id, data, isConnectable }) {

  const [nodeData, setNodeData] = useState({
     id: 'node-1', 
     position: { x: 0, y: 0 }, 
     type: 'textInput', 
     data: { test: '' } });

    const updateNodeData = (newPrompt) => {
      setNodeData((nds) =>
      nds.map((node) => {
        if (node.id === editState.id) {
          node.data = {
            ...node.data,
            prompt: `${newPrompt}`
          };
        }

        return node;
      })
    );
  };

  return (
    <div className="text-updater-node">
      <Handle type="target" position={Position.Left} id="left" isConnectable={isConnectable} style={{ // Make the handle invisible and increase the touch area
        background: 'transparent',
        zIndex: 999,
        border: 'none',
        width: '20px',
        height: '20px',
      }}/>
      

      <div>

 
                    

      {"Prompt"}
      <textarea
        className='nodrag'
        value = {nodeData.data.input}
        onChange ={(e) => {
          setNodeData((prev) => ({ ...prev, prompt: e.target.value }));
        }}
      /> 

      
      </div>
      <Handle type="source" position={Position.Right} id="right" isConnectable={isConnectable } style={{ // Make the handle invisible and increase the touch area
        background: 'transparent',
        zIndex: 999,
        border: 'none',
        width: '20px',
        height: '20px',
      }}/>
      <Handle type="target" position={Position.Top} id="top" isConnectable={isConnectable} style={{ // Make the handle invisible and increase the touch area
        background: 'transparent',
        zIndex: 999,
        border: 'none',
        width: '20px',
        height: '20px',
      }}/>
      <Handle type="source" position={Position.Bottom} id="bottom" isConnectable={isConnectable} style={{ // Make the handle invisible and increase the touch area
        background: 'transparent',
        zIndex: 999,
        border: 'none',
        width: '20px',
        height: '20px',
      }}/>

    </div>
    
  );
}

//        <button  className="remove-node-button" onClick={handleRemove}></button>

      //<EdiText type="text" value={value} onSave={handleSave} />
      //<EdiText type="text" value={prompt_value} onSave={handleSave} />

export default TextInputNode;
