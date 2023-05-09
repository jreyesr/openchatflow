import { Panel } from "reactflow";

type Props = {
  onAdd: (family: "state" | "action") => void;
};

export default function AddNodeFloatingButton(props: Props) {
  return (
    // Leave space for the minimap (150px height and 15px margin top&bottom = 180px, remove one margin)
    <Panel
      position="bottom-right"
      style={{ bottom: 165 }}
      className="flex flex-col-reverse gap-3 items-center group"
    >
      {/* Main FAB button */}
      <button className="first-letter:bottom-0 right-0 p-0 w-16 h-16 bg-orange-600 rounded-full hover:bg-orange-700 group-hover:rotate-45 active:shadow-lg shadow transition ease-in duration-200">
        <svg
          viewBox="0 0 20 20"
          enableBackground="new 0 0 20 20"
          className="w-8 h-8 group-hover:scale-110 inline-block transition-transform duration-200"
        >
          <path
            fill="white"
            d="M16,10c0,0.553-0.048,1-0.601,1H11v4.399C11,15.951,10.553,16,10,16c-0.553,0-1-0.049-1-0.601V11H4.601
                                    C4.049,11,4,10.553,4,10c0-0.553,0.049-1,0.601-1H9V4.601C9,4.048,9.447,4,10,4c0.553,0,1,0.048,1,0.601V9h4.399
                                    C15.952,9,16,9.447,16,10z"
          />
        </svg>
      </button>

      <button
        className="p-0 w-12 h-12 hidden group-hover:block rounded-full bg-gray-200 hover:bg-gray-300 active:shadow-lg shadow transition ease-in duration-200"
        onClick={() => props.onAdd("state")}
      >
        {/* Material Design's Chat Bubble icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 96 960 960"
          className="w-5 h-5 inline-block"
        >
          <path d="M80 976V236q0-23 18-41.5t42-18.5h680q23 0 41.5 18.5T880 236v520q0 23-18.5 41.5T820 816H240L80 976Zm60-145 75-75h605V236H140v595Zm0-595v595-595Z" />
        </svg>
      </button>

      <button
        className="p-0 w-12 h-12 hidden group-hover:block rounded-full bg-gray-200 hover:bg-gray-300 active:shadow-lg shadow transition ease-in duration-200"
        onClick={() => props.onAdd("action")}
      >
        {/* Material Design's Bolt icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 96 960 960"
          className="w-5 h-5 inline-block"
        >
          <path d="m393 891 279-335H492l36-286-253 366h154l-36 255Zm-73 85 40-280H160l360-520h80l-40 320h240L400 976h-80Zm153-395Z" />
        </svg>
      </button>
    </Panel>
  );
}
