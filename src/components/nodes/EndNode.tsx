import {
  Connection,
  Handle,
  Position,
  useReactFlow,
  Node,
  NodeProps,
  XYPosition,
} from "reactflow";
import { v4 as uuidv4 } from "uuid";

import "../styles/flow.css";
import ConfigDialog from "./ConfigDialog";
import stop from "@/icons/stop.svg";

type ExitCode = "success" | "failure";
type CustomData = { exitCode: ExitCode };

function EndNode(props: NodeProps<CustomData>) {
  const flow = useReactFlow();

  const _isValidConnection = (connection: Connection): boolean => {
    // An End node only takes main state nodes as inputs, no async activities
    return (flow.getNode(connection.source!)!.type ?? "").startsWith("state");
  };

  let color;
  switch (props.data.exitCode) {
    case "success":
      color = "green";
      break;
    case "failure":
      color = "red";
      break;
    default:
      // Fun fact: this weird bit protects against adding a new exitCode and forgetting to handle it here
      // https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking
      const _exhaustiveCheck: never = props.data.exitCode;
      return _exhaustiveCheck;
  }

  const setExitCode = (newCode: ExitCode) => {
    flow.setNodes((nds) =>
      nds.map((n) => {
        // Change the data on the current node
        if (n.id === props.id) {
          // NOTE You have to set the entire data object, otherwise it doesn't refresh
          // See https://reactflow.dev/docs/examples/nodes/update-node/
          n.data = {
            ...n.data,
            exitCode: newCode,
          };
        }
        return n;
      })
    );
  };

  return (
    <>
      {/* START Config dialog */}
      <ConfigDialog display={props.selected}>
        <span className="text-gray-700">Reason for exit</span>
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <label className="relative inline-flex items-center mb-4 cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={props.data.exitCode === "success"}
              onChange={() => setExitCode("success")}
            />
            <div className="inline-flex items-center px-2 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 peer-checked:border-gray-500 peer-checked:border-2 rounded-l-lg hover:bg-gray-100 hover:text-orange-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20"
                viewBox="0 96 960 960"
                width="20"
                className="mr-2"
              >
                <path d="m421 758 283-283-46-45-237 237-120-120-45 45 165 166Zm59 218q-82 0-155-31.5t-127.5-86Q143 804 111.5 731T80 576q0-83 31.5-156t86-127Q252 239 325 207.5T480 176q83 0 156 31.5T763 293q54 54 85.5 127T880 576q0 82-31.5 155T763 858.5q-54 54.5-127 86T480 976Zm0-60q142 0 241-99.5T820 576q0-142-99-241t-241-99q-141 0-240.5 99T140 576q0 141 99.5 240.5T480 916Zm0-340Z" />
              </svg>
              Success
            </div>
          </label>
          <label className="relative inline-flex items-center mb-4 cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={props.data.exitCode === "failure"}
              onChange={() => setExitCode("failure")}
            />
            <div className="inline-flex items-center px-2 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-r border-gray-200 peer-checked:border-gray-500 peer-checked:border-2 rounded-r-lg hover:text-orange-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20"
                viewBox="0 96 960 960"
                width="20"
                className="mr-2"
              >
                <path d="M480 775q14 0 24.5-10.5T515 740q0-14-10.5-24.5T480 705q-14 0-24.5 10.5T445 740q0 14 10.5 24.5T480 775Zm-30-144h60V368h-60v263ZM330 936 120 726V426l210-210h300l210 210v300L630 936H330Zm25-60h250l175-175V451L605 276H355L180 451v250l175 175Zm125-300Z" />
              </svg>
              Failure
            </div>
          </label>
        </div>
      </ConfigDialog>
      {/* END Config dialog */}

      <div className="drop-shadow-md">
        <Handle
          type="target"
          position={Position.Top}
          isValidConnection={_isValidConnection}
        />

        {/* Actual node circle */}
        <svg height="20" width="20">
          {/* START Hatch pattern */}
          <pattern
            id={"diagonalHatch_" + props.id}
            patternUnits="userSpaceOnUse"
            width="4"
            height="4"
          >
            <path
              d="M-1,1 l2,-2
           M0,4 l4,-4
           M3,5 l2,-2"
              style={{ stroke: color, strokeWidth: 1 }}
            />
          </pattern>
          {/* END Hatch pattern */}
          <circle cx="10" cy="10" r="8" stroke={color} fill="transparent" />
          <circle
            cx="10"
            cy="10"
            r="6"
            // Fill is either solid black or the hatch pattern
            fill={props.selected ? `url(#diagonalHatch_${props.id})` : color}
          />
        </svg>
      </div>
    </>
  );
}
EndNode.TypeKey = "stateEnd";
EndNode.Builder = function (
  position: XYPosition,
  id?: string
): Node<CustomData> {
  return {
    id: id ?? "__end__" + uuidv4(), // If no ID provided, generate one at random
    position: position,
    data: { exitCode: "success" },
    type: EndNode.TypeKey,
  };
};
EndNode.FriendlyName = "End";
EndNode.Icon = stop;
export default EndNode;
