"use client"


import * as React from "react"
import { useState } from "react"
import { ArrowDown, CalendarBlank, SpinnerGap } from 'phosphor-react'
import { addDays, format } from "date-fns"
import { DateRange } from "react-day-picker"
import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  flexRender,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel
} from "@tanstack/react-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/app/components/ui/dialog"
import { Textarea } from "@/app/components/ui/textarea"
import { cn } from "@/app/lib/utils"
import { Label } from "@/app/components/ui/label"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Calendar } from "@/app/components/ui/calendar"
import { useToast } from "@/app/components/ui/use-toast"
import styles from '../../../../app/page.module.css'
// import { columns } from './columns';

// function acceptAppointment(row) {
//   // logic to edit the row with this id
//   console.log('Editing row with id:', row);
//   console.log('Editing row with id:', row.getValue("requestStatus"));
// }

import dayjs from 'dayjs'

import { ArrowUpDown, MoreHorizontal } from "lucide-react" 
import { Checkbox } from "@/app/components/ui/checkbox"
import { Progress } from "@/app/components/ui/progress"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet"
import { Separator } from "@/app/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip"
import Biscuits from 'universal-cookie'
import { useRouter } from 'next/navigation'
import Link from "next/link"
import Image from "next/image"


export function DataTable({ data, status, downloadNow, dates, requestAgain, loadingIds }) {

  // const [loadingIds, setLoadingIds] = useState(loadingIds);
  const router = useRouter();
  const today = new dayjs();
  const { toast } = useToast();
  const [notes, setNotes] = useState('');

  const handleNotesSaveChanges = (row) => {
    // console.log(document.getElementById('appointmentnotes').value);  // Now you have the username value when "Save changes" is clicked
    console.log('Notes:', notes);  // Now you have the username value when "Save changes" is clicked
    // handleCompleteClick(row, notes)
  };

  const biscuits = new Biscuits;
  let cookieValue = biscuits.get('sc_user_detail')

  // console.log(  data.some(request => request.assessmentId === "Screening test").assessmentId);
const columns = [
  // selection
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
    enableHiding: true,
    accessorKey: "assessmentId",
    header: "Assessment"
  },
    {
      accessorKey: "title",
      header: "Assessment",
      cell: ({ row }) => {
        return <div className="flex w-[100px] px-2 py-1 text-md focus:outline-none text-foreground"
        style={{cursor:'pointer',width:'100%'}}>
                 
                 <Sheet>
                  <SheetTrigger className="text-green-700 underline underline-offset-4 text-md text-foreground">{ row.getValue("title")}</SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>{ row.getValue("title")}</SheetTitle>
                      <SheetDescription>
                        {/* <h1 className="text-black-700 text-xl text-foreground">{ row.getValue("title")}</h1> */}
                      
                      <br/>
                      <Separator />
                      <br/>
                      <div>
                        <Image src={row.getValue("media")} alt='logo' width={140} height={140} />
                      </div>

                        <div className="flex flex-wrap justify-between items-center py-2.5">
                            <p>{row.getValue("title")}</p>
                            <p className="text-black-700 text-md ont-semibold text-foreground">{row.getValue("title2")}</p>
                        </div>
                        <div className="flex flex-wrap justify-between items-center py-2.5">
                            <p>About:</p>
                            <p className="text-black-700 text-md ont-semibold text-foreground">{row.getValue("description")}</p>
                        </div>
                        <div className="flex flex-wrap justify-between items-center py-2.5">
                            <p>Assessment type:</p>
                            {(row.getValue("assessmentType") == 2) ? 
                            <p className="text-black-700 text-md ont-semibold text-foreground">Result sets with ranges like 0-10, etc</p>
                            : <p className="text-black-700 text-md ont-semibold text-foreground">Result set will include a single definite value</p>}
                        </div>
                        {/* <div className="flex flex-wrap justify-between items-center py-2.5">
                            <p>Created by:</p>
                            <p className="text-black-700 text-md ont-semibold text-foreground">{  row.getValue("adminId")}</p>
                        </div> */}
                        <br/>
                        <Separator />
                        <div className="flex flex-wrap justify-between items-center py-2.5">
                            <p>Created on: {dayjs(row.getValue("createdOn")).format("DD-MMM'YY")}</p>
                            {/* <p className="text-black-700 text-md ont-semibold text-foreground">{dayjs(row.getValue("createdOn")).format("DD-MMM'YY")}</p> */}
                        </div>
                        
                      </SheetDescription>
                    </SheetHeader>
                  </SheetContent>
                </Sheet>

                  
                </div>
      },
    },
    
    {
      enableHiding: true,
      accessorKey: "campusId",
      header: "College"
    },
    {
      accessorKey: "assessmentType",
      header: "Type"
    },
    {
      accessorKey: "title2",
      header: "Title2"
    },
    {
      accessorKey: "description",
      header: "Description"
    },
    {
      accessorKey: "media",
      header: "Media"
    },
    // {
    //   enableHiding: true,
    //   accessorKey: "title",
    //   header: "Assessment title",
    //   cell: ({row}) => {
    //     return <div>
    //               <p className="text-ellipsis">{row.getValue("title")}</p>
    //               <p className="text-sm text-slate-500">{row.getValue("title2")}</p>
    //               <p className="text-sm text-slate-500">{row.getValue("description")}</p>
    //           </div>
    //   }
    // },
    
    // {
    //   enableHiding: true,
    //   accessorKey: "description",
    //   cell: ({row}) => {
    //     return <div className="line-clamp-2">{row.getValue("description")}</div>
    //   }
    // },
    {
      enableHiding: true,
      accessorKey: "adminId",
    },
    {
      accessorKey: "createdOn",
      // header: "From",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created on
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return <div>{dayjs(row.getValue("createdOn")).format("DD-MMM'YY")}</div>
        // return <div>{dayjs(row.getValue("requestDate")).format("DD/MM/YY hh:mm A")}</div>
      },
    },
    // {
    //   accessorKey: "assessmentType",
    //   header: "Type"
    // },
    

    ///////////////////
    // ACTIONS OF A ROW
    ///////////////////
    {
      id: "actions",
      cell: ({ row }) => {
        // const router = useRouter();
        //   const handleClick = () => {
        //     // router.push(`/assessments/assessmentdetail?id=${row.getValue("assessmentId")}`);

        //     router.push({
        //       pathname: '/assessments/assessmentdetail',
        //       query: row.getValue("assessmentId"), // Assuming `id` is the unique identifier in your row data
        //     });
        //   };

          // return <Button onClick={handleClick} variant="secondary">Reschedule</Button>
          return <Link href={{pathname: '/assessments/assessmentdetail',
                    query: {
                      id: row.getValue("assessmentId"), 
                      title: row.getValue("title"),
                      type: row.getValue("assessmentType"),
                    },
                    }} 
                      className="underline text-blue-700">View details</Link>

        // return <Button onClick={() => router.push('/assessments/assessmentdetail')} variant="secondary">Reschedule</Button>
      },
    },
    
  ]


  const updateAppointmentsDataAPI = async (pass) => 
  
    fetch("/api/psych/updateappointment/"+pass, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });
  const declineAppointmentsDataAPI = async (pass) => 
  
    fetch("/api/psych/updateappointment/"+pass, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });
  

  // 1 stage
    // 2 appointmentId
    // 3 collegeId
    // 4 adminId
    // 5 updatedOn
    // 6 playerId
    // 7 notes
    async function updateAppointment(row, removeAppointment){
      
    // async function updateAppointment(appointmentId, collegeId){
        console.log('YES');
        console.log(row.getValue('appointmentId'));
      // setSearching(true);
      // setOffset(offset+0); // update the offset for every call

      try {    
          // var dates = dayjs(today.toDate()).format("YYYY-MM-DD") + "," + dayjs(today.toDate()).format("YYYY-MM-DD");
          var updatedOn = dayjs(today).format("YYYY-MM-DD");
          
          // const result  = await getAllRequestsDataAPI(process.env.NEXT_PUBLIC_API_PASS, 
          console.log("/api/psych/updateappointment/"+process.env.NEXT_PUBLIC_API_PASS+"/S1/"+row.getValue('appointmentId')+"/"+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).collegeId+"/"+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).username+"/"+updatedOn+"/"+row.getValue('collegeId'));
          const result  = await updateAppointmentsDataAPI(process.env.NEXT_PUBLIC_API_PASS+"/S1/"+row.getValue('appointmentId')+"/"+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).collegeId+"/"+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).username+"/"+updatedOn+"/"+row.getValue('collegeId'))
          
          // const result  = await getAllRequestsDataAPI(process.env.NEXT_PUBLIC_API_PASS, JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).role, status, 0, JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).collegeId, 'CSE,IT', 'All', '111', '0', JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).campusId, dates, 'BTECH-IT-2,BTECH-IT-3')
          const queryResult = await result.json() // get data

          console.log(queryResult);
          // check for the status
          if(queryResult.status == 200){

            removeAppointment(row.original.appointmentId);
            toast({description: "Appointment confirmed!",});

              // setSearching(false);
              // setCompleted(false);
          }
          else if(queryResult.status == 401) {
              
              // setSearching(false);
              // setDataFound(false);
              // setCompleted(true);
          }
          else if(queryResult.status == 404) {
              // setAllRequests([]);
              // toast({
              //     description: "Cannot update, try again later",
              //   })
                
              // setSearching(false);
              // setDataFound(false);
              // setCompleted(true);
          }
          else if(queryResult.status == 201) {
              
              // setSearching(false);
              // setDataFound(false);
              // setCompleted(true);
          }
      }
      catch (e){
          console.log(e);
          // show and hide message
          // setResultType('error');
          // setResultMessage('Issue loading. Please refresh or try again later!');
          // setTimeout(function(){
          //     setResultType('');
          //     setResultMessage('');
          // }, 3000);
      }
}
    

async function declineAppointment(row){
   
      // setSearching(true);
      // setOffset(offset+0); // update the offset for every call

      try {    
          // var dates = dayjs(today.toDate()).format("YYYY-MM-DD") + "," + dayjs(today.toDate()).format("YYYY-MM-DD");
          var updatedOn = dayjs(today).format("YYYY-MM-DD");
          
          // const result  = await getAllRequestsDataAPI(process.env.NEXT_PUBLIC_API_PASS, 
          console.log("/api/psych/updateappointment/"+process.env.NEXT_PUBLIC_API_PASS+"/S4/"+row.getValue('appointmentId')+"/"+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).collegeId+"/"+row.getValue('collegeId'));
          const result  = await updateAppointmentsDataAPI(process.env.NEXT_PUBLIC_API_PASS+"/S4/"+row.getValue('appointmentId')+"/"+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).collegeId+"/"+row.getValue('collegeId'))
          
          // const result  = await getAllRequestsDataAPI(process.env.NEXT_PUBLIC_API_PASS, JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).role, status, 0, JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).collegeId, 'CSE,IT', 'All', '111', '0', JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).campusId, dates, 'BTECH-IT-2,BTECH-IT-3')
          const queryResult = await result.json() // get data

          console.log(queryResult);
          // check for the status
          if(queryResult.status == 200){

            // row.setValue('requestStatus', "Cancelled");
            row.toggleSelected();
            // row.getVisibleCells.hide();
            row.toggleVisibility(true);

            // toast({description: "Appointment updated!",});

              // check if data exits
              

              // setSearching(false);
              // setCompleted(false);
          }
          else if(queryResult.status == 401) {
              
              // setSearching(false);
              // setDataFound(false);
              // setCompleted(true);
          }
          else if(queryResult.status == 404) {
              // setAllRequests([]);
              // toast({
              //     description: "Cannot update, try again later",
              //   })
                
              // setSearching(false);
              // setDataFound(false);
              // setCompleted(true);
          }
          else if(queryResult.status == 201) {
              
              // setSearching(false);
              // setDataFound(false);
              // setCompleted(true);
          }
      }
      catch (e){
          console.log(e);
          // show and hide message
          // setResultType('error');
          // setResultMessage('Issue loading. Please refresh or try again later!');
          // setTimeout(function(){
          //     setResultType('');
          //     setResultMessage('');
          // }, 3000);
      }
}

  // removeAppointment(appointmentId);
  const [sorting, setSorting] = React.useState([]) // sorting
  const [columnFilters, setColumnFilters] = React.useState([]) // filtering
  const [rowSelection, setRowSelection] = React.useState([]) // for cell selection
  const [statusHere, setStatusHere] = React.useState(status)
  // const [columnVisibility, setColumnVisibility] = React.useState<VisibilityTableState>({})
  // Set the initial state using today's date
  // const [date1, setDate1] = React.useState({from: dayjs(),to: dayjs().add(20, 'day'),});
  // const [date, setDate] = React.useState({from: new Date(initialDates.from.format('YYYY-MM-DD')), to: new Date(initialDates.to.format('YYYY-MM-DD'))})
  // const [date, setDate] = React.useState({from: new  Date(2023,10,20), to: addDays(new Date(2023,10,20),20)})
  const [rowsCount, setRowsCount] = React.useState(10)

  const table = useReactTable({
    data,
    columns,
    initialState: {
      hiddenColumns: columns
      .filter(
        (column) =>
          typeof column.accessorFn !== "undefined" && column.getCanHide() && column.getIsVisible()
      ) 
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // pagination
    // sorting
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    // onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      // columnVisibility,
      rowSelection,
    },
  })
  

  

  return (

    <div>
      

      {/* Filtered count */}
      {/* Filtered count */}
      {/* Filtered count */}
      {(table.getFilteredSelectedRowModel().rows.length > 0) ?
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      : null}

      {/* <div className={cn("grid gap-2")} style={{display:'flex', flexDirection:'column', alignItems:'start'}}> */}

          {/* <Tabs defaultValue={statusHere} className="w-[400px]"> */}
              {/* <TabsList> */}
                {/* <TabsTrigger value="All" onClick={()=>changeStatus('All')}>All</TabsTrigger> */}
                {/* <TabsTrigger value="Submitted" onClick={()=>changeStatus('Submitted')}>Pending</TabsTrigger>
                <TabsTrigger value="Confirmed" onClick={()=>changeStatus('Confirmed')}>Confirmed</TabsTrigger>
                <TabsTrigger value="Completed" onClick={()=>changeStatus('Completed')}>Completed</TabsTrigger>
                <TabsTrigger value="Cancelled" onClick={()=>changeStatus('Cancelled')}>Cancelled</TabsTrigger> */}
                
                {/* <TabsTrigger value="Rejected" onClick={()=>changeStatus('Rejected')}>Rejected</TabsTrigger>
                <TabsTrigger value="Cancelled" onClick={()=>changeStatus('Cancelled')}>Cancelled</TabsTrigger> */}
              {/* </TabsList> */}
              {/* <TabsContent value="All">Make changes to your account here.</TabsContent>
              <TabsContent value="Submitted">CZhange your password here.</TabsContent>
              <TabsContent value="Approved">CZhange your password here.</TabsContent>
              <TabsContent value="Issued">CZhange your password here.</TabsContent>
              <TabsContent value="InOuting">CZhange your password here.</TabsContent>
              <TabsContent value="Returned">CZhange your password here.</TabsContent>
              <TabsContent value="Rejected">CZhange your password here.</TabsContent>
              <TabsContent value="Cancelled">CZhange your password here.</TabsContent> */}
            {/* </Tabs>
     </div> */}


      {/* search input for filtering columns */}
      {/* search input for filtering columns */}
      {/* search input for filtering columns */}
      <div className="flex items-center py-2" style={{display:'flex', justifyContent:'space-between'}}>
        {/* <Input
          placeholder="Search Assessments by name"
          value={(table.getColumn("assessmentId")?.getFilterValue()) ?? ""}
          onChange={(event) =>
            table.getColumn("assessmentId")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        /> 
         &nbsp;
        &nbsp; */}
        <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredRowModel().rows.length} assessments.
      </div>
        <div className="gap-2" style={{display:'flex'}}>
          {/* {(status == 'All') ?  */}
            <div className="grid max-w-sm items-center gap-1" style={{display:'flex'}}>
            {(status == 'Checkout' || status == 'Returned') ? 
                <Label htmlFor="email" className="text-sm text-muted-foreground">{status} on:</Label> 
                : null}
            {/* {(status == 'All' ) ? 
                <Label htmlFor="email" className="text-sm text-muted-foreground">Submitted on:</Label> :
                <Label htmlFor="email" className="text-sm text-muted-foreground">{status} on:</Label> } */}
                {/* <Label htmlFor="email" className="text-sm text-muted-foreground">Submitted on:</Label> */}
                {(status == 'Checkout' || status == 'Returned' ) ? 
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
                : null }
                </div>
              
           
          {/* : <br/>} */}
          {/* <Button variant="outline" onClick={()=>downloadNow()}> <ArrowDown className="mr-2 h-4 w-4"/> Download</Button> */}
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  
                  if(header.id == 'assessmentId' || header.id == 'assessmentType' || header.id == 'title2' || header.id == 'description' || header.id == 'adminId' || header.id == 'media'){
                    return null
                  }
                  else {
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
                  }
                  
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {/* {table.getRowModel().rows?.length ? ( */}
            {(true) ? (

              
              table.getRowModel().rows.map(row => (
                // console.log(row.getVisibleCells()),
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map(cell => (
                    // console.log(cell.column.id),
                    // (cell.column.id == 'actions') ? cell.column.onClick=()=>acceptAppointment('Submitted') : 'ok',
                    (cell.column.id == 'assessmentId' || cell.column.id == 'assessmentType' || cell.column.id == 'title2' || cell.column.id == 'description' || cell.column.id == 'adminId' || cell.column.id == 'media') ? null :
                    // (cell.column.id == 'requestStatus') ? null :
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      
                    </TableCell>

                    
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow >
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
        <div className="flex-1 text-sm text-muted-foreground">{table.getFilteredRowModel().rows.length} assessments</div>
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
            onClick={() => {
              // console.log('ppppppppppp');
              // console.log(table.getRowModel().rows.length);
              setRowsCount(rowsCount + table.getRowModel().rows.length)
              // console.log(rowsCount);
              // console.log(data.length);
              if(rowsCount == data.length){
                // console.log('kkkkkkk');
              // if(!table.getCanNextPage()){
                requestAgain(status)
              }
              // requestAgain(status)
              table.nextPage()
            }}
            // disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

