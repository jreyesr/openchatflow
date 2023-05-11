export default function Dropdown(props: {
  label: string;
  options: string[];
  selected?: string;
  onChange: (newValue: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-gray-700">{props.label}</span>
      <select
        value={props.selected}
        onChange={(e) => props.onChange(e.target.value)}
        className="block w-full mt-1 text-sm rounded-md border-gray-300 shadow-sm focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-opacity-50"
      >
        {props.options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
