import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";



interface TableSkeletonProps {
  isCheck?: boolean,
  loadMoreBtn?: boolean
  columns?: number,
  records?: number,
}

export default function TableSkeleton({
  isCheck = true,
  loadMoreBtn = true,
  columns = 7,
  records = 15,
}: TableSkeletonProps) {

  return (
    <Card className="max-h-fit h-full p-0">
      <Table className="w-full table-auto">
        <TableHeader className="sticky top-0 bg-background z-10">
          {isCheck && (
            <TableHead className="p-4 w-4">
              <Skeleton className="rounded-sm h-4 w-4" />
            </TableHead>
          )}
          <TableHead className="p-2 border-r" >
            <Skeleton className="h-4 w-20" />
          </TableHead>
          <TableHead className="p-2 border-r" >
            <Skeleton className="h-4 w-20" />
          </TableHead>
          <TableHead className="p-2 border-r" >
            <Skeleton className="h-4 w-20" />
          </TableHead>
          <TableHead className="p-2 border-r" >
            <Skeleton className="h-4 w-20" />
          </TableHead>
          <TableHead className="p-2 border-r" >
            <Skeleton className="h-4 w-20" />
          </TableHead>
          <TableHead className="p-2 border-r" >
            <Skeleton className="h-4 w-20" />
          </TableHead>
        </TableHeader>
        <TableBody>
          {Array.from({ length: records }, (_, index) => (
            <TableRow key={index}>
              {isCheck && (
                <TableHead className="p-4 w-4">
                  <Skeleton className="rounded-sm h-4 w-4" />
                </TableHead>
              )}
              {Array.from({ length: columns - 1 }, (_, index) => (
                <TableCell key={index} className="p-4">
                  <Skeleton className="h-4 w-20" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* botton */}
      {loadMoreBtn && (
        <div className="p-4">
          <Skeleton className="h-8 w-full" />
        </div>
      )}
    </Card>

  )
}