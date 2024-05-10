'use client'

import { ArrowUpDown, MoreHorizontal } from "lucide-react" 
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/app/components/ui/tooltip"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet"



import { Inter, DM_Sans, DM_Serif_Text } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
const dmSans = DM_Sans({ subsets: ['latin'] })
const dmSerifText = DM_Serif_Text({weight: "400", subsets: ['latin'] })
import { Check, Info, SpinnerGap, X, Plus } from 'phosphor-react'
import React, { useCallback, useEffect, useState } from 'react'
import { XAxis, YAxis, Cell, PieChart, Pie, Area, AreaChart } from 'recharts';

import styles from '../../../../app/page.module.css'
import Biscuits from 'universal-cookie'
const biscuits = new Biscuits
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
// import ImageWithShimmer from '../../components/imagewithshimmer'

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/app/components/ui/select'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger,} from "@/app/components/ui/drawer"
import { Separator } from "@/app/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group"
import { Label } from "@/app/components/ui/label"
import { Checkbox } from "@/app/components/ui/checkbox"

// import { EnvelopeOpenIcon } from "@radix-ui/react-icons"
import { useToast } from "@/app/components/ui/use-toast"
import { Button } from "@/app/components/ui/button"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/app/components/ui/table"
  
import {columns} from "./columns"
import {DataTable} from "./data-table"
const metadata = {
    title: "Tasks",
    description: "A task and issue tracker build using Tanstack Table."
  }
  // Simulate a database read for tasks.
   function getTasks() {
    // const data =  fs.readFile(
    //   path.join(process.cwd(), "src/app/data/tasks.json")
    // )
  
    // const tasks = JSON.parse(data.toString())

    var tasks = [
        {
          "id": "TASK-5207",
          "title": "The SMS interface is down, copy the bluetooth bus so we can quantify the VGA card!",
          "status": "Approved",
          "label": "bug",
          "priority": "low"
        }
      ]
  
    return JSON.parse(JSON.stringify(tasks))
    // return array( taskSchema.validate(tasks))
    // return array(taskSchema).parse(tasks)
  
  // parse and assert validity
  // const user = await taskSchema.validate(tasks);
  
  
  }
const xlsx = require('xlsx');
// import {jsPDF} from 'jsPDF';
// Default export is a4 paper, portrait, using millimeters for units
// const doc = new jsPDF();

// Create styles
// const styles1 = StyleSheet.create({
//     page: {
//       flexDirection: 'row',
//       backgroundColor: '#E4E4E4'
//     },
//     section: {
//       margin: 10,
//       padding: 10,
//       flexGrow: 1
//     }
//   });



// Hostels and strengths
// SELECT h.hostelName, h.hostelId, COUNT(ud.collegeId) AS userCount FROM hostel h LEFT JOIN user_details ud ON h.hostelId = ud.hostelId JOIN user u ON ud.collegeId = u.collegeId and u.type='hostel' and u.role='student' GROUP BY h.hostelName, h.hostelId

// Inouting count from each hostel
// SELECT h.hostelName, h.hostelId, COUNT(r.collegeId) AS userCount FROM hostel h LEFT JOIN user_details ud ON h.hostelId = ud.hostelId JOIN request r ON ud.collegeId = r.collegeId and r.requestStatus='InOuting' GROUP BY h.hostelName, h.hostelId

// InHostel Count, InOuting count from each hostel
// SELECT h.hostelName, h.hostelId, COUNT(DISTINCT ud.collegeId) AS userCount, SUM(CASE WHEN r.requestStatus='InOuting' THEN 1 ELSE 0 END) AS outingCount, COUNT(DISTINCT ud.collegeId) - SUM(CASE WHEN r.requestStatus='InOuting' THEN 1 ELSE 0 END) AS inHostel FROM hostel h LEFT JOIN user_details ud ON h.hostelId = ud.hostelId LEFT JOIN user u ON ud.collegeId = u.collegeId AND u.type='hostel' AND u.role='student' LEFT JOIN request r ON ud.collegeId = r.collegeId GROUP BY h.hostelName, h.hostelId

// to download hostelwise student status
// SELECT u.collegeId, u.username, (CASE WHEN r.requestStatus='InOuting' THEN 'InOuting' ELSE 'InHostel' END) as status FROM user u JOIN user_details ud ON u.collegeId = ud.collegeId JOIN request r ON u.collegeId = r.collegeId WHERE ud.hostelId = 'H09u23jidw' ORDER BY `status` DESC

// Child references can also take paths delimited by '/'


// get all campuses
const getCampuses = async (pass) => 
fetch("/api/campuses/"+pass+"/0", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});
// get all hostels
const getHostels = async (pass) => 
fetch("/api/hostels/"+pass+"/U1", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});
// get all college wise strengths
const getCollegeWiseStrengths = async (pass) => 
fetch("/api/hostels/"+pass+"/U5", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});
// get all hostel wise strengths
const getHostelWiseStrengths = async (pass) => 
fetch("/api/hostels/"+pass+"/U4", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});


// check for the user
const getStats = async (pass, role, branch) => 
  
fetch("/api/requeststats/"+pass+"/"+role+"/"+branch+"/All/1", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});


// check for the user
const getDetailedStats = async (pass, role, branch, date) => 
  
fetch("/api/requeststats/"+pass+"/"+role+"/"+branch+"/All/2/"+date, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// get the requests for SuperAdmin
const getAllRequestsDataAPI = async (pass, role, statuses, offset, collegeId, branches, requestType, platformType, year, campusId, dates, branchyears, course) => 
  
fetch("/api/requests/"+pass+"/"+role+"/"+statuses+"/"+offset+"/"+collegeId+"/"+branches+"/"+requestType+"/"+platformType+"/"+year+"/"+campusId+"/"+dates+"/"+branchyears+"/"+course, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});
// get the appointments for PsychAdmin
const getAllAppointmentsDataAPI = async (pass, role, statuses, offset, collegeId, campusId) => 
  
fetch("/api/psych/admin/appointments/"+pass+"/"+role+"/S1/"+statuses+"/"+offset+"/"+collegeId+"/"+campusId, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});



// pass state variable and the method to update state variable
export default function Appointments() {
    
    const { toast } = useToast();
    // const tasks = getTasks()
    // create a router for auto navigation
    const router = useRouter();

    // user state and requests variable
    const [user, setUser] = useState();
    const [offset, setOffset] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [loadingIds, setLoadingIds] = useState(new Set());
    // branch type selection whether all branches and years or specific ones
    const [viewTypeSelection, setViewTypeSelection] = useState('college');
    
    // for populating filters/selections
    const [campuses, setCampuses] = useState([]); const [selectedCampus, setSelectedCampus] = useState('All');
    const [hostels, setHostels] = useState([]);
    const [hostelStrengths, setHostelStrengths] = useState([]);
    const [courses, setCourses] = useState(); const [selectedCourse, setSelectedCourse] = useState(null);
    const [departments, setDepartments] = useState(); const [selectedDepartment, setSelectedDepartment] = useState(null);
    
    // branch type selection whether all branches and years or specific ones
    const [branchTypeSelection, setBranchTypeSelection] = useState('all');
    
    const [branches, setBranches] = useState([]); const [selectedBranch, setSelectedBranch] = useState(null);
    const [branchYears, setBranchYears] = useState(); //const [selectedBranchYears, setSelectedBranchYears] = useState(null);
    const [years, setYears] = useState();

    // branches selection
    const [selectedBranches, setSelectedBranches] = useState([]);
    const [selectedBranchYears, setSelectedBranchYears] = useState([]);

    // const [selectedBranches, setSelectedBranches] = useState(new Set());
    // const [selectedBranchYears, setSelectedBranchYears] = useState(new Set());
    // const [intermediateBranches, setIntermediateBranches] = useState(new Set());

    // basic stats
    const [totalStudents, setTotalStudents] = useState(0);
    const [studentsInCampus, setStudentsInCampus] = useState(0);
    const [requestsInOuting, setRequestsInOuting] = useState(0);
    const [requestsIssued, setRequestsIssued] = useState(0);
    const [requestsApproved, setRequestsApproved] = useState(0);
    const [requestsPending, setRequestsPending] = useState(0);

    // hostel wise
    const [totalHostelsStrength, setTotalHostelsStrength] = useState(0);
    const [totalInOutingStrength, setTotalInOutingStrength] = useState(0);
    const [totalInHostelStrength, setTotalInHostelStrength] = useState(0);

    const [resultType, setResultType] = useState('');
    const [resultMessage, setResultMessage] = useState('');

    const [dataFound, setDataFound] = useState(true); 
    const [searching, setSearching] = useState(false);

    const [outingData, setOutingData] = useState();
    const [allRequests, setAllRequests] = useState([]);
    const pieColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const [initialDatesValues, setInititalDates] = React.useState({from: dayjs().subtract(0,'day'),to: dayjs(),});
    // const [currentStatus, setCurrentStatus] = useState('All');
    const [currentStatus, setCurrentStatus] = useState('Submitted');
    //create new date object
    const today = new dayjs();
    
    const [showBlockOuting, setShowBlockOuting] = useState(false);
    const toggleShowBlockOuting = async () => {
        // setSelectedStudent(selectedStudent);
        setShowBlockOuting(!showBlockOuting)
    }
    const getDataData = async () => {
        console.log("Hello1");
    }

    ///////////////////////////////
    // IMPORTANT
    ///////////////////////////////
    // handle accept click to update a row
    const handleAcceptClick = (row) => {
        
        setLoadingIds(prev => new Set(prev.add(row.getValue('appointmentId'))));

        // Simulate API call
        updateAppointment(row, handleRemoveAppointment, () => {
            setLoadingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(row.getValue('appointmentId'));
                return newSet;
            });

            toast({description: "Appointment confirmed!",});
        });
        
    };
    // handle complete click to update a row
    const handleCompleteClick = (row, notes) => {
        
        setLoadingIds(prev => new Set(prev.add(row.getValue('appointmentId'))));
        console.log(notes);

        // Simulate API call
        completeAppointment(row, notes, handleRemoveAppointment, () => {
            setLoadingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(row.getValue('appointmentId'));
                return newSet;
            });

            toast({description: "Appointment completed!",});
        });
        
    };
    // handle cancel click to update a row
    const handleCancelClick = (row) => {
        
        setLoadingIds(prev => new Set(prev.add(row.getValue('appointmentId'))));

        // Simulate API call
        cancelAppointment(row, handleRemoveAppointment, () => {
            setLoadingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(row.getValue('appointmentId'));
                return newSet;
            });

            toast({description: "Appointment cancelled!",});
        });
        
    };
    // handle time update click to update a row
    const handleTimeUpdateClick = (row) => {
        
        // setLoadingIds(prev => new Set(prev.add(row.getValue('appointmentId'))));

        // Simulate API call
        // completeAppointment(row, handleRemoveAppointment, () => {
        //     setLoadingIds(prev => {
        //         const newSet = new Set(prev);
        //         newSet.delete(row.getValue('appointmentId'));
        //         return newSet;
        //     });

        //     toast({description: "Appointment completed!",});
        // });
        
    };

    // const handleAcceptClick = (row) => {
    //     console.log("Broooo1");
    //     setLoadingIds(prev => new Set(prev.add(row.getValue('appointmentId'))));

    //     acceptAppointment(row, () => {
    //         handleRemoveAppointment(row);
            
    //         setLoadingIds(prev => {
    //             const newSet = new Set(prev);
    //             newSet.delete(row.getValue('appointmentId'));
    //             return newSet;
    //         });
    //     });
    // };
    

    // const handleAcceptClick = (appointmentId) => {
    //     setLoadingIds(prev => new Set(prev.add(appointmentId)));

    //     acceptAppointment(appointmentId, () => {
    //         handleRemoveAppointment(appointmentId);
    //         setLoadingIds(prev => {
    //             const newSet = new Set(prev);
    //             newSet.delete(appointmentId);
    //             return newSet;
    //         });
    //     });
    // };

    // get the user and fire the data fetch
    useEffect(()=>{

        let cookieValue = biscuits.get('sc_user_detail')
            if(cookieValue){
                const obj = JSON.parse(decodeURIComponent(cookieValue)) // get the cookie data

                // set the user state variable
                setUser(obj)
                
                if(!completed){
                    getCampusesData();
                    getHostelsData();
                    getHostelWiseStrengthsData();
                    // getData();
                    // getDataDetails();
                    getAllRequests(currentStatus, initialDatesValues.from,initialDatesValues.to);
                }
                else {
                    console.log("DONE READING");
                }
                
                // get the requests data if doesnot exist
                // if(!requests){

                //     // set the view by status based on the role
                //     if(obj.role == 'Student'){
                //         console.log('Student');
                //         setViewByStatus('Returned')
                //         getData(obj.role, 'Returned', obj.collegeId, obj.branch);
                //     }
                //     else if(obj.role == 'SuperAdmin' || obj.role == 'Admin'){
                //         console.log('SuperAdmin');
                //         setViewByStatus('Submitted')
                //         getData(obj.role, 'Submitted', obj.collegeId, obj.branch);
                //     }
                //     else if(obj.role == 'OutingAdmin' || obj.role == 'OutingIssuer'){
                //         console.log('OutingAdmin');
                //         setViewByStatus('Approved')
                //         getData(obj.role, 'Approved', obj.collegeId, obj.branch);
                //     }
                //     else if(obj.role == 'OutingAssistant'){
                //         console.log('OutingAssistant');
                //         setViewByStatus('Issued')
                //         getData(obj.role, 'Issued', obj.collegeId, obj.branch);
                //     }   
                // }
            }
            else{
                console.log('Not found')
                router.push('/')
            }

            // if (inView) {
            //     console.log("YO YO YO!");
            //   }
    // });
    // This code will run whenever capturedStudentImage changes
    // console.log('capturedStudentImage'); // Updated value
    // console.log(capturedStudentImage); // Updated value


    },[]);

    // }, [webcamRef]);
   


    // get the campuses data
    // list of campuses will be used for filters
    async function getCampusesData(){
        
        setSearching(true);
        
        try {    
            const campusesResult  = await getCampuses(process.env.NEXT_PUBLIC_API_PASS)
            const queryCResult = await campusesResult.json() // get data

            // check for the status
            if(queryCResult.status == 200){

                // check if data exits
                if(queryCResult.data.length > 0){

                    // set the state
                    setCampuses(queryCResult.data)
                    setDataFound(true);
                }
                else {                    
                    setDataFound(false);
                }

                setSearching(false);
                setCompleted(false);
            }
            else {
                
                setSearching(false);
                setDataFound(false);
                setCompleted(true);
            }
        }
        catch (e){
            
            // show and hide message
            setResultType('error');
            setResultMessage('Issue loading. Please refresh or try again later!');
            console.log(e.message);
            setTimeout(function(){
                setResultType('');
                setResultMessage('');
            }, 3000);
        }
}

    // get the hostels data
    // list of hostels will be used for filters
    async function getHostelsData(){
        
        setSearching(true);
        
        try {    
            const hostelsResult  = await getHostels(process.env.NEXT_PUBLIC_API_PASS)
            const queryHResult = await hostelsResult.json() // get data

            // check for the status
            if(queryHResult.status == 200){

                // check if data exits
                if(queryHResult.data.length > 0){

                    // set the state
                    setHostels(queryHResult.data)
                    setDataFound(true);
                }
                else {                    
                    setDataFound(false);
                }

                setSearching(false);
                setCompleted(false);
            }
            else {
                
                setSearching(false);
                setDataFound(false);
                setCompleted(true);
            }
        }
        catch (e){
            
            // show and hide message
            setResultType('error');
            setResultMessage('Issue loading. Please refresh or try again later!');
            console.log(e.message);
            setTimeout(function(){
                setResultType('');
                setResultMessage('');
            }, 3000);
        }
}
    // get the hostels wise strengths data
    async function getHostelWiseStrengthsData(){
        
        setSearching(true);
        
        try {    
            const hostelsResult  = await getHostelWiseStrengths(process.env.NEXT_PUBLIC_API_PASS)
            const queryHResult = await hostelsResult.json() // get data

            // check for the status
            if(queryHResult.status == 200){

                // check if data exits
                if(queryHResult.data.length > 0){

let totalSum = 0;
let inOutingSum = 0;
let inHostelSum = 0;

// Calculate the sums
queryHResult.data.forEach(hostel => {
    totalSum += hostel.total;
    inOutingSum += parseInt(hostel.InOuting);
    inHostelSum += parseInt(hostel.InHostel);
});

setTotalHostelsStrength(totalSum);
setTotalInOutingStrength(inOutingSum);
setTotalInHostelStrength(inHostelSum);

// Create the new object
// const allHostelsSummary = {
//   hostelName: 'All',
//   total: totalHostelsStrength,
//   InOuting: totalInOutingStrength,
//   InHostel: totalInHostelStrength
// };

// Add the new object to the start of the array
// queryHResult.data.unshift(allHostelsSummary);

                    // if(studentsList==null){
                    //    setStudentsList(queryResult.data)
                    // }
                    // else {
                    //     setStudentsList((studentsList) => [...studentsList, ...queryResult.data]);
                    // }

                    // set the state
                    // queryHResult.data.push(HostelStrength);
                    setHostelStrengths(queryHResult.data)
                    setDataFound(true);
                }
                else {                    
                    setDataFound(false);
                }

                setSearching(false);
                setCompleted(false);
            }
            else {
                
                setSearching(false);
                setDataFound(false);
                setCompleted(true);
            }
        }
        catch (e){
            
            // show and hide message
            setResultType('error');
            setResultMessage('Issue loading. Please refresh or try again later!');
            console.log(e.message);
            setTimeout(function(){
                setResultType('');
                setResultMessage('');
            }, 3000);
        }
}

    // get basic stats
    async function getData(){
        
        setSearching(true);
        setOffset(offset+10); // update the offset for every call

        try {    
            const result  = await getStats(process.env.NEXT_PUBLIC_API_PASS, JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).role, JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).branch)
            const queryResult = await result.json() // get data

            // check for the status
            if(queryResult.status == 200){

                // check if data exits
                if(queryResult.data.length > 0){

                    // set the state
                    // total students
                    // const result = queryResult.data;

                    // const worksheet = xlsx.utils.json_to_sheet(result);
                    // const workbook = xlsx.utils.book_new();
                    // xlsx.utils.book_append_sheet(workbook,worksheet,'Sheet 123');
                    // xlsx.writeFile(workbook, 'sample1234.xlsx');


                    // Create a document
                    // var doc = new PDFDocument();
                    // var stream = doc.pipe(blobStream());
                    // doc.fontSize(25).text('Here is some vector graphics...', 100, 80);
                    // // end and display the document in the iframe to the right
                    // doc.end();
                    // stream.on('finish', function() {
                    // iframe.src = stream.toBlobURL('application/pdf');
                    // });
//                     doc.text("Hello world!", 10, 10);
// doc.save("a4.pdf");

                    // Initialize counters
                    let inHostel = 0;
                    let totalStrength = 0;

                    // Iterate through the array
                    for (const element of result) {
                        if (element.requestStatus === 'InOuting') {
                            inHostel += element.count;
                        }

                        if (element.requestStatus === 'InCampus') {
                            totalStrength += element.count;
                            setTotalStudents(element.count)
                        }
                        if (element.requestStatus === 'InOuting') {
                            setRequestsInOuting(element.count)
                        }
                        if (element.requestStatus === 'Issued') {
                            setRequestsIssued(element.count)
                        }
                        if (element.requestStatus === 'Approved') {
                            setRequestsApproved(element.count)
                        }
                        if (element.requestStatus === 'Submitted') {
                            setRequestsPending(element.count)
                        }
                    }

                    // Calculate studentsInCampus
                    setStudentsInCampus(totalStrength - inHostel);
                    
                    
                    // setStudentsGraph({name:'Total',value: totalStrength},{name: 'In campus',value:studentsInCampus});
                    
                    // setTotalStudents(result[0].requestStatus);
                    // setStudentsInCampus(result[0].requestStatus);
                    // setStudentsInCampus(queryResult.data[7].count);

                    // check if students are present and accordingly add students list
                    // if(studentsList==null){
                    //    setStudentsList(queryResult.data)
                    // }
                    // else {
                    //     setStudentsList((studentsList) => [...studentsList, ...queryResult.data]);
                    // }
                    // set data found
                    setDataFound(true);
                }
                else {
                    
                    setDataFound(false);
                }

                setSearching(false);
                setCompleted(false);
            }
            else if(queryResult.status == 401) {
                
                setSearching(false);
                setDataFound(false);
                setCompleted(true);
            }
            else if(queryResult.status == 404) {
                
                setSearching(false);
                setDataFound(false);
                setCompleted(true);
            }
            else if(queryResult.status == 201) {
                
                setSearching(false);
                setDataFound(false);
                setCompleted(true);
            }
        }
        catch (e){
            
            // show and hide message
            setResultType('error');
            setResultMessage('Issue loading. Please refresh or try again later!');
            console.log(e.message);
            setTimeout(function(){
                setResultType('');
                setResultMessage('');
            }, 3000);
        }
}

    // get the requests data
    // for the user based on their role.
    // the actions will be seen that are specific to the role and by the selected status
    async function getDataDetails(){
        
        setSearching(true);
        setOffset(offset+10); // update the offset for every call

        try {    
            const result  = await getDetailedStats(process.env.NEXT_PUBLIC_API_PASS, JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).role, JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).branch, dayjs(today.toDate()).format("YYYY-MM-DD"))
            console.log(result);
            const queryResult = await result.json() // get data
            console.log(queryResult);

            // check for the status
            if(queryResult.status == 200){

                // check if data exits
                if(queryResult.data.length > 0){

                    // set the state
                    // outing data
                    setOutingData(queryResult.data.slice(0, 4).reverse());
                    
                    setDataFound(true);
                }
                else {
                    
                    setDataFound(false);
                }

                setSearching(false);
                setCompleted(false);
            }
            else if(queryResult.status == 401) {
                
                setSearching(false);
                setDataFound(false);
                setCompleted(true);
            }
            else if(queryResult.status == 404) {
                
                setSearching(false);
                setDataFound(false);
                setCompleted(true);
            }
            else if(queryResult.status == 201) {
                
                setSearching(false);
                setDataFound(false);
                setCompleted(true);
            }
        }
        catch (e){
            
            // show and hide message
            setResultType('error');
            setResultMessage('Issue loading. Please refresh or try again later!');
            setTimeout(function(){
                setResultType('');
                setResultMessage('');
            }, 3000);
        }
}


    // Get requests for a particular role
    // role – SuperAdmin
    // 2 requestStatus – Approved, Issued or All
    // 3 offset – 0
    // 4 collegeId - Super33
    // 5 branches – IT, CSE or All
    // 6 requestType – 1,2,3 or All
    // 7 platformType – 111 (web) or 000 (mobile)
    // 8 year – 1,2,3,4 or All
    // 9 campusId - SVECW or All
    // 10 dates – from,to
    async function getAllRequests(status, from, to){
        
        setSearching(true);
        setOffset(offset+0); // update the offset for every call

        try {    
            // var dates = dayjs(today.toDate()).format("YYYY-MM-DD") + "," + dayjs(today.toDate()).format("YYYY-MM-DD");
            var dates = dayjs(from).format("YYYY-MM-DD") + "," + dayjs(to).format("YYYY-MM-DD");
            
            var paramBranchYears;
            if(selectedBranchYears.length > 0){
                paramBranchYears = selectedBranchYears.map(branchYear => `${selectedCourse}-${branchYear}`)
            }
            else {
                paramBranchYears = 'All';
            }
            // const result  = await getAllRequestsDataAPI(process.env.NEXT_PUBLIC_API_PASS, 
            console.log("/api/psych/admin/appointments/"+process.env.NEXT_PUBLIC_API_PASS+"/"+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).role+"/S1/"+status+"/"+0+"/"+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).collegeId+"/"+selectedCampus);
            const result  = await getAllAppointmentsDataAPI(process.env.NEXT_PUBLIC_API_PASS, 
                JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).role, 
                status, 
                0, 
                JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).collegeId, selectedCampus)
            
            // const result  = await getAllRequestsDataAPI(process.env.NEXT_PUBLIC_API_PASS, JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).role, status, 0, JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).collegeId, 'CSE,IT', 'All', '111', '0', JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).campusId, dates, 'BTECH-IT-2,BTECH-IT-3')
            const queryResult = await result.json() // get data

            console.log(queryResult);
            // check for the status
            if(queryResult.status == 200){

                // check if data exits
                if(queryResult.newdata.length > 0){

                    // set the state
                    // outing data
                    
                    setAllRequests(queryResult.newdata);
                    // if(allRequests.length > 0){
                    //     setAllRequests(allRequests.push(queryResult.data));
                    // }
                    // else{
                    //     setAllRequests(queryResult.data);
                    // }
                    
                    setDataFound(true);
                }
                else {
                    setAllRequests(queryResult.newdata);
                    setDataFound(false);
                }

                setSearching(false);
                setCompleted(false);
            }
            else if(queryResult.status == 401) {
                
                setSearching(false);
                setDataFound(false);
                setCompleted(true);
            }
            else if(queryResult.status == 404) {
                setAllRequests([]);
                toast({
                    description: "No more requests with "+status+" status",
                  })
                  
                setSearching(false);
                setDataFound(false);
                setCompleted(true);
            }
            else if(queryResult.status == 201) {
                
                setSearching(false);
                setDataFound(false);
                setCompleted(true);
            }
        }
        catch (e){
            
            // show and hide message
            setResultType('error');
            setResultMessage('Issue loading. Please refresh or try again later!');
            setTimeout(function(){
                setResultType('');
                setResultMessage('');
            }, 3000);
        }
}


  // Function to remove an appointment from the list
  const handleRemoveAppointment = (row) => {
    const updatedAppointments = allRequests.filter(item => item.appointmentId !== row.getValue('appointmentId'));
    setAllRequests(updatedAppointments);
};

    // 1 stage
    // 2 appointmentId
    // 3 collegeId
    // 4 adminId
    // 5 updatedOn
    // 6 playerId
    // 7 notes
//     async function updateAppointment(appointmentId){
        
//         setSearching(true);
//         setOffset(offset+0); // update the offset for every call

//         try {    
//             // var dates = dayjs(today.toDate()).format("YYYY-MM-DD") + "," + dayjs(today.toDate()).format("YYYY-MM-DD");
//             var updatedOn = dayjs(from).format("YYYY-MM-DD");
            
//             // const result  = await getAllRequestsDataAPI(process.env.NEXT_PUBLIC_API_PASS, 
//             console.log("/api/psych/updateappointment/"+process.env.NEXT_PUBLIC_API_PASS+"/S1/"+appointmentId+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).collegeId+"/"+appointmentId+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).username+"/"+updatedOn);
//             const result  = await getAllAppointmentsDataAPI(process.env.NEXT_PUBLIC_API_PASS+"/S1/"+appointmentId+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).collegeId+"/"+appointmentId+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).username+"/"+updatedOn)
            
//             // const result  = await getAllRequestsDataAPI(process.env.NEXT_PUBLIC_API_PASS, JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).role, status, 0, JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).collegeId, 'CSE,IT', 'All', '111', '0', JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).campusId, dates, 'BTECH-IT-2,BTECH-IT-3')
//             const queryResult = await result.json() // get data

//             console.log(queryResult);
//             // check for the status
//             if(queryResult.status == 200){

//                 // check if data exits
//                 if(queryResult.newdata.length > 0){

//                     // set the state
//                     // outing data
                    
//                     setAllRequests(queryResult.newdata);
//                     // if(allRequests.length > 0){
//                     //     setAllRequests(allRequests.push(queryResult.data));
//                     // }
//                     // else{
//                     //     setAllRequests(queryResult.data);
//                     // }
                    
//                     setDataFound(true);
//                 }
//                 else {
//                     setDataFound(false);
//                 }

//                 setSearching(false);
//                 setCompleted(false);
//             }
//             else if(queryResult.status == 401) {
                
//                 setSearching(false);
//                 setDataFound(false);
//                 setCompleted(true);
//             }
//             else if(queryResult.status == 404) {
//                 setAllRequests([]);
//                 toast({
//                     description: "No more requests with "+status+" status",
//                   })
                  
//                 setSearching(false);
//                 setDataFound(false);
//                 setCompleted(true);
//             }
//             else if(queryResult.status == 201) {
                
//                 setSearching(false);
//                 setDataFound(false);
//                 setCompleted(true);
//             }
//         }
//         catch (e){
            
//             // show and hide message
//             setResultType('error');
//             setResultMessage('Issue loading. Please refresh or try again later!');
//             setTimeout(function(){
//                 setResultType('');
//                 setResultMessage('');
//             }, 3000);
//         }
// }

function downloadRequestsNow() {
    const result = allRequests;

    const worksheet = xlsx.utils.json_to_sheet(result);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook,worksheet,'Sheet 123');
    xlsx.writeFile(workbook, selectedCampus+'_'+currentStatus+'_'+dayjs(from).format("YYYY-MM-DD") + "," + dayjs(to).format("YYYY-MM-DD")+'.xlsx');
}

function downloadHostelsDataNow() {
    console.log("Downloading...");
    const result = hostelStrengths;
    const strengthsExcludingHostelId = hostelStrengths.map(({ hostelId, ...rest }) => rest);

// console.log(strengthsExcludingHostelId);

    const worksheet = xlsx.utils.json_to_sheet(strengthsExcludingHostelId);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook,worksheet,'All Hostels');
    xlsx.writeFile(workbook, 'HostelStrength_'+dayjs(today.toDate()).format("DD-MM-YYYY").toString()+'.xlsx');
}

// update the date selection
function changeDatesSelection(value) {
// console.log(initialDatesValues.from);
// console.log((initialDatesValues.to!=null));

setInititalDates({from:dayjs(value.from),  to:dayjs((value.to!=null)?value.to:value.from)});
// setInititalDates(dayjs(new Date(value.from)).format('YYYY-MM-DD HH:mm:ss'),  dayjs(new Date(value.from)).format('YYYY-MM-DD HH:mm:ss'));
// console.log(value.from);
// console.log(value.to);
// console.log('bro');
// console.log(initialDatesValues.to);

    getAllRequests(currentStatus, dayjs(value.from),dayjs((value.to!=null)?value.to:value.from));
}

// update the currentStatus variable
function getLatestRequests() {
    // console.log(value);
    // setCurrentStatus(value);
    getAllRequests(currentStatus, initialDatesValues.from,initialDatesValues.to);
}

// update the currentStatus variable
function updateStatus(value) {
    getAllRequests(value, initialDatesValues.from,initialDatesValues.to);
    
    setCurrentStatus(value);
    
}
// update the currentStatus variable
function updateOffset(value) {
    // console.log(offset);
    setOffset(offset+20);
    getAllRequests(value, initialDatesValues.from,initialDatesValues.to);
}
const handleCampusChange = (newCampusId) => {
    console.log(newCampusId);
    setSelectedCampus(newCampusId);

    campuses.map((campus) => {
                    
        if(campus.campusId == newCampusId){
            setCourses(campus.courses.split(','));
        }
    })
  };
const handleCourseChange = (newCourse) => {
    console.log(newCourse);
    setSelectedCourse(newCourse);

    campuses.map((campus) => {
                    
        if(campus.campusId == selectedCampus){
            
            let depts = campus.departments.split(',');
            var selectedDepts = [];
            depts.map((dept) => {
                if(dept.includes(newCourse)){
                    selectedDepts.push(dept);
                }
            })
            setDepartments(selectedDepts);
            console.log(selectedDepts);

            setBranches(Array.from(new Set(selectedDepts.map(dept => dept.split('-')[1]))));
            console.log(Array.from(new Set(selectedDepts.map(dept => dept.split('-')[1]))));

            setBranchYears(Array.from(new Set(selectedDepts.map(dept => {
                const parts = dept.split('-');
                return `${parts[1]}-${parts[2]}`;
              }))));
            console.log(Array.from(new Set(selectedDepts.map(dept => {
                const parts = dept.split('-');
                return `${parts[1]}-${parts[2]}`;
              }))));
            
        }
    })
  };

  // used to update selected branch and select corresponding branch years
  const handleBranchChange = (branch) => {
    let updatedSelectedBranches = [...selectedBranches];
    let updatedSelectedBranchYears = [...selectedBranchYears];
  
    if (updatedSelectedBranches.includes(branch)) {
      updatedSelectedBranches = updatedSelectedBranches.filter(b => b !== branch);
      updatedSelectedBranchYears = updatedSelectedBranchYears.filter(by => !by.startsWith(branch));
    } else {
      updatedSelectedBranches.push(branch);
      const relatedBranchYears = branchYears.filter(by => by.startsWith(branch));
      updatedSelectedBranchYears = [...new Set([...updatedSelectedBranchYears, ...relatedBranchYears])];
    }
  
    setSelectedBranches(updatedSelectedBranches);
    setSelectedBranchYears(updatedSelectedBranchYears);
    console.log(updatedSelectedBranchYears);
  };

  // used to update branch years and select/deselect corresponding branches
  const handleBranchYearChange = (branchYear) => {
    let updatedSelectedBranchYears = [...selectedBranchYears];
    const branch = branchYear.split('-')[0];
  
    if (updatedSelectedBranchYears.includes(branchYear)) {
      updatedSelectedBranchYears = updatedSelectedBranchYears.filter(by => by !== branchYear);
    } else {
      updatedSelectedBranchYears.push(branchYear);
    }
  
    const relatedBranchYears = branchYears.filter(by => by.startsWith(branch));
    const isAllSelected = relatedBranchYears.every(by => updatedSelectedBranchYears.includes(by));
  
    let updatedSelectedBranches = [...selectedBranches];
    if (isAllSelected) {
      if (!updatedSelectedBranches.includes(branch)) {
        updatedSelectedBranches.push(branch);
      }
    } else {
      updatedSelectedBranches = updatedSelectedBranches.filter(b => b !== branch);
    }
  
    setSelectedBranchYears(updatedSelectedBranchYears);
    setSelectedBranches(updatedSelectedBranches);

    console.log(updatedSelectedBranchYears);
  };

//   function acceptAppointment(row) {
//     // logic to edit the row with this id
//     console.log('Editing row with id:', row);
//     console.log('Editing row with id:', row.getValue("requestStatus"));
//   }
  
  function printRequests() {
    // logic to edit the row with this id
    console.log('Editing row with id:');
    console.log(requests);
  }
  
    
  
    
  return (
    
        <div className={styles.verticalsection} style={{height:'100vh',gap:'16px'}}>
            
          <div className={dmSans.className} style={{height:'8vh',display:'flex',flexDirection:'column',justifyContent:'space-around', marginTop:'20px'}}>
              {/* <h1 className="text-3xl font-bold leading-normal">Appointments</h1> */}
              <div className={styles.horizontalsection}>
                <h1 className="text-3xl font-bold leading-normal">Appointments</h1>
                {searching ? <SpinnerGap className={`${styles.icon} ${styles.load}`} /> : ''}
              </div>
              <p className="text-sm text-slate-500">Received based on your availability</p>
              
          </div>      
          
            {/* <div style={{width:'100%',display:'flex', flexDirection:'row',justifyContent:'space-between'}}>
                <div className={styles.horizontalsection}>
                <Button  onClick={getDataData}>
                  <Plus className="mr-2 h-4 w-4" /> Declare outing
                </Button>
                    <div className={`${styles.primarybtn} `} style={{display:'flex', flexDirection:'row', width:'fit-content', cursor:'pointer', gap:'4px'}} onClick={toggleShowBlockOuting}> 
                        <Plus />
                        <p className={`${inter.className}`}>Declare outing</p>
                    </div> */}
                    {/* <BlockDatesBtn titleDialog={false} /> */}
                    {/* <OutingRequest /> */}
                    {/* <div className={`${styles.overlayBackground} ${showBlockOuting ? styles.hideshowdivshow : styles.hideshowdiv}`}>
                        <BlockDatesBtn toggleShowBlockOuting={toggleShowBlockOuting} titleDialog={false} /> 
                    </div>
                </div>
               
            </div> */}
          
           
          
         
    <div className={styles.verticalsection} style={{height:'80vh', width:'100%',gap:'8px'}}>

        {/* <div className={styles.horizontalsection} style={{height:'100%', width:'100%'}}> */}

        {/* <RadioGroup defaultValue={(viewTypeSelection == 'college') ? "college" : "hostel"} value={viewTypeSelection} onValueChange={setViewTypeSelection} className="flex flex-row items-center">
            <Label className="text-sm text-muted-foreground">View by:</Label>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="college" id="r11" />
                <Label htmlFor="r11" className="text-md font-medium">Colleges</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="hostel" id="r22" />
                <Label htmlFor="r22" className="text-md font-medium">Hostels</Label>
            </div>
        </RadioGroup> */}


{/* <div className="p-2 border rounded flex flex-row " style={{height:'fit-content', gap: '40px'}}>
        
    <div className={`${inter.className}`} style={{display:'flex',flexWrap:'wrap',alignItems:'center',gap:'8px',height:'fit-content'}}>
        <div className="flex-1 text-sm text-muted-foreground">Total Hostels Strength:</div>
        {searching ? <div className={styles.horizontalsection}>
            <SpinnerGap className={`${styles.icon} ${styles.load}`} />
            <p className={`${inter.className} ${styles.text3}`}>Loading ...</p> 
        </div> : ''}
        <h1>{totalHostelsStrength}</h1>
    </div>
    
    <div className={`${inter.className}`} style={{display:'flex',flexWrap:'wrap',alignItems:'center',gap:'8px',height:'fit-content'}}>
        
        <div className="flex-1 text-sm text-muted-foreground">In Outing:</div>
        {searching ? <div className={styles.horizontalsection}>
            <SpinnerGap className={`${styles.icon} ${styles.load}`} />
            <p className={`${inter.className} ${styles.text3}`}>Loading ...</p> 
        </div> : ''}
        <h1>{totalInOutingStrength}</h1>
    </div>
    <div className={`${inter.className}`} style={{display:'flex',flexWrap:'wrap',alignItems:'center',gap:'8px',height:'fit-content'}}>
        
        <div className="flex-1 text-sm text-muted-foreground">In Hostel:</div>
        {searching ? <div className={styles.horizontalsection}>
            <SpinnerGap className={`${styles.icon} ${styles.load}`} />
            <p className={`${inter.className} ${styles.text3}`}>Loading ...</p> 
        </div> : ''}
        <h1>{totalInHostelStrength}</h1>
    </div>
</div> */}

        {(viewTypeSelection == 'college') ? 
        <div className="flex items-center py-2" style={{gap:'10px'}}>
            {/* {(campuses.length != 0) ?
            <div>
                <div className="flex-1 text-sm text-muted-foreground">
                    Colleges:
                </div>
                <Select onValueChange={handleCampusChange} defaultValue="All">
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent >
                        <SelectItem value='All'>All</SelectItem>
                        {
                            campuses.map((campus) => <SelectItem key={campus.campusId} value={campus.campusId}>{campus.campusId}</SelectItem>)
                        }
                </SelectContent>
                </Select>
            </div>
            : <br/>
            } */}

            {/* show courses */}
            {/* {(selectedCampus!=null && selectedCampus != 'All' && courses.length > 0) ?
                <div>
                    <div className="flex-1 text-sm text-muted-foreground">
                        Courses:
                    </div>
                    <Select onValueChange={handleCourseChange} >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                            <SelectItem value='All'>All</SelectItem>
                            {
                                courses.map((course) => <SelectItem key={course} value={course}>{course}</SelectItem>)
                            }
                    </SelectContent>
                    </Select>
                </div>
                : <br/>
            } */}

            {/* branches selection */}
            {/* {(branches.length) > 0 ?
                <Drawer>
                <DrawerTrigger className="flex flex-col flex-start">
                    <div className="text-sm">
                    Branches and Years:
                    </div>
                    {(branchTypeSelection != 'all') ? 
                        <Button variant="outline">{(selectedBranchYears.length > 0) ? selectedBranchYears.length+' Selected' : 'Select Branches and Years'}</Button>
                        : <Button variant="outline">All Branches & years Selected</Button>
                    }
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                    <DrawerTitle>Select branches</DrawerTitle>
                    <DrawerDescription>Select all or group of branches and their years.</DrawerDescription>
                    </DrawerHeader>    
            
                    <div className="p-4 pb-0">
                        
                        <RadioGroup defaultValue={(branchTypeSelection == 'all') ? "all" : "notall"} value={branchTypeSelection} onValueChange={setBranchTypeSelection}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="all" id="r1" />
                                <Label htmlFor="r1" className="text-md font-medium">All branches & years</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="notall" id="r2" />
                                <Label htmlFor="r2" className="text-md font-medium">Select branches & years</Label>
                            </div>
                        </RadioGroup>
                        <br/>
                        {(branchTypeSelection != 'all') ? 

                            <div style={{display: 'flex',flexDirection:'column',gap:'20px'}}>

                                <div style={{display: 'flex',flexDirection:'row',gap:'20px'}}>
                                    {branches.map(branch => (
                                        <div className="flex items-center space-x-2" style={{cursor:'pointer',width:'fit-content'}}  key={branch}>
                                            <Checkbox id={branch} checked={selectedBranches.includes(branch)} onCheckedChange={()=>handleBranchChange(branch)}/>
                                            <label htmlFor={branch} className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                {branch}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <Separator className="my-4" />
                                <div style={{display: 'flex',flexDirection:'column',flexWrap:'wrap',gap:'20px',height:'240px'}}>
                                    {branchYears.map(branchYear => (

                                        <div className="flex items-center space-x-2" style={{ cursor:'pointer'}}  key={branchYear}>
                                        <Checkbox id={branchYear} checked={selectedBranchYears.includes(branchYear)} onCheckedChange={()=>handleBranchYearChange(branchYear)}/>
                                        <label htmlFor={branchYear} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            {branchYear}
                                        </label>
                                        </div>
                                        
                                    ))}
                                </div>
                            </div>
                            : null
                        }


                    </div>
                    <Separator className="my-4" />
                    <DrawerFooter>
                    
                    <DrawerClose className="sm:justify-start">
                        <Button type="submit" size="sm" className="px-3">Save</Button>&nbsp;&nbsp;
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
                </Drawer>
            : null} */}

        {/* {(campuses.length != 0) ?
        <div>
            <br/>
            <Button type="submit" size="sm" className="px-3" onClick={getLatestRequests}>Go</Button>
        </div>
        : null } */}

        </div>

        :

        <div className="flex items-center py-2" style={{gap:'10px'}}>
            {(hostels.length != 0) ?
            <div>
                <div className="flex-1 text-sm text-muted-foreground">
                    Hostels:
                </div>
                <Select onValueChange={handleCampusChange} defaultValue="All">
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent >
                {/* <SelectGroup >
                    <SelectLabel>Colleges</SelectLabel> */}
                        <SelectItem value='All'>All</SelectItem>
                        {
                            hostels.map((hostel) => <SelectItem key={hostel.hostelId} value={hostel.hostelId}>{hostel.hostelName}</SelectItem>)
                        }
                {/* </SelectGroup> */}
                </SelectContent>
                </Select>
            </div>
            : null}
        </div>
    }



{/*     
<Select
      value={selectedCampus}
      onChange={setSelectedCampus}
      items={campusItems}
    /> */}


{/* {(allRequests.length !=0) ? */}
<div className="mx-auto" style={{width:'100%',height:'100%'}}>
{/* <div className="container mx-auto py-10"> */}
{/* <div>{allRequests.length}</div> */}
      <DataTable columns={columns} data={allRequests} status={currentStatus} changeStatus={updateStatus} downloadNow={downloadRequestsNow} initialDates={initialDatesValues} dates={changeDatesSelection} requestAgain={updateOffset} loadingIds={loadingIds} removeAppointment={handleRemoveAppointment} handleAcceptClick={handleAcceptClick} handleCompleteClick={handleCompleteClick} handleCancelClick={handleCancelClick} handleTimeUpdateClick={handleTimeUpdateClick} />
      {/* <DataTable columns={columns} data={allRequests} status={currentStatus} changeStatus={updateStatus} downloadNow={downloadRequestsNow} initialDates={initialDatesValues} dates={changeDatesSelection} requestAgain={updateOffset} takeAction={acceptAppointment}/> */}
      
    </div>
    {/* : null} */}



 {/* <div className="md:hidden">
        <Image
          src="/examples/tasks-light.png"
          width={1280}
          height={998}
          alt="Playground"
          className="block dark:hidden"
        />
        <Image
          src="/examples/tasks-dark.png"
          width={1280}
          height={998}
          alt="Playground"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <UserNav />
          </div>
        </div>
        <DataTable data={allRequests} columns={columns} />
      </div> 

                 <div className={styles.carddatasection} key={12345} style={{height:'100%',overflow:'scroll'}}>
                       
                    <div className={styles.verticalsection} >
                        <p className={`${inter.className} ${styles.text3_heading}`}>Students</p>
                        <div className={styles.horizontalsection}>
                            <p className={`${inter.className} ${styles.text3_heading}`}>Total:</p>
                            <div className={`${inter.className}`} style={{display:'flex',flexWrap:'wrap',alignItems:'center',gap:'8px'}}>
                                
                                {searching ? <div className={styles.horizontalsection}>
                                    <SpinnerGap className={`${styles.icon} ${styles.load}`} />
                                    <p className={`${inter.className} ${styles.text3}`}>Loading ...</p> 
                                </div> : ''}
                                <h1>{studentsInCampus}</h1>
                            </div>
                            
                            <div className={`${inter.className}`} style={{display:'flex',flexWrap:'wrap',alignItems:'center',gap:'8px'}}>
                                
                                <p className={`${inter.className} ${styles.text3_heading}`}>Registered:</p>
                                {searching ? <div className={styles.horizontalsection}>
                                    <SpinnerGap className={`${styles.icon} ${styles.load}`} />
                                    <p className={`${inter.className} ${styles.text3}`}>Loading ...</p> 
                                </div> : ''}
                                <h1>{totalStudents}</h1>
                            </div>
                        </div>
                      </div>
                <div>
                    
                </div>
            </div>  */}
        {/* </div> */}
               
                
        </div>
    
    </div>
    
    
  );
}







// const today = new dayjs();
// export const columns = [
//   // selection
//   {
//     id: "select",
//     header: ({ table }) => (
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected() ||
//           (table.getIsSomePageRowsSelected() && "indeterminate")
//         }
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//     {
//       accessorKey: "collegeId",
//       header: "Student",
//       cell: ({ row }) => {
//         return <div className="flex w-[100px] px-2 py-1 text-md focus:outline-none text-foreground"
//         style={{cursor:'pointer'}}>
                 
//                  <Sheet>
//                   <SheetTrigger className="text-green-700 underline underline-offset-4 text-md text-foreground">{ row.getValue("collegeId")}</SheetTrigger>
//                   <SheetContent>
//                     <SheetHeader>
//                       <SheetTitle>Student Details</SheetTitle>
//                       <SheetDescription>
//                         <h1 className="text-black-700 text-xl text-foreground">{ row.getValue("collegeId")}</h1>
                      
//                       <br/>
//                       <br/>

//                         <div className="flex flex-wrap justify-between items-center py-2.5">
//                             <p>Full name:</p>
//                             <p className="text-black-700 text-md ont-semibold text-foreground">{ row.getValue("collegeId")}</p>
//                         </div>
//                         <Separator />
                        
//                         <div className="flex flex-wrap justify-between items-center py-2.5">
//                             <p>College Regd Id:</p>
//                             <p className="text-black-700 text-md ont-semibold text-foreground">{ row.getValue("collegeId")}</p>
//                         </div>
//                         <Separator />
                        
//                         <Separator />
                        
//                         <Separator />
//                       </SheetDescription>
//                     </SheetHeader>
//                   </SheetContent>
//                 </Sheet>

                  
//                 </div>
//       },
//     },
//     {
//       enableHiding: true,
//       accessorKey: "appointmentId",
//       // header: "College"
//     },
//     {
//       enableHiding: true,
//       accessorKey: "requestStatus",
//     },
//     {
//       accessorKey: "requestDate",
//       // header: "From",
//       header: ({ column }) => {
//         return (
//           <Button
//             variant="ghost"
//             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           >
//             Appointment on
//             <ArrowUpDown className="ml-2 h-4 w-4" />
//           </Button>
//         )
//       },
//       cell: ({ row }) => {
//         return <div>{dayjs(row.getValue("requestDate")).format("DD-MMM'YY hh:mm A")}</div>
//         // return <div>{dayjs(row.getValue("requestDate")).format("DD/MM/YY hh:mm A")}</div>
//       },
//     },
//     {
//       accessorKey: "topic",
//       header: "Topic"
//     },
//     {
//       accessorKey: "description",
//       header: "Description",
//       // header: ({ column }) => (
//       //   <DataTableColumnHeader column={column} title="Description" />
//       // ),
//       cell: ({ row }) => {
//         // const label = labels.find(label => label.value === row.original.label)
  
//         return (
//           <div className="flex space-x-2">
//             {/* {label && <Badge variant="outline">{label.label}</Badge>} */}
//             {/* <span className="max-w-[200px] truncate">
//               {row.getValue("description")}
//             </span> */}
            

//           <TooltipProvider className="flex space-x-2 truncate">
//               <Tooltip>
//                 <TooltipTrigger className="max-w-[200px] truncate"> 
//                     {row.getValue("description")}
//                 </TooltipTrigger>
//                 <TooltipContent>
//                   {/* <p>Add to library</p> */}
//                   {row.getValue("description")}
//                 </TooltipContent>
//               </Tooltip>
//             </TooltipProvider>
//           </div>

//         )
//       }
//     },
//     {
//       accessorKey: "mode",
//       // header: "Year",
//       header: ({ column }) => {
//         return (
//           <Button
//             variant="ghost"
//             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//           >
//             Mode
//             <ArrowUpDown className="ml-2 h-4 w-4" />
//           </Button>
//         )
//       },
//       cell: ({ row }) => {
//         return (row.getValue("mode") == 0) ? <div>In person</div> : <div>Online</div>
//       },
//     },

//     ///////////////////
//     // ACTIONS OF A ROW
//     ///////////////////
//     {
//       id: "actions",
//       cell: ({ row }) => {
//         const payment = row.original
//   //  console.log(payment);
        
//         return (row.getValue("requestStatus") == 'Submitted') ? <div>
//               <Button variant="secondary">Reschedule</Button>
//               &nbsp;
//               <Button type="button" variant="outline" onClick={() => declineAppointment(row)}>Decline</Button>
//               &nbsp;
//               <Button onClick={() => acceptAppointment(row)}>Accept</Button>
//         </div>
//         : null
//         // <div>
//         //       Start
//         // </div>

//       },
//     },

//   ]


  
//   export function acceptAppointment(id) {
//     console.log(`Accepting appointment with ID: ${id.getValue('requestStatus')}`);
//     updateAppointment(id.getValue('appointmentId'), id.getValue('collegeId'))
//     // Additional logic here
//   }

  export function acceptAppointment(row, callback) {
    // Simulate API call
    console.log(`Accepting appointment with ID: ${row.getValue('appointmentId')}`);
    setTimeout(() => {
        // Suppose the API call has completed
        updateAppointment(row)
        console.log(`Appointment ${row.getValue('appointmentId')} accepted.`);
        callback();  // Call the callback function passed
    }, 2000); // Simulate a delay
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
  

    // appointmentId, adminId, adminName, updatedOn, collegeId
    async function updateAppointment(row, handleRemoveAppointment, callback){

      try {    
          var updatedOn = dayjs(new dayjs()).format("YYYY-MM-DD");
          
          console.log("/api/psych/updateappointment/"+process.env.NEXT_PUBLIC_API_PASS+"/S1/"+row.getValue('appointmentId')+"/"+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).collegeId+"/"+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).username+"/"+updatedOn+"/"+row.getValue('collegeId'));
          const result  = await updateAppointmentsDataAPI(process.env.NEXT_PUBLIC_API_PASS+"/S1/"+row.getValue('appointmentId')+"/"+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).collegeId+"/"+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).username+"/"+updatedOn+"/"+row.getValue('collegeId'))
          const queryResult = await result.json() // get data

          // check for the status
          if(queryResult.status == 200){

            // toast({description: "Appointment updated!",});
            handleRemoveAppointment(row);
            callback();
          }
          else if(queryResult.status == 201) {
              
              // setSearching(false);
              // setDataFound(false);
              // setCompleted(true);
          }
      }
      catch (e){
        //   console.log(e);
      }
    }

    // appointmentId, adminId, adminName, updatedOn, collegeId, notes
    async function completeAppointment(row, notes, handleRemoveAppointment, callback){

      try {    
          var updatedOn = dayjs(new dayjs()).format("YYYY-MM-DD hh:mm:ss");
          
          console.log("/api/psych/updateappointment/"+process.env.NEXT_PUBLIC_API_PASS+"/S3/"+row.getValue('appointmentId')+"/"+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).collegeId+"/"+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).username+"/"+updatedOn+"/"+row.getValue('collegeId')+"/"+notes);
          const result  = await updateAppointmentsDataAPI(process.env.NEXT_PUBLIC_API_PASS+"/S3/"+row.getValue('appointmentId')+"/"+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).collegeId+"/"+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).username+"/"+updatedOn+"/"+row.getValue('collegeId')+"/"+notes)
          const queryResult = await result.json() // get data

          // check for the status
          if(queryResult.status == 200){

            // toast({description: "Appointment updated!",});
            handleRemoveAppointment(row);
            callback();
          }
          else if(queryResult.status == 201) {
              
              // setSearching(false);
              // setDataFound(false);
              // setCompleted(true);
          }
      }
      catch (e){
        //   console.log(e);
      }
    }

    // appointmentId, adminId, adminName, updatedOn, collegeId, notes
    async function cancelAppointment(row, handleRemoveAppointment, callback){

      try {    
          var updatedOn = dayjs(new dayjs()).format("YYYY-MM-DD");
          
          console.log("/api/psych/updateappointment/"+process.env.NEXT_PUBLIC_API_PASS+"/S4/"+row.getValue('appointmentId')+"/"+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).collegeId+"/"+row.getValue('collegeId'));
          const result  = await updateAppointmentsDataAPI(process.env.NEXT_PUBLIC_API_PASS+"/S4/"+row.getValue('appointmentId')+"/"+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).collegeId+"/"+row.getValue('collegeId'))
          const queryResult = await result.json() // get data

          // check for the status
          if(queryResult.status == 200){

            // toast({description: "Appointment updated!",});
            handleRemoveAppointment(row);
            callback();
          }
          else if(queryResult.status == 201) {
              
              // setSearching(false);
              // setDataFound(false);
              // setCompleted(true);
          }
      }
      catch (e){
        //   console.log(e);
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
            // row.toggleVisibility(true);
            printRequests();
            // console.log(allRequests);

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