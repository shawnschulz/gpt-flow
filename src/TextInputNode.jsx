import { useCallback } from 'react';
import React, { useState } from 'react';

import { Handle, Position } from 'reactflow';





function TextInputNode({ data, isConnectable }) {

  


 

  



  const [editState, setEditState] = useState({ prompt: "" });

  const onEdit = (newPrompt) => {
    setNodes((nds) =>
      nds.map((node) => {
          node.data = {
            ...node.data,
            prompt: `${newPrompt})`
          };
        return node;
      })
    );
  };


  return (
    <div className="text-updater-node">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      

      <div>

 
                    

      {"Prompt"}
      <textarea
        className='nodrag'
        type="text"
        onChange={(e) => {
          onEdit(e.target.value)
        }}
      /> 


      </div>
      <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
    </div>
  );
}

//        <button  className="remove-node-button" onClick={handleRemove}></button>

      //<EdiText type="text" value={value} onSave={handleSave} />
      //<EdiText type="text" value={prompt_value} onSave={handleSave} />

export default TextInputNode;
