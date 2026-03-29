import React from "react";

/**
 * @param {{ key: string, header: React.ReactNode, className?: string, render?: (row: any) => React.ReactNode }[]} columns
 */
export default function Table({ columns, rows, keyExtractor, emptyMessage = "No data." }) {
  if (!rows?.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/80 px-4 py-10 text-center text-sm text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="min-w-full divide-y divide-gray-100 text-left text-sm">
        <thead className="bg-gradient-to-r from-amber-50 to-orange-50/80">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={`whitespace-nowrap px-4 py-3 font-semibold text-gray-700 ${col.className ?? ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 bg-white">
          {rows.map((row) => (
            <tr key={keyExtractor(row)} className="hover:bg-gray-50/80">
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3 text-gray-800 ${col.className ?? ""}`}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
