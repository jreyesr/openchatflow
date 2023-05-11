import { Handle, NodeProps, Position, XYPosition } from "reactflow";
import { v4 as uuidv4 } from "uuid";

import WebhookIcon from "@/icons/webhook.svg";
import { CustomNode } from "@/types";
import ConfigDialog from "./ConfigDialog";
import useConfigDialog from "@/hooks/useConfigDialog";
import useCustomDataItem from "@/hooks/useCustomDataItem";

import TextField from "@/components/forms/TextField";
import Dropdown from "@/components/forms/Dropdown";

type CustomData = {
  url: string;
  method: "GET" | "POST";
  headers: { [k: string]: string };
  body: any;
};

const Webhook: CustomNode<CustomData> = function (
  props: NodeProps<CustomData>
) {
  const { showConfig, configProps, ConfigButton } = useConfigDialog(props);
  const [url, setUrl] = useCustomDataItem({ id: props.id, key: "url" });
  const [method, setMethod] = useCustomDataItem({
    id: props.id,
    key: "method",
  });

  return (
    <>
      <ConfigDialog display={showConfig}>
        <TextField
          label="URL"
          placeholder="Enter the target URL..."
          value={url}
          onChange={setUrl}
        />
        <Dropdown
          label="Method"
          options={["GET", "POST"]}
          selected={method}
          onChange={setMethod}
        />
      </ConfigDialog>

      <div className="react-flow__custom drop-shadow-md px-2 py-1 rounded-md bg-green-100 border-2 border-gray-600 max-w- relative group">
        <ConfigButton {...configProps} />

        {/* Node body */}
        <div className="font-bold">{props.data.method} request</div>
        <div className="text-gray-500 text-ellipsis whitespace-nowrap overflow-hidden">
          ↝ {props.data.url}
        </div>

        {/* Node handles */}
        <Handle type="target" position={Position.Top} />
      </div>
    </>
  );
} as CustomNode<CustomData>;

Webhook.TypeKey = "actionWebhook";
Webhook.FriendlyName = "Webhook";
Webhook.Icon = WebhookIcon;
Webhook.Builder = (position: XYPosition, id?: string) => ({
  id: id ?? uuidv4(),
  position,
  data: {
    url: "",
    method: "POST",
    headers: {},
    body: {},
  },
  type: Webhook.TypeKey,
});

export default Webhook;
