import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import DownloadBtn from "./DownloadBtn";
import DebouncedInput from "./DebouncedInput";
import { DownIcon, SearchIcon, UpIcon } from "../Icons/Icons";

const TanStackTable = ({ data, columns }) => {
  const [tableData] = useState(() => [...data]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data: tableData,
    columns: columns,
    state: {
      sorting: sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  function previousPage() {
    table.previousPage();
  }

  function nextPage() {
    table.nextPage();
  }

  function handleGoToPage(e) {
    let page = e.target.value ? Number(e.target.value) - 1 : 0;
    console.log("Pagee: ", page);
    if (page >= table.getPageCount()) {
      page = table.getPageCount() - 1;
    }
    table.setPageIndex(page);
  }

  return (
    <div className="p-2 max-w-5xl mx-auto text-black fill-gray-400">
      {/* Header */}
      <div className="flex justify-between mb-2">
        {/* Search Input */}
        <div className="w-full flex items-center gap-1">
          <SearchIcon />
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            className="p-2 bg-transparent outline-none border-b-2 w-1/5 focus:w-1/3 duration-300 border-indigo-500"
            placeholder="Search all columns..."
          />
        </div>
        {/* Download Button */}
        <DownloadBtn data={data} fileName={"peoples"} />
      </div>

      <table className="w-full text-left">
        <thead className="bg-indigo-500 text-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                // <th key={header.id} className="capitalize px-3.5 py-2">
                //   {flexRender(
                //     header.column.columnDef.header,
                //     header.getContext()
                //   )}
                // </th>
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="capitalize px-3.5 py-2 cursor-pointer"
                >
                  {header.isPlaceholder ? null : (
                    <div className="flex items-center">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <span className="w-4">
                        {
                          { asc: <UpIcon />, desc: <DownIcon /> }[
                            header.column.getIsSorted() ?? null
                          ]
                        }
                      </span>
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row, i) => (
              <tr
                key={row.id}
                className={`
                ${i % 2 === 0 ? "bg-gray-300" : "bg-gray-200"}
                `}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3.5 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr className="text-center h-32">
              <td colSpan={12}>No Recoard Found!</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* pagination */}
      <div className="flex items-center justify-end mt-2 gap-2">
        {/* Previous page */}
        <button
          onClick={previousPage}
          disabled={!table.getCanPreviousPage()}
          className="p-1 border border-gray-300 px-2 disabled:opacity-30"
        >
          {"<"}
        </button>

        {/* Page info */}
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {/* Current page */}
            {table.getState().pagination.pageIndex + 1} of
            {/* Total page */}
            {table.getPageCount()}
          </strong>
        </span>

        {/* Next Page */}
        <button
          onClick={nextPage}
          disabled={!table.getCanNextPage()}
          className="p-1 border border-gray-300 px-2 disabled:opacity-30"
        >
          {">"}
        </button>

        {/* Go to page input */}
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={handleGoToPage}
            className="border p-1 rounded w-16 bg-transparent"
          />
        </span>

        {/* Show per page */}
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
          className="p-2 bg-transparent"
        >
          {[10, 20, 30, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TanStackTable;
