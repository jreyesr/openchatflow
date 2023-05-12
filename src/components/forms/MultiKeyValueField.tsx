import Trash from "@/icons/trash.svg";
import Add from "@/icons/add.svg";

export default function MultiKeyValueField(props: {
  label: string;
  placeholderKey: string;
  placeholderVal: string;
  values: { k: string; v: string }[];
  onChange: (newVals: { k: string; v: string }[]) => void;
}) {
  // NOTE: On these event handlers, ensure that you create new state objects to pass them to the parent listener
  // Not doing so (e.g., reusing old arrays) causes weird non-update bugs
  // For instance, on onChange, don't just do props.values[i][field] = newVal
  // Instead, copy the entire array, then also copy the changed object and set the new value there

  const onChange = (i: number, field: "k" | "v", newVal: string) => {
    const newVals = [...props.values];
    newVals[i] = { ...props.values[i], [field]: newVal };
    props.onChange(newVals);
  };
  const onAdd = (field: "k" | "v", newVal: string) => {
    let newEntry: { k: string; v: string };
    switch (field) {
      case "k":
        newEntry = { k: newVal, v: "" };
        break;
      case "v":
        newEntry = { v: newVal, k: "" };
        break;
    }
    const newVals = [...props.values, newEntry];
    props.onChange(newVals);
  };
  const onDelete = (i: number) => {
    const newVals = [...props.values];
    newVals.splice(i, 1); // Pop element at position i
    props.onChange(newVals);
  };

  return (
    <label className="block">
      <span className="text-gray-700">{props.label}</span>

      {props.values.map(({ k, v }, i) => (
        <div className="flex flex-row gap-2 w-full" key={i}>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-opacity-50"
            placeholder={props.placeholderKey}
            value={k}
            onChange={(e) => onChange(i, "k", e.target.value)}
          />
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-opacity-50"
            placeholder={props.placeholderVal}
            value={v}
            onChange={(e) => onChange(i, "v", e.target.value)}
          />
          <button onClick={() => onDelete(i)}>
            <Trash className="w-5 h-5 min-w-[1.5rem] fill-red-500" />
          </button>
        </div>
      ))}

      {/* Button to add new KV entry */}
      <div className="flex flex-row gap-2 justify-end">
        <button onClick={(e) => onAdd("k", "")}>
          <Add className="w-6 h-6" />
        </button>
      </div>
    </label>
  );
}
