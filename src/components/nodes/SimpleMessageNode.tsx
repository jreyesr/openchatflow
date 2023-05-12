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
import ConfigDialog from "./ConfigDialog";
import { isValidConnection } from "./utils";

import Chat from "@/icons/chat.svg";
import { CustomNode } from "@/types";
import useCustomDataItem from "@/hooks/useCustomDataItem";
import useConfigDialog from "@/hooks/useConfigDialog";

import TextField from "@/components/forms/TextField";

type CustomData = { label: string; msg: string };

const SimpleMessage: CustomNode<CustomData> = function (
  props: NodeProps<CustomData>
) {
  const flow = useReactFlow();

  const { showConfig, configProps, ConfigButton } = useConfigDialog(props);
  const [msg, setMsg] = useCustomDataItem({ nodeProps: props, key: "msg" });

  return (
    <>
      <ConfigDialog display={showConfig}>
        <TextField
          label="Text"
          placeholder="Enter a message..."
          value={msg}
          onChange={setMsg}
        />
      </ConfigDialog>

      <div className="react-flow__custom drop-shadow-md px-2 py-1 rounded-md bg-orange-100 border-2 border-gray-600 relative group">
        <ConfigButton {...configProps} />

        {/* Node body */}
        <div className="font-bold">{props.data.label}</div>
        <div className="text-gray-500 text-ellipsis overflow-hidden">
          &ldquo;{msg}&rdquo;
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
} as CustomNode<CustomData>;

SimpleMessage.TypeKey = "stateSimpleMsg";
SimpleMessage.Builder = function (
  position: XYPosition,
  id?: string
): Node<CustomData> {
  return {
    id: id ?? uuidv4(), // If no ID provided, generate one at random
    position: position,
    data: { label: "Send message", msg: "Hello!" },
    type: SimpleMessage.TypeKey,
  };
};
SimpleMessage.FriendlyName = "Text message";
SimpleMessage.Icon = Chat;

export default SimpleMessage;
