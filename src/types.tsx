import { FunctionComponent } from "react";
import { Node, NodeProps, XYPosition } from "reactflow";

export interface CustomNode<T> extends Node<T> {
  (props: NodeProps<T>): JSX.Element;
  TypeKey: string;
  Builder: (position: XYPosition, ...extras: any[]) => Node<T>;
  FriendlyName: string;
  Icon: FunctionComponent<any>;
}

export interface ConversationContext {
  status: "running" | "success" | "error";
  context: any;
}

export type Message = {
  messageId: number;
  from: {
    id: number;
    isBot: boolean;
    firstName: string;
    lastName?: string;
    username?: string;
    language?: string;
  };
  dateEpoch: number;
  chat: {
    id: number;
    type: "private" | "group" | "supergroup";
    title?: string;
    username?: string;
  };
};

export type TextMessage = Message & { text: string };

export type ConversationEvent = { type: "MESSAGE_IN"; message: TextMessage };

export type ConversationState = {
  value: string;
  context: ConversationContext;
};
