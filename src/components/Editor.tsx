"use client";

import React, { useCallback, useRef, useState } from "react";
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
  ReactFlowInstance,
} from "reactflow";

import "reactflow/dist/style.css";

import { CustomNode } from "@/types";

import AddNodeFloatingButton from "@/components/nodes/AddNodeFloatingButton";
import EndNode from "@/components/nodes/EndNode";
import NodeChooserPopup from "@/components/NodeChooserPopup";
import SimpleMessage from "@/components/nodes/SimpleMessageNode";
import StartNode from "@/components/nodes/StartNode";
import Webhook from "@/components/nodes/Webhook";
import { isValidConnection } from "./nodes/utils";
const initialNodes: Node[] = [
  StartNode.Builder({ x: 0, y: 0 }),
  SimpleMessage.Builder({ x: 0, y: 80 }, "1"),
  SimpleMessage.Builder({ x: 0, y: 160 }, "2"),
  EndNode.Builder({ x: 0, y: 240 }, "end"),

  Webhook.Builder({ x: 140, y: 200 }, "wh"),
];
const initialEdges: Edge[] = [
  { id: "start", source: "__start__", target: "1" },
  { id: "e1-2", source: "1", target: "2" },
  { id: "final", source: "2", target: "end" },

  { id: "wh1", source: "1", target: "wh" },
  { id: "wh2", source: "2", target: "wh" },
];

const nodeTypes: { [k in string]: CustomNode<any> } = {
  // Control nodes
  [StartNode.TypeKey]: StartNode,
  [EndNode.TypeKey]: EndNode,

  // State nodes
  [SimpleMessage.TypeKey]: SimpleMessage,

  // Async actions
  [Webhook.TypeKey]: Webhook,
};

};

export default function Editor() {
  const flowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [flow, setFlow] = useState<ReactFlowInstance | null>(null);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver: React.DragEventHandler = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop: React.DragEventHandler = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer!.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      // Get the drop position in editor's coordinates
      const reactFlowBounds = flowWrapper.current!.getBoundingClientRect();
      const position = flow!.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      // Build a new node
      const newNode = nodeTypes[type].Builder(position);

      setNodes((nds) => nds.concat(newNode)); // Actually add the new node to the nodelist
      setShowPicker(false); // Hide the palette dialog!
    },
    [flow, setNodes]
  );

  const [family, setFamily] = useState<"state" | "action">("state");
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div
      style={{ flexGrow: 1, fontSize: 12 }}
      className="reactflow-wrapper"
      ref={flowWrapper}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        isValidConnection={(conn) => isValidConnection(flow!, conn)}
        fitView
        maxZoom={1.5}
        snapToGrid={true}
        snapGrid={[20, 20]}
        deleteKeyCode={["Backspace", "Delete"]}
        nodeOrigin={[0.5, 0.5]} // Make the center of the nodes their anchor point (for position coords)
        className="bg-white"
        onInit={setFlow}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <Controls />
        <MiniMap zoomable pannable />
        <AddNodeFloatingButton
          onAdd={(family) => {
            setFamily(family);
            setShowPicker(true);
          }}
        />
        {showPicker && (
          <NodeChooserPopup
            type={family}
            onHide={() => setShowPicker(false)}
            nodeTypes={nodeTypes}
          />
        )}
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
