import {
  Handle,
  NodeProps,
  Position,
  XYPosition,
  useReactFlow,
  useUpdateNodeInternals,
} from "reactflow";
import { v4 as uuidv4 } from "uuid";

import { CustomNode } from "@/types";
import Robot from "@/icons/robot.svg";
import ConfigDialog from "./ConfigDialog";
import useConfigDialog from "@/hooks/useConfigDialog";
import useCustomDataItem from "@/hooks/useCustomDataItem";
import MultiTextField from "../forms/MultiTextField";
import { useEffect } from "react";
import { isValidConnection } from "./utils";

type CustomData = {
  commands: string[];
};

const Command: CustomNode<CustomData> = function (
  props: NodeProps<CustomData>
) {
  const flow = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  const { showConfig, configProps, ConfigButton } = useConfigDialog(props);
  const [commands, setCommands] = useCustomDataItem({
    nodeProps: props,
    key: "commands",
  });
  useEffect(
    () => updateNodeInternals(props.id),
    [props.id, commands, updateNodeInternals]
  );

  return (
    <>
      <ConfigDialog display={showConfig}>
        <MultiTextField
          label="Commands"
          placeholder="/command"
          values={commands}
          onChange={setCommands}
        />
      </ConfigDialog>

      <div className="react-flow__custom drop-shadow-md px-2 py-1 rounded-md bg-orange-100 border-2 border-gray-600 max-w- relative group">
        <ConfigButton {...configProps} />
        {/* Node body */}
        <div className="font-bold">Command router</div>
        {/* Node handles */}
        <Handle type="target" position={Position.Top} />{" "}
        {/* Wrapper for handles */}
        <div className="flex flex-row absolute w-full bottom-0 left-0 justify-around">
          {commands.map((cmd, i) => (
            <Handle
              key={cmd}
              type="source"
              position={Position.Bottom}
              id={i.toString()} // Can't use cmd here, otherwise it gets disconnected when editing the command!
              className="!relative !transform-none !left-auto"
            />
          ))}
        </div>
      </div>
    </>
  );
};
Command.TypeKey = "stateCommand";
Command.FriendlyName = "Command";
Command.Builder = (position: XYPosition, id?: string) => ({
  id: id ?? uuidv4(),
  position,
  data: {
    commands: ["/start"],
  },
  type: Command.TypeKey,
});
Command.Icon = Robot;

export default Command;
