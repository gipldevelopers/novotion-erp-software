import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
export function DataTable({ data, columns, searchable = true, searchKeys = [], pageSize = 10, onRowClick, emptyMessage = 'No data available', className, }) {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(pageSize);
    const filteredData = searchable
        ? data.filter((item) => searchKeys.some((key) => {
            const value = item[key];
            return String(value).toLowerCase().includes(search.toLowerCase());
        }))
        : data;
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
    const getValue = (item, key) => {
        if (typeof key === 'string' && key.includes('.')) {
            return key.split('.').reduce((obj, k) => {
                if (obj && typeof obj === 'object') {
                    return obj[k];
                }
                return undefined;
            }, item);
        }
        return item[key];
    };
    return (<div className={cn('space-y-4', className)}>
      {searchable && (<div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
            <Input placeholder="Search..." value={search} onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
            }} className="pl-10"/>
          </div>
          <Select value={String(itemsPerPage)} onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
            }}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 per page</SelectItem>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>)}

      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((column) => (<TableHead key={String(column.key)} className={column.className}>
                  {column.header}
                </TableHead>))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (<TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>) : (paginatedData.map((item) => (<TableRow key={item.id} className={cn('transition-colors', onRowClick && 'cursor-pointer hover:bg-muted/50')} onClick={() => onRowClick?.(item)}>
                  {columns.map((column) => (<TableCell key={String(column.key)} className={column.className}>
                      {column.render
                    ? column.render(item)
                    : String(getValue(item, column.key) ?? '')}
                    </TableCell>))}
                </TableRow>)))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (<div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of{' '}
            {filteredData.length} entries
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4"/>
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                const diff = Math.abs(page - currentPage);
                return diff === 0 || diff === 1 || page === 1 || page === totalPages;
            })
                .map((page, index, arr) => (<span key={page}>
                  {index > 0 && arr[index - 1] !== page - 1 && (<span className="px-2 text-muted-foreground">...</span>)}
                  <Button variant={currentPage === page ? 'default' : 'outline'} size="sm" onClick={() => setCurrentPage(page)}>
                    {page}
                  </Button>
                </span>))}
            <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
              <ChevronRight className="h-4 w-4"/>
            </Button>
          </div>
        </div>)}
    </div>);
}
