import Trash from "@/icons/trash.svg";
import Add from "@/icons/add.svg";

export default function MultiTextField(props: {
  label: string;
  placeholder: string;
  values: string[];
  onChange: (newVals: string[]) => void;
}) {
  const onChange = (i: number, newVal: string) => {
    const newVals = [...props.values];
    newVals[i] = newVal;
    props.onChange(newVals);
  };
  const onAdd = (newVal: string) => {
    const newVals = [...props.values, newVal];
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

      {props.values.map((v, i) => (
        <div className="flex flex-row gap-2 w-full" key={i}>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-opacity-50"
            placeholder={props.placeholder}
            value={v}
            onChange={(e) => onChange(i, e.target.value)}
          />
          <button onClick={() => onDelete(i)}>
            <Trash className="w-5 h-5 min-w-[1.5rem] fill-red-500" />
          </button>
        </div>
      ))}

      {/* Button to add new text entry */}
      <div className="flex flex-row gap-2 justify-end">
        <button onClick={(e) => onAdd("")}>
          <Add className="w-6 h-6" />
        </button>
      </div>
    </label>
  );
}
