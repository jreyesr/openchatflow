import { useReactFlow } from "reactflow";

export default function useCustomDataItem(props: { id: string; key: string }) {
  const flow = useReactFlow();
  const node = flow.getNode(props.id)!;

  const setData = (newData: string) => {
    flow.setNodes((nds) =>
      nds.map((n) => {
        // Change the data on the current node
        if (n.id === props.id) {
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

  return [node.data[props.key], setData];
}
