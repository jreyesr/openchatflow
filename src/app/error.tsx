"use client"; // Error components must be Client Components

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2 className="text-red-400 font-bold">Something went wrong!</h2>
      <div className="mx-auto py-4">
        <details className="bg-white open:ring-1 open:ring-black/5 open:shadow-lg p-6 rounded-lg">
          <summary className="text-sm leading-6 text-slate-900 dark:text-white font-semibold select-none">
            Expand details
          </summary>
          <div className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400 select-all">
            <pre className="block">{error.message}</pre>
          </div>
        </details>
      </div>

      <button
        onClick={() => reset()}
        className="rounded bg-orange-200 p-4 font-semibold"
      >
        Try again?
      </button>
    </div>
  );
}
