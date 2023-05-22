import { DateTime } from "luxon";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import Pencil from "@/icons/pencil.svg";
import Add from "@/icons/add.svg";

export default async function DesignList() {
  const flows = await prisma.conversationTemplate.findMany({
    orderBy: { createdAt: "desc" },
  }); // List all flows for now

  return (
    <>
      <div className="overflow-hidden border rounded-xl shadow-sm">
        <table className="w-full border-collapse text-left ">
          <thead className="text-gray-700 uppercase bg-gray-50">
            <tr className="divide-x">
              <th className="px-4 py-4">Name</th>
              <th className="px-4 py-4">Description</th>
              <th className="px-4 py-4">Created at</th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y border-t">
            {flows.map((f) => (
              <tr key={f.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{f.title}</td>
                <td className="px-4 py-3">{f.description}</td>
                <td className="px-4 py-3">
                  <span title={f.createdAt.toISOString()}>
                    {DateTime.fromJSDate(f.createdAt).toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-4">
                    <Link
                      href={`/design/${f.id}`}
                      className="rounded-full hover:bg-gray-200 p-2"
                      title="Edit"
                      prefetch={false} // Don't prefetch on page load, it puts extra load on the DB
                    >
                      <Pencil className="w-6 h-6" />{" "}
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link
        href="/design/new"
        className="rounded-xl bg-orange-600 mx-auto max-w-[15rem] my-4 p-3 text-center flex items-center justify-center font-bold gap-3"
        prefetch={false}
      >
        <Add className="w-8 h-8" />
        New conversation
      </Link>
    </>
  );
}
