import { Handle, NodeProps, Position, XYPosition } from "reactflow";
import { v4 as uuidv4 } from "uuid";

import WebhookIcon from "@/icons/webhook.svg";
import { CustomNode } from "@/types";
import ConfigDialog from "./ConfigDialog";
import useConfigDialog from "@/hooks/useConfigDialog";
import useCustomDataItem from "@/hooks/useCustomDataItem";

import TextField from "@/components/forms/TextField";
import Dropdown from "@/components/forms/Dropdown";
import MultiKeyValueField from "@/components/forms/MultiKeyValueField";

type CustomData = {
  url: string;
  method: "GET" | "POST";
  headers: { k: string; v: string }[];
  body: { k: string; v: string }[];
};

const Webhook: CustomNode<CustomData> = function (
  props: NodeProps<CustomData>
) {
  const { showConfig, configProps, ConfigButton } = useConfigDialog(props);
  const [url, setUrl] = useCustomDataItem({ nodeProps: props, key: "url" });
  const [method, setMethod] = useCustomDataItem({
    nodeProps: props,
    key: "method",
  });
  const [headers, setHeaders] = useCustomDataItem({
    nodeProps: props,
    key: "headers",
  });
  const [body, setBody] = useCustomDataItem({ nodeProps: props, key: "body" });

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
        <MultiKeyValueField
          label="Headers"
          placeholderKey="Header"
          placeholderVal="Value"
          values={headers}
          onChange={setHeaders}
        />
        <MultiKeyValueField
          label="Body"
          placeholderKey="Key"
          placeholderVal="Value"
          values={body}
          onChange={setBody}
        />
      </ConfigDialog>

      <div className="react-flow__custom drop-shadow-md px-2 py-1 rounded-md bg-green-100 border-2 border-gray-600 max-w- relative group">
        <ConfigButton {...configProps} />

        {/* Node body */}
        <div className="font-bold">{method} request</div>
        <div className="text-gray-500 text-ellipsis whitespace-nowrap overflow-hidden">
          ↝ {url}
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
    headers: [],
    body: [],
  },
  type: Webhook.TypeKey,
});

export default Webhook;
