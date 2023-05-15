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
  MarkerType,
} from "reactflow";

import "reactflow/dist/style.css";

import { CustomNode } from "@/types";

import AddNodeFloatingButton from "@/components/nodes/AddNodeFloatingButton";
import EndNode from "@/components/nodes/EndNode";
import NodeChooserPopup from "@/components/NodeChooserPopup";
import SimpleMessage from "@/components/nodes/SimpleMessageNode";
import QuestionNode from "@/components/nodes/QuestionNode";
import StartNode from "@/components/nodes/StartNode";
import Webhook from "@/components/nodes/Webhook";
import Command from "@/components/nodes/Command";

import { isValidConnection } from "./nodes/utils";
import AutoEdge from "./nodes/AutoEdge";

const initialNodes: Node[] = [
  StartNode.Builder({ x: 0, y: 0 }),
  Command.Builder({ x: 0, y: 80 }, "cmd", ["/start", "/bye"]),

  SimpleMessage.Builder({ x: -60, y: 240 }, "msg1"),
  SimpleMessage.Builder({ x: 120, y: 160 }, "msg2"),
  QuestionNode.Builder({ x: -60, y: 160 }, "q"),
  EndNode.Builder({ x: 120, y: 240 }, "end1"),
  EndNode.Builder({ x: -60, y: 320 }, "end2"),

  Webhook.Builder({ x: -180, y: 260 }, "wh"),
];
const initialEdges: Edge[] = [
  { id: "start", source: "__start__", target: "cmd" },

  { id: "bye", source: "cmd", sourceHandle: "1", target: "msg2" },
  { id: "byeend", source: "msg2", target: "end1" },

  { id: "start", source: "cmd", sourceHandle: "0", target: "q" },
  { id: "q", source: "q", target: "msg1" },
  { id: "startend", source: "msg1", target: "end2" },
  { id: "wh1", source: "q", target: "wh" },
];

const nodeTypes: { [k in string]: CustomNode<any> } = {
  // Control nodes
  [StartNode.TypeKey]: StartNode,
  [EndNode.TypeKey]: EndNode,

  // State nodes
  [SimpleMessage.TypeKey]: SimpleMessage,
  [QuestionNode.TypeKey]: QuestionNode,
  [Command.TypeKey]: Command,

  // Async actions
  [Webhook.TypeKey]: Webhook,
};

const edgeTypes: { [k in string]: any } = {
  default: AutoEdge,
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
        edgeTypes={edgeTypes}
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
        defaultEdgeOptions={{
          markerEnd: { type: MarkerType.Arrow, width: 15, height: 15 },
        }}
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
