import ConfigButton from "@/components/ConfigButton";
import { useEffect, useState } from "react";
import { NodeProps, useReactFlow } from "reactflow";

export default function useConfigDialog(node: NodeProps) {
  const flow = useReactFlow();

  const [showConfig, setShowConfig] = useState(false);

  // Called when node's config button is clicked
  const onShowConfigClicked = () => {
    // 1. Force select the current node
    flow.setNodes((nds) =>
      nds.map((n) => {
        // Only select the current node, deselect everything else
        const isThisNode = n.id === node.id;
        n.selected = isThisNode;
        return n;
      })
    );
    // 2. Toggle dialog
    setShowConfig(!showConfig);
  };

  // Helper: Hide the config dialog when the node is deselected
  useEffect(() => {
    if (!node.selected) setShowConfig(false);
  }, [node.selected]);

  const configProps = {
    showConfig,
    onShowConfig: onShowConfigClicked,
  };

  // Helper: also return a reference to the actual ConfigButton component!
  return { ConfigButton, configProps, ...configProps };
}
