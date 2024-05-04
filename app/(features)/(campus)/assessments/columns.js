import { ColumnDef } from "@tanstack/react-table"
import { date, string } from "yup"
import dayjs from 'dayjs'

import { ArrowUpDown, MoreHorizontal } from "lucide-react" 
import { Button } from "@/app/components/ui/button"
import { Checkbox } from "@/app/components/ui/checkbox"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet"
import { Separator } from "@/app/components/ui/separator"
import { useToast } from "@/app/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip"


const today = new dayjs();
import Biscuits from 'universal-cookie'
const biscuits = new Biscuits;
let cookieValue = biscuits.get('sc_user_detail')
export const columns = [
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
      accessorKey: "collegeId",
      header: "Student",
      cell: ({ row }) => {
        return <div className="flex w-[100px] px-2 py-1 text-md focus:outline-none text-foreground"
        style={{cursor:'pointer'}}>
                 
                 <Sheet>
                  <SheetTrigger className="text-green-700 underline underline-offset-4 text-md text-foreground">{ row.getValue("collegeId")}</SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Student Details</SheetTitle>
                      <SheetDescription>
                        <h1 className="text-black-700 text-xl text-foreground">{ row.getValue("collegeId")}</h1>
                      
                      <br/>
                      <br/>

                        <div className="flex flex-wrap justify-between items-center py-2.5">
                            <p>Full name:</p>
                            <p className="text-black-700 text-md ont-semibold text-foreground">{ row.getValue("collegeId")}</p>
                        </div>
                        <Separator />
                        
                        <div className="flex flex-wrap justify-between items-center py-2.5">
                            <p>College Regd Id:</p>
                            <p className="text-black-700 text-md ont-semibold text-foreground">{ row.getValue("collegeId")}</p>
                        </div>
                        <Separator />
                        
                        <Separator />
                        
                        <Separator />
                      </SheetDescription>
                    </SheetHeader>
                  </SheetContent>
                </Sheet>

                  
                </div>
      },
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
        return <div>{dayjs(row.getValue("requestDate")).format("DD-MMM'YY hh:mm A")}</div>
        // return <div>{dayjs(row.getValue("requestDate")).format("DD/MM/YY hh:mm A")}</div>
      },
    },
    {
      accessorKey: "topic",
      header: "Topic"
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
              <Button variant="secondary">Reschedule</Button>
              &nbsp;
              <Button type="button" variant="outline" onClick={() => declineAppointment(row)}>Decline</Button>
              &nbsp;
              <Button onClick={() => acceptAppointment(row)}>Accept</Button>
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
  
  export function acceptAppointment(id) {
    console.log(`Accepting appointment with ID: ${id.getValue('requestStatus')}`);
    updateAppointment(id.getValue('appointmentId'), id.getValue('collegeId'))
    // Additional logic here
  }

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
    async function updateAppointment(appointmentId, collegeId){
        console.log('YES');
        console.log(appointmentId);
      // setSearching(true);
      // setOffset(offset+0); // update the offset for every call

      try {    
          // var dates = dayjs(today.toDate()).format("YYYY-MM-DD") + "," + dayjs(today.toDate()).format("YYYY-MM-DD");
          var updatedOn = dayjs(today).format("YYYY-MM-DD");
          
          // const result  = await getAllRequestsDataAPI(process.env.NEXT_PUBLIC_API_PASS, 
          console.log("/api/psych/updateappointment/"+process.env.NEXT_PUBLIC_API_PASS+"/S1/"+appointmentId+"/"+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).collegeId+"/"+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).username+"/"+updatedOn+"/"+collegeId);
          const result  = await updateAppointmentsDataAPI(process.env.NEXT_PUBLIC_API_PASS+"/S1/"+appointmentId+"/"+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).collegeId+"/"+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).username+"/"+updatedOn+"/"+collegeId)
          
          // const result  = await getAllRequestsDataAPI(process.env.NEXT_PUBLIC_API_PASS, JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).role, status, 0, JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).collegeId, 'CSE,IT', 'All', '111', '0', JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).campusId, dates, 'BTECH-IT-2,BTECH-IT-3')
          const queryResult = await result.json() // get data

          console.log(queryResult);
          // check for the status
          if(queryResult.status == 200){

            // toast({description: "Appointment updated!",});

              // check if data exits
              if(queryResult.newdata.length > 0){

                  // set the state
                  // outing data
                  
                  // setAllRequests(queryResult.newdata);
                  // if(allRequests.length > 0){
                  //     setAllRequests(allRequests.push(queryResult.data));
                  // }
                  // else{
                  //     setAllRequests(queryResult.data);
                  // }
                  
                  // setDataFound(true);
                 
              }
              else {
                  // setDataFound(false);
              }

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