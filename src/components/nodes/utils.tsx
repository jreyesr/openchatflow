import { Connection, ReactFlowInstance, getOutgoers } from "reactflow";

const isValidConnection = (flow: ReactFlowInstance, connection: Connection) => {
  const comingFrom = flow.getNode(connection.source as string)!;
  const outgoing = getOutgoers(
    comingFrom,
    flow.getNodes(),
    flow.getEdges()
  ).filter((n) => n.type?.startsWith("state"));
  // Only allow connection if there are no connections already present from this node to a state node
  return outgoing.length == 0;
};

export { isValidConnection };
