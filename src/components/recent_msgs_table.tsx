"use client";

export default function RecentMessagesTable() {
  return (
    <div>
      <p className="text-xl pb-2">Recent Messages</p>
      <div className="border rounded-xl relative overflow-x-auto">
        <table className="table-auto w-full">
          <thead className="text-gray-700 uppercase bg-gray-50">
            <tr className="divide-x text-left">
              <th className="px-4 py-1">Time</th>
              <th className="px-4 py-1">User</th>
              <th className="px-4 py-1">Message</th>
              <th className="px-4 py-1">Bot</th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-4 py-1">1 hour ago</td>
              <td className="px-4 py-1">John Doe</td>
              <td className="px-4 py-1">Hello!</td>
              <td className="px-4 py-1">First Bot</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-1">2 hours ago</td>
              <td className="px-4 py-1">John Doe</td>
              <td className="px-4 py-1">ping</td>
              <td className="px-4 py-1">First Bot</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-1">2 hours ago</td>
              <td className="px-4 py-1">John Doe</td>
              <td className="px-4 py-1">Hello!</td>
              <td className="px-4 py-1">First Bot</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-1">2 hours ago</td>
              <td className="px-4 py-1">John Doe</td>
              <td className="px-4 py-1">Hello!</td>
              <td className="px-4 py-1">First Bot</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-1">2 hours ago</td>
              <td className="px-4 py-1">John Doe</td>
              <td className="px-4 py-1">Hello!</td>
              <td className="px-4 py-1">First Bot</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
