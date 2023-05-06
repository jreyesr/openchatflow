"use client";

import Link from "next/link";

export default function Topbar() {
  return (
    <>
      {/* Topbar */}
      <div className="sticky top-0 inset-x-0 z-20 bg-gradient-to-r from-sky-300 to-blue-300 px-4 sm:px-6 md:px-8 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center py-4 space-x-2">
          <Link
            className="text-sm font-bold rounded-full p-2 text-orange-700 hover:translate-y-0.5 transition duration-100"
            href="/"
          >
            Home
          </Link>
          <Link
            className="text-sm font-bold rounded-full p-2 text-orange-700 hover:translate-y-0.5 transition duration-100"
            href="/design"
          >
            Design
          </Link>
        </div>
      </div>
      {/* End Topbar  */}
    </>
  );
}
