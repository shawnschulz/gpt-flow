import { useCallback } from 'react';
import React, { useState } from 'react';

import { Handle, Position } from 'reactflow';





function TextInputNode({ data, isConnectable }) {

  


 

  




  const onEdit = () => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === editState.id) {
          node.data = {
            ...node.data,
            label: `${node.id})`
          };
        }

        return node;
      })
    );
  };


  return (
    <div className="text-updater-node">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      

      <div>

 
                    

      {" "}
      <input
        type="text"
        onChange={(e) => {

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
