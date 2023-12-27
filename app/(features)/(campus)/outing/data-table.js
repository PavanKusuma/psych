"use client"

import * as React from "react"
import { ArrowDown, CalendarBlank } from 'phosphor-react'
import { addDays, format } from "date-fns"
import dayjs from 'dayjs'
import { DateRange } from "react-day-picker"
import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel
} from "@tanstack/react-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/app/components/ui/table"
import {
  Popover, PopoverContent, PopoverTrigger
} from "@/app/components/ui/popover"
import { cn } from "@/app/lib/utils"
import { Label } from "@/app/components/ui/label"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Calendar } from "@/app/components/ui/calendar"

export function DataTable({ columns, data, status, changeStatus, downloadNow, initialDates, dates }) {
  const [sorting, setSorting] = React.useState([]) // sorting
  const [columnFilters, setColumnFilters] = React.useState([]) // filtering
  const [rowSelection, setRowSelection] = React.useState([]) // for cell selection
  const [statusHere, setStatusHere] = React.useState(status)
  // Set the initial state using today's date
  // const [date1, setDate1] = React.useState({from: dayjs(),to: dayjs().add(20, 'day'),});
  const [date, setDate] = React.useState({from: new Date(initialDates.from.format('YYYY-MM-DD')), to: new Date(initialDates.to.format('YYYY-MM-DD'))})
  // const [date, setDate] = React.useState({from: new  Date(2023,10,20), to: addDays(new Date(2023,10,20),20)})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // pagination
    // sorting
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  })

  

  return (

    <div>
      

      {/* Filtered count */}
      {/* Filtered count */}
      {/* Filtered count */}
      {/* <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div> */}
      
      <div className={cn("grid gap-2")} style={{display:'flex', flexDirection:'column', alignItems:'start'}}>

          {/* Statuses as tabs */}
          {/* Statuses as tabs */}
          <Tabs defaultValue={statusHere} className="w-[400px]">
              <TabsList>
                <TabsTrigger value="All" onClick={()=>changeStatus('All')}>All</TabsTrigger>
                <TabsTrigger value="Submitted" onClick={()=>changeStatus('Submitted')}>Submitted</TabsTrigger>
                <TabsTrigger value="Approved" onClick={()=>changeStatus('Approved')}>Approved</TabsTrigger>
                <TabsTrigger value="Issued" onClick={()=>changeStatus('Issued')}>Issued</TabsTrigger>
                <TabsTrigger value="InOuting" onClick={()=>changeStatus('InOuting')}>InOuting</TabsTrigger>
                <TabsTrigger value="Returned" onClick={()=>changeStatus('Returned')}>Returned</TabsTrigger>
                <TabsTrigger value="Rejected" onClick={()=>changeStatus('Rejected')}>Rejected</TabsTrigger>
                <TabsTrigger value="Cancelled" onClick={()=>changeStatus('Cancelled')}>Cancelled</TabsTrigger>
              </TabsList>
              {/* <TabsContent value="All">Make changes to your account here.</TabsContent>
              <TabsContent value="Submitted">CZhange your password here.</TabsContent>
              <TabsContent value="Approved">CZhange your password here.</TabsContent>
              <TabsContent value="Issued">CZhange your password here.</TabsContent>
              <TabsContent value="InOuting">CZhange your password here.</TabsContent>
              <TabsContent value="Returned">CZhange your password here.</TabsContent>
              <TabsContent value="Rejected">CZhange your password here.</TabsContent>
              <TabsContent value="Cancelled">CZhange your password here.</TabsContent> */}
            </Tabs>
     </div>


      {/* search input for filtering columns */}
      {/* search input for filtering columns */}
      {/* search input for filtering columns */}
      <div className="flex items-center py-2" style={{display:'flex', justifyContent:'space-between'}}>
        <Input
          placeholder="Filter students by CollegeId"
          value={(table.getColumn("collegeId")?.getFilterValue()) ?? ""}
          onChange={(event) =>
            table.getColumn("collegeId")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="gap-2" style={{display:'flex'}}>
          {(status == 'All') ? 
            <div className="grid max-w-sm items-center gap-1" style={{display:'flex'}}>
                <Label htmlFor="email" className="text-sm text-muted-foreground">Submitted on:</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "w-[300px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarBlank className="mr-2 h-4 w-4" />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "LLL dd, y")} -{" "}
                            {format(date.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(date.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={1}
                    />
                    {(date!=null) ?
                    <Button onClick={()=>dates(date)}>Apply selection</Button> : <br/>}
                  </PopoverContent>
                </Popover>
                </div>
              
          
          : <br/>}
          <Button variant="outline"> <ArrowDown className="mr-2 h-4 w-4" onClick={()=>downloadNow()}/> Download</Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {/* {table.getRowModel().rows?.length ? ( */}
            {(true) ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-18 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* pagination */}
        {/* pagination */}
        {/* pagination */}
        <div className="flex items-center justify-end space-x-2 py-4 px-4">
        <div className="flex-1 text-sm text-muted-foreground">{table.getFilteredRowModel().rows.length} requests</div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
