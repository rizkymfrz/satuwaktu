import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react-native";
import { useMemo, useState } from "react";
import { View } from "react-native";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type RowData,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Text } from "@/components/ui/text";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
  }
}

type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

const DATA: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@example.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@example.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@example.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@example.com",
  },
];

function DataTableDemo() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [lastAction, setLastAction] = useState<string>();
  const columns = useMemo<ColumnDef<Payment>[]>(
    () => [
      {
        id: "select",
        meta: { className: "min-w-14 flex-none" },
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Text className="capitalize">{row.getValue("status")}</Text>
        ),
      },
      {
        accessorKey: "email",
        meta: { className: "min-w-52" },
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            className="self-start"
            onPress={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <Text>Email</Text>
            <Icon as={ArrowUpDown} size={16} />
          </Button>
        ),
        cell: ({ row }) => (
          <Text className="lowercase">{row.getValue("email")}</Text>
        ),
      },
      {
        accessorKey: "amount",
        header: () => <Text className="text-right font-head">Amount</Text>,
        cell: ({ row }) => {
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(row.getValue<number>("amount"));
          return <Text className="text-right font-medium">{formatted}</Text>;
        },
      },
      {
        id: "actions",
        meta: { className: "min-w-14 flex-none" },
        enableHiding: false,
        cell: ({ row }) => {
          const payment = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-xs" aria-label="Open menu">
                  <Icon as={MoreHorizontal} size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem
                    onPress={() => setLastAction(`Copied ${payment.id}`)}
                  >
                    <Text>Copy payment ID</Text>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onPress={() => setLastAction(`Customer ${payment.email}`)}
                  >
                    <Text>View customer</Text>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onPress={() => setLastAction(`Details ${payment.id}`)}
                  >
                    <Text>View payment details</Text>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [],
  );
  const table = useReactTable({
    data: DATA,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: { pagination: { pageSize: 3 } },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  return (
    <View className="gap-4">
      <View className="flex-row items-start gap-2">
        <View className="mr-1 min-w-0 flex-1">
          <Input
            placeholder="Filter emails..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChangeText={(text) =>
              table.getColumn("email")?.setFilterValue(text)
            }
          />
        </View>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10">
              <Text>Columns</Text>
              <Icon as={ChevronDown} size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuGroup>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    <Text className="capitalize">{column.id}</Text>
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </View>
      <Table className="min-w-[600px]">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={header.column.columnDef.meta?.className}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} selected={row.getIsSelected()}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cell.column.columnDef.meta?.className}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="h-24 items-center">No results.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <View className="flex-row items-center justify-between gap-2">
        <Text variant="muted" className="flex-1">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </Text>
        <View className="flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            onPress={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <Text>Previous</Text>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onPress={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <Text>Next</Text>
          </Button>
        </View>
      </View>
      <Text variant="muted">{lastAction ?? "No action yet"}</Text>
    </View>
  );
}

export { DataTableDemo };
