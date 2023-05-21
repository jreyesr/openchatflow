"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
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
import NodeChooserPopup, { ChooserFamily } from "@/components/NodeChooserPopup";
import SimpleMessage from "@/components/nodes/SimpleMessageNode";
import QuestionNode from "@/components/nodes/QuestionNode";
import StartNode from "@/components/nodes/StartNode";
import Webhook from "@/components/nodes/Webhook";
import Command from "@/components/nodes/Command";
import NoteNode from "@/components/nodes/NoteNode";
import Choice from "@/components/nodes/Choice";

import { isValidConnection } from "./nodes/utils";
import useDebounce from "@/hooks/useDebounce";
import AutoEdge from "./nodes/AutoEdge";

const nodeTypes: { [k in string]: CustomNode<any> } = {
  // Control nodes
  [StartNode.TypeKey]: StartNode,
  [EndNode.TypeKey]: EndNode,

  // State nodes
  [SimpleMessage.TypeKey]: SimpleMessage,
  [QuestionNode.TypeKey]: QuestionNode,
  [Command.TypeKey]: Command,
  [Choice.TypeKey]: Choice,

  // Async actions
  [Webhook.TypeKey]: Webhook,

  // Utils
  [NoteNode.TypeKey]: NoteNode,
};

const edgeTypes: { [k in string]: any } = {
  default: AutoEdge,
};

/** How much inactivity time is required before auto-save kicks in? */
const SAVE_INTERVAL_MS = 2000;

export default function Editor(props: {
  initialNodes: Node[];
  initialEdges: Edge[];
  save: (data: any) => void;
}) {
  const flowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(props.initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(props.initialEdges);
  const [flow, setFlow] = useState<ReactFlowInstance | null>(null);

  // Debounce rapidly-changing flow data, then call an effect once it stabilizes (i.e., no changes in the past X millis)
  const debouncedNodes = useDebounce(nodes, SAVE_INTERVAL_MS);
  const debouncedEdges = useDebounce(edges, SAVE_INTERVAL_MS);
  useEffect(() => {
    props.save({ nodes: debouncedNodes, edges: debouncedEdges });
  }, [debouncedNodes, debouncedEdges]);

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

  const [family, setFamily] = useState<ChooserFamily>("state");
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

      {/* Expandable container for flow JSON declaration */}
      <div className="mx-auto py-4">
        <details className="bg-white open:ring-1 open:ring-black/5 open:shadow-lg p-6 rounded-lg">
          <summary className="text-sm leading-6 text-slate-900 dark:text-white font-semibold select-none">
            Debug
          </summary>
          <div className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400 select-all">
            <pre className="block">
              {JSON.stringify({ nodes, edges }, null, 2)}
            </pre>
          </div>
        </details>
      </div>
    </div>
  );
}
