import RecentMessagesTable from "@/components/recent_msgs_table";

export default function Home() {
  return (
    <main className="grid md:grid-cols-2 grid-cols-1 md:gap-16 gap-4">
      <div className="grid grid-cols-3 place-items-stretch gap-4 md:h-0">
        <div className="p-4 min-w-full mx-auto bg-white rounded-xl shadow-lg flex flex-col items-center space-y-1 hover:bg-sky-100">
          <div className="">
            {/* Check Circle */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="36"
              viewBox="0 96 960 960"
              width="36"
              className="fill-green-500"
            >
              <path d="m421 758 283-283-46-45-237 237-120-120-45 45 165 166Zm59 218q-82 0-155-31.5t-127.5-86Q143 804 111.5 731T80 576q0-83 31.5-156t86-127Q252 239 325 207.5T480 176q83 0 156 31.5T763 293q54 54 85.5 127T880 576q0 82-31.5 155T763 858.5q-54 54.5-127 86T480 976Zm0-60q142 0 241-99.5T820 576q0-142-99-241t-241-99q-141 0-240.5 99T140 576q0 141 99.5 240.5T480 916Zm0-340Z" />
            </svg>
          </div>

          <div className="text-xl font-medium text-green-600">Success</div>
          <div className="text-xl font-medium text-green-600">8</div>
        </div>

        <div className="p-4 min-w-full mx-auto bg-white rounded-xl shadow-lg flex flex-col items-center space-y-1 hover:bg-sky-100">
          <div className="">
            {/* Pause Circle */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="36"
              viewBox="0 96 960 960"
              width="36"
              className="fill-orange-500"
            >
              <path d="M370 736h60V416h-60v320Zm160 0h60V416h-60v320Zm-50 240q-82 0-155-31.5t-127.5-86Q143 804 111.5 731T80 576q0-83 31.5-156t86-127Q252 239 325 207.5T480 176q83 0 156 31.5T763 293q54 54 85.5 127T880 576q0 82-31.5 155T763 858.5q-54 54.5-127 86T480 976Zm0-60q142 0 241-99.5T820 576q0-142-99-241t-241-99q-141 0-240.5 99T140 576q0 141 99.5 240.5T480 916Zm0-340Z" />
            </svg>
          </div>
          <div className="text-xl font-medium text-orange-600">Disabled</div>
          <div className="text-xl font-medium text-orange-600">1</div>
        </div>

        <div className="p-4 min-w-full mx-auto bg-white rounded-xl shadow-lg flex flex-col items-center space-y-1 hover:bg-sky-100">
          <div className="">
            {/* Report (octagon with exclamation sign) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="36"
              viewBox="0 96 960 960"
              width="36"
              className="fill-red-500"
            >
              <path d="M480 775q14 0 24.5-10.5T515 740q0-14-10.5-24.5T480 705q-14 0-24.5 10.5T445 740q0 14 10.5 24.5T480 775Zm-30-144h60V368h-60v263ZM330 936 120 726V426l210-210h300l210 210v300L630 936H330Zm25-60h250l175-175V451L605 276H355L180 451v250l175 175Zm125-300Z" />
            </svg>
          </div>

          <div className="text-xl font-medium text-red-600">Error</div>
          <div className="text-xl font-medium text-red-600">3</div>
        </div>
      </div>

      <RecentMessagesTable />
    </main>
  );
}
