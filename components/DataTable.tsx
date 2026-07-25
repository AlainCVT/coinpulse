import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const DataTable = <T,>(props: DataTableProps<T>) => {
  return (
    <Table className={cn("custom-scrollbar", props.tableClassName)}>
      <TableHeader className={props.headerClassName}>
        <TableRow className={cn("hover:bg-transparent", props.headerRowClassName)}>
          {props.columns.map((column, i) => (
            <TableHead
              key={`header-${i}`}
              className={cn("bg-dark-400 text-purple-100 py-4 first:pl-5 last:pr-5")}
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {props.data.map((row, i) => (
          <TableRow
            key={props.rowKey(row, i)}
            className={cn(
              "overflow-hidden rounded-lg border-b border-purple-100/5 hover:bg-dark-400/30!",
              props.bodyRowClassName,
            )}
          >
            {props.columns.map((column, j) => (
              <TableCell
                key={`column-${i}-${j}`}
                className={cn("py-4 first:pl-5 last:pr-5", props.bodyCellClassName)}
              >
                {column.cell(row, i)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DataTable;
