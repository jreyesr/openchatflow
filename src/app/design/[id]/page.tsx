import EndNode from "@/components/nodes/EndNode";
import SimpleMessage from "@/components/nodes/SimpleMessageNode";
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
  StartNode.Builder(),
  SimpleMessage.Builder({ x: 0, y: 80 }, "1"),
  SimpleMessage.Builder({ x: 120, y: 80 }, "2"),
  EndNode.Builder({ x: 60, y: 160 }, "end"),
];
const initialEdges: Edge[] = [
  { id: "start", source: "__start__", target: "1" },
  { id: "e1-2", source: "1", target: "2" },
  { id: "final", source: "2", target: "end" },
];

export default function Editor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const nodeTypes = useMemo(
    () => ({
      [StartNode.TypeKey]: StartNode,
      [SimpleMessage.TypeKey]: SimpleMessage,
      [EndNode.TypeKey]: EndNode,
    }),
    []
  );

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
        maxZoom={1.5}
        snapToGrid={true}
        snapGrid={[20, 20]}
        deleteKeyCode={["Backspace", "Delete"]}
        nodeOrigin={[0.5, 0.5]} // Make the center of the nodes their anchor point (for position coords)
        className="bg-white"
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Cross} gap={20} size={4} />
      </ReactFlow>
      {nodes.map((n) => (
        <code key={n.id} className="block">
          {JSON.stringify(n)}
        </code>
      ))}
    </div>
  );
}
