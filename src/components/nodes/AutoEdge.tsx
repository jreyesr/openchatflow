import React from "react";
import { BaseEdge, EdgeProps, getBezierPath, useReactFlow } from "reactflow";

/**
 * A custom Reactflow edge that changes its appearance depending on
 * whether it's connecting two main states or a state and an async action
 */
export default function AutoEdge({
  source,
  sourceX,
  sourceY,
  target,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerStart,
  markerEnd,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const flow = useReactFlow();
  const sourceNode = flow.getNode(source)!;
  const targetNode = flow.getNode(target)!;

  if (sourceNode.type!.startsWith("state")) {
    if (targetNode.type!.startsWith("state")) {
      // state -> state
      // Do nothing, default is OK
    } else {
      // state -> async action
      // Make line dashed
      style.strokeDasharray = "4";
    }
  }
  // any other combination shouldn't be possible

  return (
    <BaseEdge
      path={edgePath}
      markerStart={markerStart}
      markerEnd={markerEnd}
      style={style}
    />
  );
}
