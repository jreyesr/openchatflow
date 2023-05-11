import { Connection, ReactFlowInstance, getOutgoers } from "reactflow";

const isValidConnection = (flow: ReactFlowInstance, connection: Connection) => {
  const comingFrom = flow.getNode(connection.source as string)!;
  const goingTo = flow.getNode(connection.target as string)!;

  const fromIsState = comingFrom.type!.startsWith("state");
  const toIsState = goingTo.type!.startsWith("state");

  const noOutgoingStates =
    getOutgoers(comingFrom, flow.getNodes(), flow.getEdges()).filter((n) =>
      n.type!.startsWith("state")
    ).length == 0;

  // state -> state only allowed if there are none yet
  // state -> anything is always allowed
  if (fromIsState) return toIsState ? noOutgoingStates : true;

  // no other transitions are possible
  return false;
};

export { isValidConnection };
