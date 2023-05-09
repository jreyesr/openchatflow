import { NodeProps, Panel } from "reactflow";
import NodeList from "./NodeList";

import Close from "@/icons/close.svg";

const titles: { [k in ChooserFamily]: string } = {
  state: "Choose a state node",
  action: "Choose an async action",
};

type ChooserFamily = "state" | "action";
type Props = {
  type: ChooserFamily;
  onHide: () => void;
  nodeTypes: { [k in string]: (props: NodeProps) => JSX.Element };
};

export default function NodeChooserPopup(props: Props) {
  // Choose the nodes that are of the currently active type
  const candidateNodes = Object.fromEntries(
    Object.entries(props.nodeTypes).filter(([k, _]) => k.startsWith(props.type))
  );

  return (
    <Panel
      position="top-center"
      // style={{ top: 10 }}
      className="w-full h-full !m-0"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-300 bg-opacity-50"
        onClick={props.onHide}
      />
      <div className="absolute flex flex-col gap-6 mx-auto w-1/3 left-0 right-0 top-10 bg-white h-5/6 rounded-lg p-6 border border-gray-400">
        <div className="font-bold text-base flex-grow-0">
          {titles[props.type]}
        </div>
        <NodeList nodes={candidateNodes} />
        <button
          className="absolute top-6 right-6"
          onClick={() => props.onHide()}
        >
          <Close width={20} height={20} />
        </button>
      </div>
    </Panel>
  );
}
