import React from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import useStore from '../store';
import {useState, useEffect} from 'react'

export type NodeData = {
  prompt: string;
};

function TextInputNode({ id, data }: NodeProps<NodeData>) {
  const updateNodeLabel = useStore((state) => state.updateNodeLabel);
  const updateNodeID = useStore((state) => state.updateNodeID);
  const [inputValue, setInputValue] = useState(id)
  const [timer, setTimer] = useState(null)
  const inputChanged = e => {
    setInputValue(e.target.value)

    clearTimeout(timer)

    const newTimer = setTimeout(() => {
      updateNodeID(id, inputValue)
    }, 750)

    setTimer(newTimer)
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      updateNodeID(id, inputValue)
    }, 500)

    return () => clearTimeout(timer)
  }, [inputValue])


   return (
    <div className="text-updater-node">
      <Handle type="target" position={Position.Left} id="left" style={{ // Make the handle invisible and increase the touch area
        background: 'transparent',
        zIndex: 999,
        border: 'none',
        width: '20px',
        height: '20px',
      }}/>
      
      <div style={{width:'200px',height:'10px',border:'none', color:'black'}}>

        <input className='labels'
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        /><textarea
          className='nodrag'
          value={data.prompt}

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

export default TextInputNode;
