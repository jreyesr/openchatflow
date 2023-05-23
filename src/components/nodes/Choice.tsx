"use client";

import { useEffect } from "react";
import {
  Handle,
  NodeProps,
  Position,
  XYPosition,
  useUpdateNodeInternals,
} from "reactflow";
import { v4 as uuidv4 } from "uuid";

import { CustomNode } from "@/types";
import Fork from "@/icons/fork.svg";
import ConfigDialog from "./ConfigDialog";
import useConfigDialog from "@/hooks/useConfigDialog";
import useCustomDataItem from "@/hooks/useCustomDataItem";

import MultiTextField from "../forms/MultiTextField";
import TextField from "../forms/TextField";

type CustomData = {
  prompt: string;
  choices: string[];
};

const Choice: CustomNode<CustomData> = function (props: NodeProps<CustomData>) {
  const updateNodeInternals = useUpdateNodeInternals();

  const { showConfig, configProps, wrapperProps, ConfigButton } =
    useConfigDialog(props);
  const [prompt, setPrompt] = useCustomDataItem({
    nodeProps: props,
    key: "prompt",
  });
  const [choices, setChoices] = useCustomDataItem({
    nodeProps: props,
    key: "choices",
  });
  useEffect(
    () => updateNodeInternals(props.id),
    [props.id, choices, updateNodeInternals]
  );

  return (
    <>
      <ConfigDialog display={showConfig}>
        <TextField
          label="Choices"
          placeholder="Option A"
          value={prompt}
          onChange={setPrompt}
        />
        <MultiTextField
          label="Choices"
          placeholder="Option A"
          values={choices}
          onChange={setChoices}
        />
      </ConfigDialog>

      <div
        className="react-flow__custom drop-shadow-md px-2 py-1 rounded-md bg-orange-100 border-2 border-gray-600 max-w- relative group"
        {...wrapperProps}
      >
        <ConfigButton {...configProps} />
        {/* Node body */}
        <div className="font-bold">Choices</div>
        <div className="text-gray-500 text-ellipsis overflow-hidden">
          &ldquo;{prompt}&rdquo;
        </div>
        {/* Node handles */}
        <Handle type="target" position={Position.Top} />{" "}
        {/* Wrapper for handles */}
        <div className="flex flex-row absolute w-full bottom-0 left-0 justify-around">
          {choices.map((cmd, i) => (
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
Choice.TypeKey = "stateChoice";
Choice.FriendlyName = "Choice";
Choice.Builder = (
  position: XYPosition,
  id?: string,
  prompt?: string,
  choices?: string[]
) => ({
  id: id ?? uuidv4(),
  position,
  data: {
    prompt: prompt ?? "Do you want to continue?",
    choices: choices ?? ["Yes", "No"],
  },
  type: Choice.TypeKey,
});
Choice.Icon = Fork;

export default Choice;
