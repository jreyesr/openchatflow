import { CustomNode } from "@/types";
import { FunctionComponent } from "react";

function SingleNode(props: {
  nodeType: string;
  name: string;
  icon: FunctionComponent<any>;
}) {
  const onDragStart = (
    event: React.DragEvent,
    nodeType: string,
    icon: FunctionComponent
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className="flex flex-col items-center justify-between p-2 rounded cursor-move bg-white hover:bg-gray-100 hover:-translate-y-0.5 transition delay-100 duration-200"
      onDragStart={(event) => onDragStart(event, props.nodeType, props.icon)}
      draggable
    >
      {props.icon({ width: 32, height: 32 })}
      <span className="font-semibold text-center">{props.name}</span>
    </div>
  );
}

type Props = {
  nodes: { [k in string]: CustomNode<any> };
};

export default function NodeList(props: Props) {
  return (
    <div className="grid grid-cols-3 gap-2 overflow-auto">
      {Object.entries(props.nodes).map(([k, v]) => (
        // {dummyNodes.map(([k, v]) => (
        <SingleNode key={k} nodeType={k} name={v.FriendlyName} icon={v.Icon} />
      ))}
    </div>
  );
}
