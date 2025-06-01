// components/ui/data-table.tsx
'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Input } from '@/components/ui/input';
import { TbArrowsDownUp } from 'react-icons/tb';
import { IoMdSearch } from 'react-icons/io';
import PaginationFooter from '@/components/pagination';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchableColumn?: string;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  customSearchInput?: React.ReactNode;
  pagination?: {
    currentPage: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
  };
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchableColumn,
  title,
  actions,
  customSearchInput,
  pagination,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  // Handle filtered + paginated data
  const filteredData = React.useMemo(() => {
    const column = searchableColumn;
    if (!column) return data;
    const filterValue = columnFilters.find((f) => f.id === column)
      ?.value as string;
    if (!filterValue) return data;
    return data.filter((item: any) =>
      String(item[column]).toLowerCase().includes(filterValue.toLowerCase()),
    );
  }, [data, columnFilters, searchableColumn]);

  const paginatedData = React.useMemo(() => {
    if (!pagination) return filteredData;
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    return filteredData.slice(startIndex, startIndex + pagination.itemsPerPage);
  }, [filteredData, pagination]);

  const table = useReactTable({
    data: paginatedData,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    manualPagination: true, // we handle pagination ourselves
  });

  return (
    <div className="flex flex-1 flex-col gap-4 p-5 pt-5">
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b pb-4">
        <div className="text-lg font-semibold">{title}</div>

        {/* Search & Actions */}
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4 w-full lg:w-auto">
          {customSearchInput ? (
            customSearchInput
          ) : searchableColumn ? (
            <div className="relative w-full lg:w-96">
              <IoMdSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
              <Input
                type="search"
                placeholder={`Search ${searchableColumn}`}
                value={
                  (table
                    .getColumn(searchableColumn)
                    ?.getFilterValue() as string) ?? ''
                }
                onChange={(event) =>
                  table
                    .getColumn(searchableColumn)
                    ?.setFilterValue(event.target.value)
                }
                className="pl-10"
              />
            </div>
          ) : null}
          {actions}
        </div>
      </div>

      {/* Table Content */}
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        onClick={header.column.getToggleSortingHandler()}
                        className="cursor-pointer select-none"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getIsSorted() && (
                          <TbArrowsDownUp className="inline ml-1" />
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-10"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      {pagination && (
        <PaginationFooter
          totalItems={filteredData.length}
          itemsPerPage={pagination.itemsPerPage}
          currentPage={pagination.currentPage}
          onPageChange={pagination.onPageChange}
        />
      )}
    </div>
  );
}
