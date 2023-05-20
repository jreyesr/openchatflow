import { Node, Edge } from "reactflow";

import Editor from "@/components/Editor";

const initialNodes: Node[] = [
  {
    id: "__start__",
    position: { x: 0, y: 0 },
    data: {},
    deletable: false,
    type: "stateStart",
  },
  {
    id: "__end__",
    position: { x: 0, y: 80 },
    data: { exitCode: "success" },
    type: "stateEnd",
  },
];

const initialEdges: Edge[] = [
  { id: "demo", source: "__start__", target: "__end__" },
];

export default function Design() {
  return (
    <div className="flex" style={{ height: "75vh" }}>
      <Editor initialNodes={initialNodes} initialEdges={initialEdges} />
    </div>
  );
}
