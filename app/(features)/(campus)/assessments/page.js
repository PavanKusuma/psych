'use client'

import { Inter, DM_Sans, DM_Serif_Text } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
const dmSans = DM_Sans({ subsets: ['latin'] })
const dmSerifText = DM_Serif_Text({weight: "400", subsets: ['latin'] })
import { Check, Info, SpinnerGap, X, Plus } from 'phosphor-react'
import React, { useCallback, useEffect, useState } from 'react'
import styles from '../../../../app/page.module.css'
import Biscuits from 'universal-cookie'
const biscuits = new Biscuits
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/app/components/ui/select'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger,} from "@/app/components/ui/drawer"
import { Separator } from "@/app/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group"
import { Label } from "@/app/components/ui/label"
import { Checkbox } from "@/app/components/ui/checkbox"
import { useToast } from "@/app/components/ui/use-toast"
import { Button } from "@/app/components/ui/button"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from "@/app/components/ui/table"
import {columns} from "./columns"
import {DataTable} from "./data-table"

// get the appointments for PsychAdmin
const getAllAppointmentsDataAPI = async (pass, role, campusId, offset) => 
  
fetch("/api/psych/assessments/"+pass+"/"+role+"/"+campusId+"/"+offset, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// pass state variable and the method to update state variable
export default function Assessments() {
    
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
    const [campuses, setCampuses] = useState([]); 
    const [selectedCampus, setSelectedCampus] = useState('All');
    const [hostels, setHostels] = useState([]);
    const [hostelStrengths, setHostelStrengths] = useState([]);
    const [courses, setCourses] = useState(); const [selectedCourse, setSelectedCourse] = useState(null);
    const [departments, setDepartments] = useState(); 
    
    
    const [branches, setBranches] = useState([]); const [selectedBranch, setSelectedBranch] = useState(null);
    const [branchYears, setBranchYears] = useState(); //const [selectedBranchYears, setSelectedBranchYears] = useState(null);
    const [years, setYears] = useState();

    // branches selection
    const [selectedBranches, setSelectedBranches] = useState([]);
    const [selectedBranchYears, setSelectedBranchYears] = useState([]);

    const [resultType, setResultType] = useState('');
    const [resultMessage, setResultMessage] = useState('');

    const [dataFound, setDataFound] = useState(true); 
    const [searching, setSearching] = useState(false);

    const [outingData, setOutingData] = useState();
    const [allRequests, setAllRequests] = useState([]);
    const pieColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const [initialDatesValues, setInititalDates] = React.useState({from: dayjs().subtract(0,'day'),to: dayjs(),});
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
        
        setLoadingIds(prev => new Set(prev.add(row.getValue('appointmentId'))));

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


    // get the user and fire the data fetch
    useEffect(()=>{

        let cookieValue = biscuits.get('sc_user_detail')
            if(cookieValue){
                const obj = JSON.parse(decodeURIComponent(cookieValue)) // get the cookie data

                // set the user state variable
                setUser(obj)
                
                if(!completed){
                    getAllRequests()
                }
                else {
                    console.log("DONE READING");
                }
                
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
    async function getAllRequests(){
        
        setSearching(true);
        setOffset(offset+0); // update the offset for every call

        try {    
            // var dates = dayjs(today.toDate()).format("YYYY-MM-DD") + "," + dayjs(today.toDate()).format("YYYY-MM-DD");
            // var dates = dayjs(from).format("YYYY-MM-DD") + "," + dayjs(to).format("YYYY-MM-DD");
            
            // var paramBranchYears;
            // if(selectedBranchYears.length > 0){
            //     paramBranchYears = selectedBranchYears.map(branchYear => `${selectedCourse}-${branchYear}`)
            // }
            // else {
            //     paramBranchYears = 'All';
            // }
            // const result  = await getAllRequestsDataAPI(process.env.NEXT_PUBLIC_API_PASS, 
            console.log("/api/psych/assessments/"+process.env.NEXT_PUBLIC_API_PASS+"/"+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).role+"/All/"+offset);
            const result  = await getAllAppointmentsDataAPI(process.env.NEXT_PUBLIC_API_PASS, JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).role, 'All',  offset, )
            
            // const result  = await getAllRequestsDataAPI(process.env.NEXT_PUBLIC_API_PASS, JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).role, status, 0, JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).collegeId, 'CSE,IT', 'All', '111', '0', JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).campusId, dates, 'BTECH-IT-2,BTECH-IT-3')
            const queryResult = await result.json() // get data

            console.log(queryResult);
            // check for the status
            if(queryResult.status == 200){

                // check if data exits
                if(queryResult.data.length > 0){

                    // set the state
                    // outing data
                    
                    setAllRequests(queryResult.data);
                    // if(allRequests.length > 0){
                    //     setAllRequests(allRequests.push(queryResult.data));
                    // }
                    // else{
                    //     setAllRequests(queryResult.data);
                    // }
                    
                    setDataFound(true);
                }
                else {
                    setAllRequests(queryResult.data);
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
                <h1 className="text-3xl font-bold leading-normal">Assessments</h1>
                {searching ? <SpinnerGap className={`${styles.icon} ${styles.load}`} /> : ''}
              </div>
              <p className="text-sm text-slate-500">Availabile assessments to your campus</p>
              
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
      <DataTable columns={columns} data={allRequests} status={currentStatus} downloadNow={downloadRequestsNow} initialDates={initialDatesValues} requestAgain={updateOffset} loadingIds={loadingIds} />
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
          var updatedOn = dayjs(new dayjs()).format("YYYY-MM-DD");
          
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