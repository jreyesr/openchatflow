type Props = {
  nodes: { [k in string]: any };
};

export default function NodeList(props: Props) {
  const dummyNodes: any[] = [].concat(
    ...Array(10).fill(Object.entries(props.nodes))
  );
  console.log(props.nodes);
  return (
    <div className="grid grid-cols-3 gap-2 overflow-auto">
      {/* {Object.entries(props.nodes).map(([k, v]) => ( */}
      {dummyNodes.map(([k, v]) => (
        <div
          className="flex items-center justify-between flex-col p-2 bg-white rounded hover:bg-gray-100 hover:-translate-y-0.5 transition delay-100 duration-200"
          key={k}
        >
          {v.Icon({ width: 32, height: 32 })}
          <span className="font-semibold text-center">{v.FriendlyName}</span>
        </div>
      ))}
    </div>
  );
}
