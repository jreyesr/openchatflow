export default function TextField(props: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (newValue: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-gray-700">{props.label}</span>
      <input
        type="text"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-opacity-50"
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </label>
  );
}
