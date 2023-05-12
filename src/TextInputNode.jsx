import { useCallback } from 'react';
import React, { useState } from 'react';

import { Handle, Position } from 'reactflow';
import EditableLabel from './EditableLabel';
import EdiText from 'react-editext'


const handleStyle = { left: 10 };


function TextInputNode({ data, isConnectable }) {

  

  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);
  const handleRemove = (e) => {
    e.stopPropagation(); // Prevent triggering node selection
    remove(id); // Remove the node using the remove function provided by React Flow
  };
  
  const EditableLabel = (props) => {
    const { text, onInput } = props;
  
    const handleInput = (event) => {
      onInput(event.target.textContent);
    };
  }  

  const [value, setValue] = useState('[Define a role for this AI]');
  const [prompt_value, setValue2] = useState('[Enter a prompt]'); 
  const handleSave = (val) => {
    console.log('Edited Value -> ', val);
    setValue(val);
  };

  return (
    <div className="text-updater-node">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      

      <div>

        <button  className="remove-node-button" onClick={handleRemove}>
 
                    
        </button>

        


      </div>
      <EdiText type="text" value={value} onSave={handleSave} />
      <EdiText type="text" value={prompt_value} onSave={handleSave} />
      <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
    </div>
  );
}



export default TextInputNode;
