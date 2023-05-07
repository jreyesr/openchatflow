import {
  Handle,
  Position,
  useReactFlow,
  Node,
  NodeProps,
  XYPosition,
} from "reactflow";
import { v4 as uuidv4 } from "uuid";

import "../styles/flow.css";
import { useEffect, useState } from "react";
import ConfigDialog from "./ConfigDialog";
import { isValidConnection } from "./utils";

function SimpleMessage(props: NodeProps) {
  const flow = useReactFlow();

  const [showConfig, setShowConfig] = useState(false);
  const onShowConfigClicked = () => {
    // 1. Force select the current node
    flow.setNodes((nds) =>
      nds.map((n) => {
        // Only select the current node, deselect everything else
        const isThisNode = n.id === props.id;
        n.selected = isThisNode;
        return n;
      })
    );
    // 2. Toggle dialog
    setShowConfig(!showConfig);
  };
  // Hide the config dialog when the node is deselected
  useEffect(() => {
    if (!props.selected) setShowConfig(false);
  }, [props.selected]);

  const setMessage = (msg: string) => {
    flow.setNodes((nds) =>
      nds.map((n) => {
        // Change the data on the current node
        if (n.id === props.id) {
          // NOTE You have to set the entire data object, otherwise it doesn't refresh
          // See https://reactflow.dev/docs/examples/nodes/update-node/
          n.data = {
            ...n.data,
            msg,
          };
        }
        return n;
      })
    );
  };

  return (
    <>
      <ConfigDialog display={showConfig}>
        <label className="block">
          <span className="text-gray-700">Text</span>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-opacity-50"
            placeholder="Enter a message..."
            value={props.data.msg}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
      </ConfigDialog>

      <div className="react-flow__custom drop-shadow-md px-2 py-1 rounded-md bg-orange-100 border-2 border-gray-600 relative group">
        {/* START config button */}
        <div
          className="absolute top-1 right-1 invisible group-hover:visible bg-white rounded-sm p-1 cursor-pointer nodrag border-2 border-orange-500"
          onClick={onShowConfigClicked}
        >
          {/* Material Design's Tune icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="16"
            viewBox="0 96 960 960"
            width="16"
          >
            <path d="M427 936V711h60v83h353v60H487v82h-60Zm-307-82v-60h247v60H120Zm187-166v-82H120v-60h187v-84h60v226h-60Zm120-82v-60h413v60H427Zm166-165V216h60v82h187v60H653v83h-60Zm-473-83v-60h413v60H120Z" />
          </svg>
        </div>
        {/* END config button */}

        {/* Node body */}
        <div className="font-bold">{props.data.label}</div>
        <div className="text-gray-500 text-ellipsis overflow-hidden">
          &ldquo;{props.data.msg}&rdquo;
        </div>

        {/* Node handles */}
        <Handle type="target" position={Position.Top} />
        <Handle
          type="source"
          position={Position.Bottom}
          isValidConnection={(conn) => isValidConnection(flow, conn)}
          className="!bg-blue-500"
        />
      </div>
    </>
  );
}
SimpleMessage.TypeKey = "stateSimpleMsg";
SimpleMessage.Builder = function (position: XYPosition, id?: string): Node {
  return {
    id: id ?? uuidv4(), // If no ID provided, generate one at random
    position: position,
    data: { label: "Send message", msg: "Hello!" },
    type: SimpleMessage.TypeKey,
  };
};

export default SimpleMessage;
