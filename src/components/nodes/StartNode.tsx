"use client";

import {
  Connection,
  Handle,
  Position,
  useReactFlow,
  Node,
  NodeProps,
  XYPosition,
} from "reactflow";

import "../styles/flow.css";
import { isValidConnection } from "./utils";

import Run from "@/icons/run.svg";
import { CustomNode } from "@/types";

type CustomData = {};

const StartNode: CustomNode<CustomData> = function StartNode(
  props: NodeProps<CustomData>
) {
  const flow = useReactFlow();

  const _isValidConnection = (connection: Connection): boolean => {
    // In addition to the standard validation, the Start node can only connect to a proper state node (no async actions!)
    return (
      isValidConnection(flow, connection) &&
      (flow.getNode(connection.target!)!.type ?? "").startsWith("state")
    );
  };

  return (
    <div className="drop-shadow-md">
      <svg height="20" width="20">
        {/* START Hatch pattern */}
        <pattern
          id="diagonalHatch"
          patternUnits="userSpaceOnUse"
          width="4"
          height="4"
        >
          <path
            d="M-1,1 l2,-2
           M0,4 l4,-4
           M3,5 l2,-2"
            style={{ stroke: "black", strokeWidth: 1 }}
          />
        </pattern>
        {/* END Hatch pattern */}
        <circle
          cx="10"
          cy="10"
          r="8"
          // Fill is either solid black or the hatch pattern
          fill={props.selected ? "url(#diagonalHatch)" : "black"}
        />
      </svg>
      <Handle
        type="source"
        position={Position.Bottom}
        isValidConnection={_isValidConnection}
        className="!bg-blue-500"
      />
    </div>
  );
} as CustomNode<CustomData>;

StartNode.TypeKey = "stateStart";
StartNode.Builder = function (
  position: XYPosition = { x: 0, y: 0 }
): Node<CustomData> {
  return {
    id: "__start__",
    position: position,
    data: {},
    deletable: false,
    type: StartNode.TypeKey,
  };
};
StartNode.FriendlyName = "Start";
StartNode.Icon = Run;

export default StartNode;
