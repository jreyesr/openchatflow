import StartNode from "@/components/nodes/StartNode";
import React, { useCallback, useMemo } from "react";
import ReactFlow, {
  Node,
  Background,
  Connection,
  Controls,
  MiniMap,
  addEdge,
  Edge,
  useEdgesState,
  useNodesState,
  BackgroundVariant,
} from "reactflow";

import "reactflow/dist/style.css";

const initialNodes: Node[] = [
  {
    id: "0",
    type: "start",
    position: { x: 65, y: 0 },
    data: {},
    deletable: false,
  },
  {
    id: "1",
    position: { x: 0, y: 80 },
    data: { label: "1" },
  },
  {
    id: "2",
    position: { x: 0, y: 180 },
    data: { label: "2" },
  },
];
const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "start", source: "0", target: "1" },
];

export default function Editor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const nodeTypes = useMemo(() => ({ start: StartNode }), []);

  return (
    <div style={{ flexGrow: 1, fontSize: 12 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-white"
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Cross} gap={25} size={4} />
      </ReactFlow>
    </div>
  );
}
