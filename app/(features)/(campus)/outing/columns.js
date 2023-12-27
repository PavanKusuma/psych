import { ColumnDef } from "@tanstack/react-table"
import { date, string } from "yup"
import dayjs from 'dayjs'

import { ArrowUpDown, MoreHorizontal } from "lucide-react" 
import { Button } from "@/app/components/ui/button"
import { Checkbox } from "@/app/components/ui/checkbox"
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
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export const OutingRequest = {
  requestId: string,
  collegeId: string,
  username: string,
  description: string,
  requestStatus: "Submitted" | "Approved" | "Issued" | "InOuting" | "Returned" | "Rejected" | "Cancelled",
  requestFrom: date,
  requestTo: date
}

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

  // columns
    // {
    //     accessorKey: "collegeId",
    //     header: "CollegeId",
    //     cell: ({ row }) => {
    //       return <div>{row.getValue('collegeId')}<br/><span className="text-xs text-muted-foreground">{row.getValue('username')}</span></div>
    //     },
    // },
    {
      accessorKey: "collegeId",
      header: "CollegeId"
    },
    {
      accessorKey: "username",
      header: "Username"
    },
    {
      accessorKey: "requestStatus",
      // header: "Status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Current status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "requestType",
      header: "Request Type",
      cell: ({ row }) => {
        return <div className="flex w-[100px] rounded-md border px-2 py-1 text-xs font-semibold focus:outline-none text-foreground">
                  { (row.getValue("requestType")==1) ? 
                        <span>LOCAL</span> : 
                          (row.getValue("requestType")==2) ? 
                          <span>OUT-CITY</span> :  
                              (row.getValue("requestType")==3) ? 
                              <span>OFFICIAL</span> : <span>TEMPORARY</span>}
                </div>
      },
    },
    {
      accessorKey: "requestFrom",
      header: "From-To",
      cell: ({ row }) => {
        return <div className="flex space-x-2">
                
              <TooltipProvider className="flex space-x-2 truncate">
                <Tooltip>
                  <TooltipTrigger className="max-w-[200px] truncate"> 
                  {dayjs(row.getValue("requestFrom")).format("YYYY-MM-DD")} - {dayjs(row.getValue("requestTo")).format("YYYY-MM-DD")}
                  </TooltipTrigger>
                  <TooltipContent>
                    {dayjs(row.getValue("requestFrom")).format("YYYY-MM-DD HH:mm a")} - {dayjs(row.getValue("requestTo")).format("YYYY-MM-DD HH:mm a")}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
        // <div className="max-w-[400px]">
        // <div className="text-xs text-muted-foreground">{dayjs(row.getValue("requestFrom")).format("YYYY-MM-DD HH:mm a")}<br/>{dayjs(row.getValue("requestTo")).format("YYYY-MM-DD HH:mm a")}</div>
        // </div>
        // return <div>{dayjs(row.getValue("requestFrom")).format("YYYY-MM-DD HH:mm a")}</div>
      },
    },
    // {
    //   accessorKey: "requestTo",
    //   header: "To",
    //   cell: ({ row }) => {
    //     return <div>{dayjs(row.getValue("requestTo")).format("YYYY-MM-DD HH:mm a")}</div>
    //   },
    // },
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
      accessorKey: "requestDate",
      // header: "Submitted",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Submitted
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return <div>{dayjs(row.getValue("requestDate")).format("YYYY-MM-DD HH:mm a")}</div>
      },
    },
    
    {
      accessorKey: "branch",
      header: "Branch",
      // cell: ({ row }) => {
      //   return <div>{dayjs(row.getValue("branch")).format("YYYY-MM-DD HH:mm a")}</div>
      // },
    },
    {
      accessorKey: "year",
      // header: "Year",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Year
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      // cell: ({ row }) => {
      //   return <div>{dayjs(row.getValue("year")).format("YYYY-MM-DD HH:mm a")}</div>
      // },
    },
    // {
    //   accessorKey: "requestFrom",
    //   // header: "Request dates"
    //   header: () => <div>Request dates</div>,
    //   cell: ({ row }) => {
    //     console.log(dayjs(row.getValue("requestFrom")).format("YYYY-MM-DD"));
    //     const formatted = (dayjs(row.getValue("requestFrom")).format("YYYY-MM-DD HH:mm a") + '\n' + dayjs(row.getValue("requestTo")).format("YYYY-MM-DD HH:mm a"))
    //     // const formatted = (dayjs(row.getValue("requestFrom")).format("YYYY-MM-DD HH:mm:ss") + '-' + row.getValue("requestTo"))
    //     // const formatted = (dayjs(row.getValue("requestFrom")).format("YYYY-MM-DD HH:mm:ss") + '-' + dayjs(row.getValue("requestTo")).format("YYYY-MM-DD"))
    //     // const formatted = new Intl.NumberFormat("en-US", {
    //     //   style: "currency",
    //     //   currency: "USD",
    //     // }).format(amount)
  
    //     return <div>{formatted}</div>
    //   },
    // },




    ///////////////////
    // ACTIONS OF A ROW
    ///////////////////
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
  