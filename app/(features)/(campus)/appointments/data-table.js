"use client"


import * as React from "react"
import { useState, useRef } from "react"
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
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc);
dayjs.extend(timezone);

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
 

  // get the list of messages sent and received by a person to the admin
  const getAppointmentsOfStudentData = async (pass, studentId, campusId) => 
    fetch("/api/psych/appointments/"+pass+"/PsychAdmin/S2/All/0/"+studentId, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });
    
    

export function DataTable({ data, status, changeStatus, downloadNow, initialDates, dates, requestAgain, loadingIds, removeAppointment, handleAcceptClick, handleCompleteClick, handleCancelClick, handleTimeUpdateClick }) {

  // const [loadingIds, setLoadingIds] = useState(loadingIds);

  const today = new dayjs();
  const { toast } = useToast();
  const textareaRef = useRef(null); // Creates a ref object
  const [studentAppointmentsList, setStudentAppointmentsList] = useState([]);
      
    var dataFound= true; 
    var searchingAppointments = false;
    
    // get appointments of a specific receiver
    async function getAppointmentsOfStudent(studentId){
          console.log(studentId);
          
      searchingAppointments= true;
      // setSenderMessagesList([]);
      // setOffset(offset+10); // update the offset for every call
  
      try {    
          const result  = await getAppointmentsOfStudentData(process.env.NEXT_PUBLIC_API_PASS, studentId)
          const queryResult = await result.json() // get data
          console.log(queryResult);
          // check for the status
          if(queryResult.status == 200){
  
              // check if data exits
              if(queryResult.data.length > 0){
                  
                  // get the messages list of the receiver
                  setStudentAppointmentsList(queryResult.data);
                  
                  dataFound =true;
                  searchingAppointments = false;
              }
              else {
                  
                  dataFound=false;
              }
              // setCompleted(false);
          }
          else {
              
              searchingAppointments=false;
              dataFound=false;
              // setCompleted(true);
          }
      }
      catch (e){
          // show and hide message
          // setResultType('error');
          // setResultMessage('Issue loading. Please refresh or try again later!');
          // setTimeout(function(){
          //     setResultType('');
          //     setResultMessage('');
          // }, 3000);
      }
  }


  const handleNotesSaveChanges = (row) => {
    // console.log(document.getElementById('appointmentnotes').value);  // Now you have the username value when "Save changes" is clicked
    
    if (textareaRef.current) {
      console.log('Entered text:', textareaRef.current.value); // Accesses the textarea value directly
    }
    handleCompleteClick(row, textareaRef.current.value)
  };

  const biscuits = new Biscuits;
  let cookieValue = biscuits.get('sc_user_detail')
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
      size: 250,
      accessorKey: "collegeId",
      header: "Student",
      cell: ({ row }) => {
        return <div className="flex w-fit px-2 py-1 text-md focus:outline-none text-foreground"
        style={{cursor:'pointer'}}>
                 
                 <Sheet>
                  <SheetTrigger className="text-green-700 underline underline-offset-4 text-md text-foreground flex space-x-2" onClick={()=>getAppointmentsOfStudent(row.getValue("collegeId"))}>
                    {row.getValue("username")} - {row.getValue("collegeId")}
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>{row.getValue("username")}</SheetTitle>
                      <SheetDescription>
                        <div className="text-black-700 text-md text-foreground">{row.getValue("campusId")} - {row.getValue("course")} - {row.getValue("branch")} - {row.getValue("year")}</div>
                      
                      <br/>
                      <br/>

                        <div className="flex flex-wrap justify-between items-center py-2.5">
                            <p>Full name:</p>
                            <p className="text-black-700 text-md ont-semibold text-foreground">{ row.getValue("username")}</p>
                        </div>
                        <Separator />
                        
                        <div className="flex flex-wrap justify-between items-center py-2.5">
                            <p>College Regd Id:</p>
                            <p className="text-black-700 text-md ont-semibold text-foreground">{ row.getValue("collegeId")}</p>
                        </div>
                        <Separator />
                        <div className="flex flex-wrap justify-between items-center py-2.5">
                            <p>Email:</p>
                            <p className="text-black-700 text-md ont-semibold text-foreground">{ row.getValue("email")}</p>
                        </div>
                        <Separator />
                        <div className="flex flex-wrap justify-between items-center py-2.5">
                            <p>Phone:</p>
                            <p className="text-black-700 text-md ont-semibold text-foreground">{ row.getValue("phoneNumber")}</p>
                        </div>
                        <Separator />

                        {searchingAppointments ? <div className={styles.horizontalsection}>
                              <SpinnerGap className={`${styles.icon} ${styles.load}`} />
                              <p className={`${inter.className} ${styles.text3}`}>Fetching appointments data ...</p> 
                          </div> : ''}
                          
                          <div>
                          {
                            studentAppointmentsList.map((appointment) => 
                              <div key={appointment.appointmentId} value={appointment.appointmentId}>{appointment.requestDate}</div>)
                          }
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
    },
    {
      enableHiding: true,
      accessorKey: "username",
    },
    {
      enableHiding: true,
      accessorKey: "email",
    },
    {
      enableHiding: true,
      accessorKey: "phoneNumber",
    },
    {
      enableHiding: true,
      accessorKey: "course",
    },
    {
      enableHiding: true,
      accessorKey: "branch",
    },
    {
      enableHiding: true,
      accessorKey: "year",
    },
    {
      enableHiding: true,
      accessorKey: "gender",
    },
    {
      enableHiding: true,
      accessorKey: "appointmentId",
      // header: "College"
    },
    {
      enableHiding: true,
      accessorKey: "requestStatus",
    },
    {
      accessorKey: "requestDate",
      // header: "From",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Appointment on
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return <div>{dayjs(row.getValue("requestDate")).utcOffset(0).format("DD-MMM'YY hh:mm A")}</div>
        // return <div>{dayjs(row.getValue("requestDate")).format("DD-MMM'YY hh:mm A")}, {dayjs(row.getValue("requestDate")).tz('Asia/Kolkata').format("DD-MMM'YY hh:mm A")}, {dayjs(row.getValue("requestDate")).utcOffset(0).format("DD-MMM'YY hh:mm A")}</div>
        // return <div>{dayjs(row.getValue("requestDate")).format("DD/MM/YY hh:mm A")}</div>
      },
    },
    {
      accessorKey: "topic",
      header: "Topic"
    },
    {
      accessorKey: "notes",
      header: "Notes"
    },
    {
      accessorKey: "description",
      header: "Description",
      // header: ({ column }) => (
      //   <DataTableColumnHeader column={column} title="Description" />
      // ),
      cell: ({ row }) => {
        // const label = labels.find(label => label.value === row.original.label)
  
        return (
          <div className="flex space-x-2">
            {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
            {/* <span className="max-w-[200px] truncate">
              {row.getValue("description")}
            </span> */}
            

          <TooltipProvider className="flex space-x-2 truncate">
              <Tooltip>
                <TooltipTrigger className="max-w-[200px] truncate"> 
                    {row.getValue("description")}
                </TooltipTrigger>
                <TooltipContent>
                  {/* <p>Add to library</p> */}
                  {row.getValue("description")}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

        )
      }
    },
    {
      accessorKey: "mode",
      // header: "Year",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Mode
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return (row.getValue("mode") == 0) ? <div>In person</div> : <div>Online</div>
      },
    },

    ///////////////////
    // ACTIONS OF A ROW
    ///////////////////
    {
      id: "actions",
      cell: ({ row }) => {
        const payment = row.original
  //  console.log(payment);
        
        return (row.getValue("requestStatus") == 'Submitted') ? <div>
                  
                  {/* {loadingIds.has(row.original.appointmentId) ? (
                      <SpinnerGap className={`${styles.icon} ${styles.load}`} /> 
                  ) : (
                      <Button onClick={() => handleTimeUpdateClick(row)} variant="secondary">Reschedule</Button>
                  )}
              &nbsp; */}
                  {/* <Button type="button" variant="outline" onClick={() => declineAppointment(row)}>Decline</Button> */}
                  {loadingIds.has(row.original.appointmentId) ? (
                      <SpinnerGap className={`${styles.icon} ${styles.load}`} /> 
                  ) : (
                      <Button onClick={() => handleCancelClick(row)} type="button" variant="outline" >Decline</Button>
                  )}
              &nbsp;
              
                  {loadingIds.has(row.original.appointmentId) ? (
                      <SpinnerGap className={`${styles.icon} ${styles.load}`} /> 
                  ) : (
                      <Button onClick={() => handleAcceptClick(row)}>Accept</Button>
                  )}
              
        </div>
        : (row.getValue("requestStatus") == 'Confirmed') ? <div>
              
                  {loadingIds.has(row.original.appointmentId) ? (
                      <SpinnerGap className={`${styles.icon} ${styles.load}`} />  // Placeholder for your progress indicator
                  ) : (
                      // <Button onClick={() => handleCompleteClick(row)}>Mark as complete</Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>Mark as complete</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Meeting notes</DialogTitle>
                            <DialogDescription>
                              Update notes for this meeting here. It will help to recollect this discussion for later.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="items-center gap-4">
                              <Label htmlFor="username" className="text-right">
                                Notes
                              </Label>
                              <Textarea ref={textareaRef} id="appointmentnotes" placeholder="Type your notes here." />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit" onClick={() => handleNotesSaveChanges(row)}>Save changes</Button>
                            {/* <Button type="submit" onClick={() => handleCompleteClick(row, notes)}>Save changes</Button> */}
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      // <Button onClick={() => handleAcceptClick(row.original.appointmentId)}>Accept</Button>
                  )}
              
        </div>
        : (row.getValue("requestStatus") == 'Completed') ? <div>
              
                  {loadingIds.has(row.original.appointmentId) ? (
                      <SpinnerGap className={`${styles.icon} ${styles.load}`} />  // Placeholder for your progress indicator
                  ) : (
                      // <Button onClick={() => handleCompleteClick(row)}>Mark as complete</Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>View notes</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Meeting notes</DialogTitle>
                            {/* <DialogDescription>
                            {row.getValue("notes")}
                            </DialogDescription> */}
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="items-center gap-4">
                              {row.getValue("notes")}
                              
                            </div>
                          </div>
                          <DialogFooter>
                            {/* <Button type="submit" onClick={() => handleNotesSaveChanges(row)}>Save changes</Button> */}
                            {/* <Button type="submit" onClick={() => handleCompleteClick(row, notes)}>Save changes</Button> */}
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      // <Button onClick={() => handleAcceptClick(row.original.appointmentId)}>Accept</Button>
                  )}
              
        </div>
        
        : null
        // <div>
        //       Start
        // </div>

      },
    },
    // {
    //   id: "actions",
    //   cell: ({ row }) => {
    //     const payment = row.original
   
    //     return (
    //       <DropdownMenu>
    //         <DropdownMenuTrigger asChild>
    //           <Button variant="ghost" className="h-8 w-8 p-0">
    //             <span className="sr-only">Open menu</span>
    //             <MoreHorizontal className="h-4 w-4" />
    //           </Button>
    //         </DropdownMenuTrigger>
    //         <DropdownMenuContent align="end">
    //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //           <DropdownMenuItem
    //             onClick={() => navigator.clipboard.writeText(payment.id)}
    //           >
    //             Copy payment ID
    //           </DropdownMenuItem>
    //           <DropdownMenuSeparator />
    //           <DropdownMenuItem>View customer</DropdownMenuItem>
    //           <DropdownMenuItem>View payment details</DropdownMenuItem>
    //         </DropdownMenuContent>
    //       </DropdownMenu>
    //     )
    //   },
    // },

  ]

//  function acceptAppointment(appointmentId, callback) {
//   // Simulate API call
//   console.log(`Accepting appointment with ID: ${appointmentId}`);
//   setTimeout(() => {
//       // Suppose the API call has completed
//         updateAppointment(row, removeAppointment)
//       console.log(`Appointment ${appointmentId} accepted.`);
//       callback();  // Call the callback function passed
//   }, 2000); // Simulate a delay
// }


  
  // function acceptAppointment(row, removeAppointment) {
  //   console.log(`Accepting appointment with ID: ${row.getValue('requestStatus')}`);
  //   updateAppointment(row, removeAppointment)
    
  // }

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
  const [date, setDate] = React.useState({from: new Date(initialDates.from.format('YYYY-MM-DD')), to: new Date(initialDates.to.format('YYYY-MM-DD'))})
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

      <div className={cn("grid gap-2")} style={{display:'flex', flexDirection:'column', alignItems:'start'}}>

          {/* Statuses as tabs */}
          {/* Statuses as tabs */}
          <Tabs defaultValue={statusHere} className="w-[400px]">
              <TabsList>
                {/* <TabsTrigger value="All" onClick={()=>changeStatus('All')}>All</TabsTrigger> */}
                <TabsTrigger value="Submitted" onClick={()=>changeStatus('Submitted')}>Pending</TabsTrigger>
                <TabsTrigger value="Confirmed" onClick={()=>changeStatus('Confirmed')}>Confirmed</TabsTrigger>
                <TabsTrigger value="Completed" onClick={()=>changeStatus('Completed')}>Completed</TabsTrigger>
                <TabsTrigger value="Cancelled" onClick={()=>changeStatus('Cancelled')}>Cancelled</TabsTrigger>
                
                {/* <TabsTrigger value="Rejected" onClick={()=>changeStatus('Rejected')}>Rejected</TabsTrigger>
                <TabsTrigger value="Cancelled" onClick={()=>changeStatus('Cancelled')}>Cancelled</TabsTrigger> */}
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
        &nbsp;
        &nbsp;
        <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredRowModel().rows.length} requests.
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
                  
                  if(header.id == 'requestStatus' || header.id == 'appointmentId' || header.id == 'notes' || header.id == 'campusId' || header.id == 'username' || header.id == 'email' || header.id == 'phoneNumber' || header.id == 'course' || header.id == 'branch' || header.id == 'year' || header.id == 'gender'){
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
                    (cell.column.id == 'requestStatus' || cell.column.id == 'appointmentId' || cell.column.id == 'notes' || cell.column.id == 'campusId' || cell.column.id == 'username' || cell.column.id == 'email' || cell.column.id == 'phoneNumber' || cell.column.id == 'course' || cell.column.id == 'branch' || cell.column.id == 'year' || cell.column.id == 'gender') ? null :
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

