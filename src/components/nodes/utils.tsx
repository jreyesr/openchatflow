import { Connection, ReactFlowInstance } from "reactflow";

const isValidConnection = (flow: ReactFlowInstance, connection: Connection) => {
  const comingFrom = flow.getNode(connection.source as string)!;
  const goingTo = flow.getNode(connection.target as string)!;

  const fromIsState = comingFrom.type!.startsWith("state");
  const toIsState = goingTo.type!.startsWith("state");

  const outgoerIds = flow
    .getEdges()
    .filter(
      (e) =>
        e.source === connection.source &&
        e.sourceHandle === connection.sourceHandle
    )
    .map((e) => e.target);
  const outgoerNodes = flow.getNodes().filter((n) => outgoerIds.includes(n.id));
  const outgoerStateNodes = outgoerNodes.filter((n) =>
    n.type!.startsWith("state")
  );
  const noOutgoingStates = outgoerStateNodes.length === 0;

  // state -> state only allowed if there are none yet
  // state -> anything is always allowed
  if (fromIsState) return toIsState ? noOutgoingStates : true;

  // no other transitions are possible
  return false;
};

export { isValidConnection };
