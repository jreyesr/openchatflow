import { useReactFlow, Node, NodeProps } from "reactflow";

export default function useCustomDataItem<Type, Key extends keyof Type>(props: {
  nodeProps: NodeProps<Type>;
  key: Key;
}): [Type[Key], (newData: Type[Key]) => void] {
  const flow = useReactFlow();

  const setData = (newData: Type[Key]) => {
    flow.setNodes((nds) =>
      nds.map((n) => {
        // Change the data on the current node
        if (n.id === props.nodeProps.id) {
          // NOTE You have to set the entire data object, otherwise it doesn't refresh
          // See https://reactflow.dev/docs/examples/nodes/update-node/
          n.data = {
            ...n.data,
            [props.key]: newData,
          };
        }
        return n;
      })
    );
  };

  return [props.nodeProps.data[props.key], setData];
}
