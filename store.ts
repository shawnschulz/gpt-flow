import {
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    OnNodesChange,
    OnEdgesChange,
    applyNodeChanges,
    applyEdgeChanges,
  } from 'reactflow';
  import { create } from 'zustand';
  
  export type RFState = {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    addChildNode: () => void;
    updateNodeLabel: (nodeId: string, prompt: string) => void;
    setNodes: (nodes) => void;
    getNodes: () => void;
  };
  
  const useStore = create<RFState>((set, get) => ({
    nodes: [
      {
        id: '00001',
        type: 'textInput',
        data: { prompt: '[Insert a prompt here]' },
        position: { x: 0, y: 0 },
      },
    ],
    edges: [],
    onNodesChange: (changes: NodeChange[]) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes: EdgeChange[]) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    setNodes: (newNodes) => {
        set({
            nodes: newNodes,
          });
    },
    getNodes: () => {
        const gotNodes = get().nodes
        return(gotNodes)
    },
    addChildNode: () => {
      const getNodeId = () => `${String(+new Date()).slice(6)}`;

      const newNode = {
        id: getNodeId(),
        type: 'textInput',
        data: { prompt: '[Insert a prompt here]' },
        position: {
            x: 0,
            y: 0
          },
      };
      set({
        nodes: [...get().nodes, newNode],
      });
    },
    updateNodeLabel: (nodeId: string, prompt: string) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === nodeId) {
              // it's important to create a new object here, to inform React Flow about the changes
              node.data = { ...node.data, prompt };
            }
      
            return node;
          }),
        });
      },

      
      updateNodeID: (nodeId: string, newID: string) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === nodeId) {
              // it's important to create a new object here, to inform React Flow about the changes
              node.id = newID;
            }
      
            return node;
          }),
        });
      },

  }));
  
  export default useStore;
  