import { FunctionComponent } from "react";
import { Node, NodeProps, XYPosition } from "reactflow";

export interface CustomNode<T> {
  (props: NodeProps<T>): JSX.Element;
  TypeKey: string;
  Builder: (position: XYPosition, ...extras: any[]) => Node<T>;
  FriendlyName: string;
  Icon: FunctionComponent<any>;
}
