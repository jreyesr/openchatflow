import React from "react";
import { BaseEdge, EdgeProps, getBezierPath, useReactFlow } from "reactflow";
import Command from "./Command";

/**
 * A custom Reactflow edge that changes its appearance depending on
 * whether it's connecting two main states or a state and an async action
 */
export default function AutoEdge({
  source,
  sourceHandleId,
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
  const [edgePath, labelX, labelY] = getBezierPath({
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
  const targetIsState = targetNode.type!.startsWith("state");

  if (sourceNode.type!.startsWith("state")) {
    if (targetIsState) {
      // state -> state
      // Do nothing, default is OK
    } else {
      // state -> async action
      // Make line dashed
      style.strokeDasharray = "4";
    }
  }
  // any other combination shouldn't be possible

  // Label (command -> other state) transitions
  let label = "";
  if (sourceNode.type === Command.TypeKey && targetIsState) {
    label = `-> ${sourceNode.data.commands[sourceHandleId!]}`;
  }

  return (
    <BaseEdge
      path={edgePath}
      markerStart={markerStart}
      markerEnd={markerEnd}
      style={style}
      label={label}
      labelX={labelX}
      labelY={labelY}
    />
  );
}
