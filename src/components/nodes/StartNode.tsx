import {
  Connection,
  Handle,
  Position,
  useReactFlow,
  getOutgoers,
  NodeProps,
} from "reactflow";

import "../styles/flow.css";

export default function StartNode(props: NodeProps) {
  const flow = useReactFlow();

  const isValidConnection = (connection: Connection) => {
    const comingFrom = flow.getNode(connection.source as string)!;
    const outgoing = getOutgoers(comingFrom, flow.getNodes(), flow.getEdges());
    // Only allow connection if there are no connections already present
    return outgoing.length == 0;
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
        isValidConnection={isValidConnection}
        className="!bg-blue-500"
      />
    </div>
  );
}
