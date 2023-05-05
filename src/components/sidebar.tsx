"use client";

import Link from "next/link";

export default function Topbar() {
  return (
    <>
      {/* Topbar */}
      <div className="sticky top-0 inset-x-0 z-20 bg-gradient-to-r from-sky-300 to-blue-300 px-4 sm:px-6 md:px-8 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center py-4 space-x-2">
          <Link
            className="rounded-full px-6 py-2 bg-orange-100 hover:bg-orange-200 hover:translate-y-1 transition duration-500"
            href="/"
          >
            Home
          </Link>
          <Link
            className="rounded-full px-6 py-2 bg-orange-100 hover:bg-orange-200 hover:translate-y-1 transition duration-500"
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
