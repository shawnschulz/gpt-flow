import React from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import useStore from '../store';


export type NodeData = {
  label: string;
};

function TextInputNode({ id, data }: NodeProps<NodeData>) {
  const updateNodeLabel = useStore((state) => state.updateNodeLabel);

   return (
    <div className="text-updater-node">
      <Handle type="target" position={Position.Left} id="left" style={{ // Make the handle invisible and increase the touch area
        background: 'transparent',
        zIndex: 999,
        border: 'none',
        width: '20px',
        height: '20px',
      }}/>
      
      <div>
        {`${id}`}
        <textarea
          className='nodrag'
          value={data.label}

          onChange={(evt) => updateNodeLabel(id, evt.target.value)}
        /> 
      </div>

      <Handle type="source" position={Position.Right} id="right" style={{ // Make the handle invisible and increase the touch area
        background: 'transparent',
        zIndex: 999,
        border: 'none',
        width: '20px',
        height: '20px',
      }}/>

      <Handle type="target" position={Position.Top} id="top" style={{ // Make the handle invisible and increase the touch area
        background: 'transparent',
        zIndex: 999,
        border: 'none',
        width: '20px',
        height: '20px',
      }}/>

      <Handle type="source" position={Position.Bottom} id="bottom" style={{ // Make the handle invisible and increase the touch area
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
