import { useCallback } from 'react';
import React, { useState } from 'react';

import { Handle, Position } from 'reactflow';





function TextInputNode({ data, isConnectable, inputValue, setInputValue }) {

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

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
        type="text"
        value={inputValue}
        onChange={handleChange}
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
