"use client";

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

import Question from "@/icons/question.svg";
import { CustomNode } from "@/types";
import useCustomDataItem from "@/hooks/useCustomDataItem";
import useConfigDialog from "@/hooks/useConfigDialog";

import TextField from "@/components/forms/TextField";

type CustomData = { prompt: string };

const QuestionNode: CustomNode<CustomData> = function (
  props: NodeProps<CustomData>
) {
  const flow = useReactFlow();

  const { showConfig, configProps, wrapperProps, ConfigButton } =
    useConfigDialog(props);
  const [prompt, setPrompt] = useCustomDataItem({
    nodeProps: props,
    key: "prompt",
  });

  return (
    <>
      <ConfigDialog display={showConfig}>
        <TextField
          label="Question"
          placeholder="Enter a question..."
          value={prompt}
          onChange={setPrompt}
        />
      </ConfigDialog>

      <div
        className="react-flow__custom drop-shadow-md px-2 py-1 rounded-md bg-orange-100 border-2 border-gray-600 relative group"
        {...wrapperProps}
      >
        <ConfigButton {...configProps} />

        {/* Node body */}
        <div className="font-bold">Ask user</div>
        <div className="text-gray-500 text-ellipsis overflow-hidden">
          &ldquo;{prompt}&rdquo;
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

QuestionNode.TypeKey = "statePrompt";
QuestionNode.Builder = function (
  position: XYPosition,
  id?: string
): Node<CustomData> {
  return {
    id: id ?? uuidv4(), // If no ID provided, generate one at random
    position: position,
    data: { prompt: "What's your name?" },
    type: QuestionNode.TypeKey,
  };
};
QuestionNode.FriendlyName = "Question";
QuestionNode.Icon = Question;

export default QuestionNode;
