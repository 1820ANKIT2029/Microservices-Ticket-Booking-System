import React from "react";

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
}

export function DataTable<T>({ columns, data, keyExtractor }: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/30">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`py-4 px-4 text-label-md font-bold text-on-surface-variant ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {data.map((row) => (
              <tr key={keyExtractor(row)} className="hover:bg-surface-container-lowest transition-colors">
                {columns.map((col, idx) => (
                  <td key={idx} className={`py-4 px-4 text-body-md text-on-surface ${col.className || ""}`}>
                    {typeof col.accessor === "function" ? col.accessor(row) : (row[col.accessor as keyof T] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
