import { NodeResizer, Node, NodeProps, XYPosition } from "reactflow";
import { v4 as uuidv4 } from "uuid";

import "../styles/flow.css";

import Note from "@/icons/note.svg";
import { CustomNode } from "@/types";
import ConfigDialog from "./ConfigDialog";
import TextField from "../forms/TextField";
import useConfigDialog from "@/hooks/useConfigDialog";
import useCustomDataItem from "@/hooks/useCustomDataItem";

type CustomData = { content: string };

const NoteNode: CustomNode<CustomData> = function (
  props: NodeProps<CustomData>
) {
  const { showConfig, configProps, wrapperProps, ConfigButton } =
    useConfigDialog(props);
  const [content, setContent] = useCustomDataItem({
    nodeProps: props,
    key: "content",
  });

  return (
    <>
      <ConfigDialog display={showConfig}>
        <TextField
          label="Content"
          placeholder="Enter note's content..."
          value={content}
          onChange={setContent}
        />
      </ConfigDialog>

      {/* Node resizer handles */}
      <NodeResizer
        color="#ff0071"
        isVisible={props.selected}
        minWidth={100}
        minHeight={30}
        maxWidth={320} // 20rem = 320px = max-w-xs
      />

      <div
        className="react-flow__custom w-[inherit] h-[inherit] overflow-hidden drop-shadow-md px-2 py-1 rounded-md bg-sky-100 border-2 border-gray-600 relative group"
        {...wrapperProps}
      >
        <ConfigButton {...configProps} />

        {/* Node body */}
        <div className="text-ellipsis overflow-hidden">{content}</div>
      </div>
    </>
  );
} as CustomNode<CustomData>;

NoteNode.TypeKey = "utilNote";
NoteNode.Builder = function (
  position: XYPosition,
  id?: string,
  content?: string
): Node<CustomData> {
  return {
    id: id ?? uuidv4(),
    position: position,
    data: { content: content ?? "This is a note! Edit it as you wish" },
    zIndex: -1, // Make notes always stack behind other nodes!
    type: NoteNode.TypeKey,
  };
};
NoteNode.FriendlyName = "Note";
NoteNode.Icon = Note;

export default NoteNode;
