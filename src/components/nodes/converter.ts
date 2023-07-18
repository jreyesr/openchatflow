import type {
  CustomNode,
  ConversationContext,
  ConversationEvent,
  ConversationState,
} from "@/types";
import { Node, Edge } from "reactflow";
import { createMachine, type StateMachine } from "xstate";
import { groupBy } from "./utils";

/**
 * ActionFunctions are called by states (on enter or exit) or by transitions (when traversing).
 *
 * Actions receive the context, the event and the actual action. They can perform any async actions, but can't
 * stop or alter the state machine's execution flow.
 *
 * For more information, see https://stately.ai/docs/xstate/actions/
 */
type ActionFunction = (
  context: any,
  event: any,
  actionMeta: { action: any }
) => void;

/**
 * GuardFunctions are called by guarded transitions
 * and they determine if a particular transition branch is taken or not.
 *
 * Guards receive the context, the event and the actual condition; and must return a boolean
 * indicating whether or not the transition must be taken.
 *
 * For more information, see https://stately.ai/docs/xstate/transitions-and-choices/guards
 */
type GuardFunction = (
  _context: any,
  event: any,
  guardMeta: { cond: any }
) => boolean;

/** Tries to find a node in the list whose ID is __start__, which is guaranteed by the Reactflow code
 * to be the one and only initial node. There can only be one, and since the Reactflow editor doesn't allow
 * it to be deleted AND inserts it on every new Conversation, it should always exist
 */
function findFirstNode(nodes: Node[]): Node {
  return nodes.find((n) => n.id === "__start__")!;
}

/** Tries to find a node by its ID in an array of nodes. Expects the node to exist, and will explode otherwise */
function nodeById(nodes: Node[], id: string): Node {
  return nodes.find((n) => n.id === id)!;
}

/**
 * `nodeToAction` converts a node, if it is an async action node, to a function that performs the operation
 * that the node represents. For example, a Webhook node is transformed to a function that calls the API that
 * was configured in the node.
 *
 * Note that whatever operation isn't really performet in this function. This function merely creates and returns a function object
 * that, when called, performs its action. In that sense, it's a higher-orden function that returns a ready-to-call
 * function.
 *
 * @param node An arbitrary Reactflow node
 * @returns `undefined` if the node is not an async action, or the {@link ActionFunction} that the node embodies,
 *  such as calling an external API
 */
function nodeToAction(node: Node<any>): ActionFunction | undefined {
  // ONLY Action nodes are converted here
  if (!node.type!.startsWith("action")) return undefined;

  switch (node.type) {
    case "actionWebhook":
      return (_context, event, { action }) => {
        console.log("WEBHOOKING!");
        console.log(event, action);
      };
    default:
      console.error(`Unknown node type ${node.type}!`);
      return undefined;
  }
}

/**
 * `nodeToState` tries to convert a node to a single state entry in the XState format. For example,
 * a Choice node will be converted into a node that:
 *
 * * on entry, fires off a message to the user (the Prompt configured in the editor)
 * * will only exit via a `messageIn` event, which is triggered when the application gets a message back from the user
 * * has its exit transitions (the `messageIn` transitions) guarded to check the user's message against the provided choices
 *
 * @param node An arbitrary Reactflow node
 * @param outgoingEdgesState A list of edges that go out from this node _to other state nodes_. Some state nodes
 *  (such as the Simple Message node) can only have one, but others (such as the Command and Choice nodes) may have more than one,
 *  since they can have multiple output branches
 * @param outgoingEdgesActions A list of edges that go out from this node to _async action nodes_.
 *  These appear in the visual editor as dashed lines. There can be many per node, since async actions aren't limited
 *  to at most one per output handle
 * @returns `undefined` if the node is not a state node, or
 *  the {@link https://xstate.js.org/docs/guides/statenodes.html#state-node-types | state specification}
 * that the node embodies
 */
function nodeToState(
  node: Node<any>,
  outgoingEdgesState: Edge[],
  outgoingEdgesActions: Edge[]
): any | undefined {
  // ONLY state nodes accepted here
  if (!node.type!.startsWith("state")) return undefined;

  // This is configuration common to all nodes. All branches of the `switch` below
  // add data to this object, and it is returned at the end
  let config: any = { meta: { nodeType: node.type } };

  let _actionsGroupedByHandle = groupBy(outgoingEdgesActions, "sourceHandle");
  // actionsGroupedByHandle is a dict. Keys are handle IDs, values are lists of target node IDs
  // For example, for a node with two handles,
  // where the first one has two async actions and the second one has one:
  // {1: ["action_id_1", "action_id_2"], 2: ["action_id_3"]}
  let actionsGroupedByHandle = Object.fromEntries(
    Object.entries(_actionsGroupedByHandle).map(([k, v]) => [
      k,
      (v as any[]).map((e) => e.target),
    ])
  );
  // allActions is a list of target node IDs, no matter the output handle
  // You can also think of it as all the VALUES of actionsGroupedByHandle, merged together in a single list
  let allActions = outgoingEdgesActions.map((e) => e.id);

  switch (node.type) {
    case "stateStart":
      config.always = outgoingEdgesState[0].target; // the start node should have exactly one outgoing node
      break;
    case "stateEnd":
      config.type = "final"; // mark end nodes as final for XState
      break;
    case "stateSimpleMsg":
      // Send the configured message on state entry
      config.entry = [{ type: "sendMessage", content: node.data.msg }];
      if (outgoingEdgesState.length > 0)
        config.always = {
          // message nodes exit immediately, they don't wait for user input
          target: outgoingEdgesState[0].target, // message nodes should have exactly one outgoing node
          actions: allActions,
        };

      break;
    case "stateCommand":
      const commandConditions = outgoingEdgesState.map((e) => ({
        target: e.target,
        cond: {
          type: "messageEquals",
          matcher: node.data.commands[e.sourceHandle!], // payload to the matcher
        },
        actions: actionsGroupedByHandle[e.sourceHandle!] ?? [],
      }));
      config.on = { messageIn: commandConditions };

      break;
    case "statePrompt":
      config.on = {
        messageIn: {
          // unlike the Choice node just below, this one needs no conditions since prompts accept anything back from the user
          target: outgoingEdgesState[0].target, // prompt nodes should have exactly one outgoing node
          actions: allActions,
        },
      };
      // Send the configured prompt on state entry
      config.entry = [{ type: "sendMessage", content: node.data.prompt }];

      break;
    case "stateChoice":
      const choiceConditions = outgoingEdgesState.map((e) => ({
        target: e.target,
        cond: {
          type: "messageEquals",
          matcher: node.data.choices[e.sourceHandle!], // payload to the matcher
        },
        actions: actionsGroupedByHandle[e.sourceHandle!] ?? [],
      }));
      config.on = { messageIn: choiceConditions };
      // Send the configured prompt on state entry
      config.entry = [{ type: "sendMessage", content: node.data.prompt }];

      break;
    default:
      console.error(`Unknown node type ${node.type}!`);
      return undefined;
  }

  return config;
}

export function convert(
  machineId: string,
  nodes: Node[],
  edges: Edge[]
): StateMachine<ConversationContext, ConversationState, ConversationEvent> {
  const stateObject: { [k in string]: any } = {};
  for (const n of nodes as Node<any>[]) {
    const outgoingEdges = edges.filter((e) => e.source === n.id);
    // outgoingStates are edges that go out from the current node to state nodes
    const outgoingStates = outgoingEdges.filter((e) =>
      nodeById(nodes, e.target).type?.startsWith("state")
    );
    // outgoingActions are edges that go out from the current node to async action nodes
    const outgoingActions = outgoingEdges.filter((e) =>
      nodeById(nodes, e.target).type?.startsWith("action")
    );
    const state = nodeToState(n, outgoingStates, outgoingActions);
    if (state === undefined) continue; // Pass over nodes that don't map to states, such as action nodes
    stateObject[n.id] = state; // Stick this node in the nodes object, keyed by the node's ID
  }

  console.log({
    id: machineId,
    initial: findFirstNode(nodes).id,
    states: stateObject,
    predictableActionArguments: true,
  });

  // Now create the actions:
  // * sendMessage(content) is used from some nodes
  // * One for each action node, such as Webhooks. These actions' IDs must be the node's IDs as assigned by Reactflow
  let actions: { [k: string]: ActionFunction } = {
    // NOTE: states that invoke the `sendMessage` action MUST provide it with a `content` property!
    // This will be used as the message that will be sent to the user
    sendMessage: (_context, event, { action }) => {
      console.log(event, action);
    },
  };
  for (const n of nodes as Node<any>[]) {
    const asAction = nodeToAction(n);
    if (asAction === undefined) continue; // Pass over nodes that don't convert to actions, such as state nodes
    actions[n.id] = asAction; // Stick this action in the actions object, keyed by the node's ID
  }
  console.debug(actions);

  // Crete the guards
  // * messageEquals => {cond}.matcher must === event.text
  let guards: { [k: string]: GuardFunction } = {
    // NOTE: guards that invoke the `messageEquals` condition MUST provide it with a `matcher` property!
    // `messageEquals` MUST be called from a `messageIn` event, since only there it will have access to the message's text
    messageEquals: (_context, event, { cond }) => event.text === cond.matcher,
  };

  const userMachine = createMachine<
    ConversationContext,
    ConversationEvent,
    ConversationState
  >(
    {
      id: machineId,
      initial: findFirstNode(nodes).id,
      states: stateObject,
      predictableActionArguments: true, // This is recommended for v4-v5 consistency: https://xstate.js.org/docs/guides/actions.html#api
    },
    {
      actions,
      guards,
    }
  );

  return userMachine;
}
