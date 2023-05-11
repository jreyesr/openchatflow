import Tune from "@/icons/tune.svg";

export default function ConfigButton(props: { onShowConfig: () => void }) {
  return (
    <div
      className="absolute top-1 right-1 invisible group-hover:visible bg-white rounded-sm p-1 cursor-pointer nodrag border-2 border-orange-500"
      onClick={props.onShowConfig}
    >
      <Tune width={16} height={16} />
    </div>
  );
}
