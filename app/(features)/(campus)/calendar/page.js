'use client'

import { Inter, DM_Sans, DM_Serif_Text } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
const dmSans = DM_Sans({ subsets: ['latin'] })
const dmSerifText = DM_Serif_Text({weight: "400", subsets: ['latin'] })
import { Check, Info, SpinnerGap, X, Plus, Spinner } from 'phosphor-react'
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
import { Skeleton } from "@/app/components/ui/skeleton"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from "@/app/components/ui/table"
import {DataTable} from "./data-table"

// get the appointments for PsychAdmin
const getAllSlotsAPI = async (pass, role, collegeId, offset) => 
  
fetch("/api/psych/calendar/"+pass+"/"+role+"/1/"+collegeId+"/"+offset, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});



const defaultDays = [
    { day: 'Sunday', active: false, slots: [{start: '9:00AM', end: '5:00PM'}] },
    { day: 'Monday', active: true, slots: [{start: '9:00AM', end: '5:00PM'}] },
    { day: 'Tuesday', active: false, slots: [{start: '9:00AM', end: '5:00PM'}] },
    { day: 'Wednesday', active: false, slots: [{start: '9:00AM', end: '5:00PM'}] },
    { day: 'Thursday', active: true, slots: [{start: '9:00AM', end: '5:00PM'}] },
    { day: 'Friday', active: false, slots: [{start: '9:00AM', end: '5:00PM'}] },
    { day: 'Saturday', active: true, slots: [{start: '9:00AM', end: '5:00PM'}] }
  ];
// pass state variable and the method to update state variable
export default function Calendar() {
    
    const { toast } = useToast();
    // const tasks = getTasks()
    // create a router for auto navigation
    const router = useRouter();

    // user state and requests variable
    const [user, setUser] = useState();
    const [offset, setOffset] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [loadingIds, setLoadingIds] = useState(new Set());
    const [isEditMode, setIsEditMode] = useState(false);
    const [unavailableSlots, setUnavailableSlots] = useState([]);
    const [selectStartTime, setSelectedStartTime] = useState([]);
    const [selectEndTime, setSelectedEndTime] = useState([]);
    const [removeProgress, setRemoveProgress] = useState(false);
    const [addProgress, setAddProgress] = useState(false);
    

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };

      
    const [days, setDays] = useState(defaultDays);



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
    const [allNewRequests, setAllNewRequests] = useState([]);

    const [initialDatesValues, setInititalDates] = React.useState({from: dayjs().subtract(0,'day'),to: dayjs(),});
    const [currentStatus, setCurrentStatus] = useState('Submitted');
    
    //create new date object
    const today = new dayjs();
    var unavailableSlots1 = [];

    const handleStartChange = (dayIndex, slotIndex, field, value) => {
        console.log(value);
        const newDays = [...days];
        newDays[dayIndex].slots[slotIndex][field] = value;
        if (field === 'start') {
            newDays[dayIndex].slots[slotIndex].selectedStartTime = value;
        }
        setSelectedStartTime(value)
        setDays(newDays);
    };

    const handleEndChange = (dayIndex, slotIndex, field, value) => {
        const newDays = [...days];
        newDays[dayIndex].slots[slotIndex][field] = value;
        if (field === 'end') {
            newDays[dayIndex].slots[slotIndex].selectedStartTime = value;
        }
        setSelectedEndTime(value)
        setDays(newDays);
    };

    

      const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 0; hour < 24; hour++) {  // Loop through 24 hours
            const hourAMPM = hour % 12 === 0 ? 12 : hour % 12;  // Convert 24-hour time to 12-hour time
            const ampm = hour < 12 ? 'AM' : 'PM';  // Determine AM/PM
    
            // Generate the on-the-hour and half-past-the-hour slots for each hour
            slots.push(`${hourAMPM}:00 ${ampm}`);
            slots.push(`${hourAMPM}:30 ${ampm}`);
        }
        // console.log(slots);
        return slots;
    };

      const timeSlots = generateTimeSlots();

    
    // Function to generate 30-minute time slots for a specific day
    function generateTimeSlotsForDay2(dayData, timeSlot) {
        // console.log(dayData);
        const timeSlots1 = [];
        
        const dataData = allRequests.find(request => request.day === dayData);
        // console.log("dataData");
        // console.log(dataData);
        if(dataData!= null && dataData.slots!= null){
            for (const slot of dataData.slots) {
            let currentTime = dayjs(`2022-01-01 ${slot.start}`); // Arbitrary date, time is what matters
            const endTime = dayjs(`2022-01-01 ${slot.end}`);
        
            while (currentTime.isBefore(endTime)) {
                timeSlots1.push(currentTime.format('H:mm A'));
                currentTime = currentTime.add(30, 'minute');
            }
            }
        
            return timeSlots1.includes(timeSlot);
        }
        else {
            return false
        }
        // return timeSlots1;
    }

    // get 12 hours format to display
    function formatTime24To12(timeStr) {
        const [hour, minute] = timeStr.split(':');  // Split the time string into hour and minute
        const hourInt = parseInt(hour, 10);  // Convert hour to an integer
        const isPM = hourInt >= 12;  // Check if it's PM
        const formattedHour = ((hourInt % 12) || 12).toString();  // Convert 24h to 12h format, handle noon/midnight
        const amPm = isPM ? 'PM' : 'AM';
    
        if(minute.split(' ').length > 1){
            return `${formattedHour}:${minute.split(' ')[0]} ${minute.split(' ')[1]}`;
        }
        else {
            return `${formattedHour}:${minute} ${amPm}`;
        }
    }
      
    
    
    // get the user and fire the data fetch
    useEffect(()=>{

        let cookieValue = biscuits.get('sc_user_detail')
            if(cookieValue){
                const obj = JSON.parse(decodeURIComponent(cookieValue)) // get the cookie data

                // set the user state variable
                setUser(obj)
                
                if(!completed && allRequests.length == 0){
                    getTimeSlots()
                }
                else {
                    console.log("DONE READING");
                }
                
            }
            else{
                console.log('Not found')
                router.push('/')
            }


    },[]);

    // get the timeslots of a admin
    async function getTimeSlots(){
        
        setSearching(true);
        setOffset(offset+0); // update the offset for every call

        try {    
            
            // const result  = await getTimeSlotsDataAPI(process.env.NEXT_PUBLIC_API_PASS, 
            // console.log("/api/psych/calendar/"+process.env.NEXT_PUBLIC_API_PASS+"/"+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).role+"/1/"+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).collegeId+offset);
            const result  = await getAllSlotsAPI(process.env.NEXT_PUBLIC_API_PASS, JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).role, JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).collegeId,  offset, )
            
            // const result  = await getTimeSlotsDataAPI(process.env.NEXT_PUBLIC_API_PASS, JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).role, status, 0, JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).collegeId, 'CSE,IT', 'All', '111', '0', JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).campusId, dates, 'BTECH-IT-2,BTECH-IT-3')
            const queryResult = await result.json() // get data

            // console.log(queryResult);
            // check for the status
            if(queryResult.status == 200){

                // check if data exits
                if(queryResult.data.length > 0){

                    // console.log(queryResult.data);
                    setAllRequests(queryResult.data);

                    queryResult.data.map((request, requestIndex) => {
                        
                            const timeSlots1 = [];
            
                            for (const slot of request.slots) {
                            let currentTime = dayjs(`2022-01-01 ${slot.start}`); // Arbitrary date, time is what matters
                            const endTime = dayjs(`2022-01-01 ${slot.end}`);
                        
                            while (currentTime.isBefore(endTime)) {
                                timeSlots1.push(currentTime.format('H:mm A'));
                                currentTime = currentTime.add(30, 'minute');
                                }
                            }
                            
                            let dayName = request.day;
                            var obj = { "Monday" : timeSlots1}

                            unavailableSlots1.push({obj});
                        
                    })

                    setUnavailableSlots(unavailableSlots1);
                    
                    setDataFound(true);
                }
                else {
                    // setAllRequests(queryResult.data);
                    console.log(queryResult.data);
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

const sendDataToServer = async () => {
    try {
        // const response = await fetch('/api/saveRequests', {
        const response = await fetch("/api/psych/calendar/"+process.env.NEXT_PUBLIC_API_PASS+"/"+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).role+"/2/"+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).collegeId+"/"+JSON.stringify(allNewRequests), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // body: JSON.stringify(allNewRequests)
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Data saved:', result);
        } else {
            console.error('Failed to save data');
        }
    } catch (error) {
        console.error('Error sending data to server:', error);
    }
};

const addSlotToDB = async (day) => {
    setAddProgress(true);
    toast({description: "Adding slot",});
    try {
        // const response = await fetch('/api/saveRequests', {
        const response = await fetch("/api/psych/calendar/"+process.env.NEXT_PUBLIC_API_PASS+"/"+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).role+"/4/"+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).collegeId+"/"+day+"/"+fomarttedTimeforMe(selectStartTime)+"/"+fomarttedTimeforMe(selectEndTime), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Slot added', result);
            
            const newRequest = {"day": day, slots: [{"start": selectStartTime, "end": selectEndTime}]};
            setAllNewRequests([...allNewRequests, newRequest]); 
            setAllRequests([...allRequests, newRequest]); 

            setAddProgress(false);
            toast({description: "Slot added",});
        } else {
            console.error('Failed to save data');
            setAddProgress(false);
            toast({description: "Facing issues, try again",});
        }
    } catch (error) {
        setAddProgress(false);
        toast({description: "Facing issues, try again",});
        console.error('Error sending data to server:', error);
    }
};

const removeSlotFromDB = async (day, start, end) => {
    setRemoveProgress(true);
    toast({description: "Removing slot",});
    try {
        // const response = await fetch('/api/saveRequests', {
        const response = await fetch("/api/psych/calendar/"+process.env.NEXT_PUBLIC_API_PASS+"/"+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).role+"/3/"+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).collegeId+"/"+day+"/"+start+"/"+end, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Slot removed', result);
            // setAllRequests(currentRequests => 
            //     currentRequests.filter(request => 
            //         !(request.day === day && request.slots.some(slot => slot.start === start && slot.end === end))
            //     )
            // );

            setAllRequests(currentRequests =>
                currentRequests.map(request => {
                    // Check if the current request is for the specified day
                    if (request.day === day) {
                        // Filter out the slots that match the given startTime and endTime
                        const filteredSlots = request.slots.filter(slot =>
                            !(slot.start === start && slot.end === end)
                        );
                        // Return the updated request with the filtered slots
                        return {...request, slots: filteredSlots};
                    }
                    // If the day doesn't match, return the request unchanged
                    return request;
                })
            );

            setRemoveProgress(false);
            toast({description: "Slot removed",});
        } else {
            console.error('Failed to save data');
            setRemoveProgress(false);
            toast({description: "Facing issues, try again",});
        }
    } catch (error) {
        setRemoveProgress(false);
        toast({description: "Facing issues, try again",});
        console.error('Error sending data to server:', error);
    }
};

const fomarttedTimeforMe = (timeStr) => {
    // Manually handle AM/PM
        const parts = timeStr.split(' ');
        const time = parts[0].split(':');
        let hour = parseInt(time[0]);
        const minute = parseInt(time[1]);
        const isPM = parts[1] === 'PM';

        if (isPM && hour < 12) hour += 12;
        if (!isPM && hour === 12) hour = 0;  // Convert 12 AM to 00

        const formattedTime = dayjs().hour(hour).minute(minute).second(0).format("HH:mm:ss");
        return formattedTime;

  }
  

  // Function to remove an appointment from the list
  const handleRemoveAppointment = (row) => {
    const updatedAppointments = allRequests.filter(item => item.appointmentId !== row.getValue('appointmentId'));
    setAllRequests(updatedAppointments);
};

    
  return (
    
        <div className={styles.verticalsection} style={{height:'100vh',gap:'16px'}}>
            
          <div className={dmSans.className} style={{height:'8vh',display:'flex',flexDirection:'column',justifyContent:'space-around', marginTop:'20px'}}>
              {/* <h1 className="text-3xl font-bold leading-normal">Appointments</h1> */}
              <div className={styles.horizontalsection}>
                <h1 className="text-3xl font-bold leading-normal">Calendar</h1>
                {(searching || removeProgress || addProgress)  ? <SpinnerGap className={`${styles.icon} ${styles.load}`} /> : ''}
              </div>
              <p className="text-sm text-slate-500">Define your availability for receiving appointments. You will receive bookings from students.</p>
              
          </div>      
          
          
         
    <div className={styles.verticalsection} style={{height:'80vh', width:'100%',gap:'8px'}}>

    
<div className="mx-auto" style={{width:'100%',height:'100%'}}>

    <div style={{display: 'flex',flexDirection: 'column',gap: '10px'}}>
      {days.map((day, dayIndex) => (
        <div key={day.day} style={{display: 'flex',flexDirection:'column', gap:'10px'}}>
          <div style={{display: 'flex',gap: '10px',alignItems:'start'}}>
            <span style={{width:'100px'}}>{day.day}</span>
            
            <div style={{display: 'flex',flexDirection:'column', alignItems: 'center',gap: '10px'}}>
                
            {(unavailableSlots.length > 0) ?
            <div>
                {day.slots.map((slot, slotIndex) => (


                    <div key={slotIndex} style={{display: 'flex',alignItems: 'center',gap: '10px'}}>
                    <Select onValueChange={(value) => handleStartChange(dayIndex, slotIndex, 'start', value)} >
                    {/* <Select onValueChange={(value) => handleSlotChange(dayIndex, slotIndex, 'start', value)} > */}
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent >
                            {timeSlots.map((timeSlot) => <SelectItem key={timeSlot} value={timeSlot} disabled={generateTimeSlotsForDay2(day.day, timeSlot)}>{timeSlot}</SelectItem>)}
                        </SelectContent>
                        </Select>
                        <span>to</span>
                        <Select onValueChange={(value) => handleEndChange(dayIndex, slotIndex, 'end', value)} >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent >
                            {timeSlots.map((timeSlot) => <SelectItem key={timeSlot} value={timeSlot} disabled={generateTimeSlotsForDay2(day.day, timeSlot)}>{timeSlot}</SelectItem>)}
                        </SelectContent>
                        </Select>

                    {day.slots.length > 1 && (
                        <Button variant="secondary" onClick={() => handleRemoveSlot(dayIndex, slotIndex)}>Remove</Button>
                    )}
                    </div>
                
                ))}
                </div>
                : <Skeleton className="h-4 w-[250px]" /> }
                
                {/* including blocked dates here */}
                {(unavailableSlots.length > 0 && allRequests.find(request => request.day == day.day)) ?
                    <div style={{display: 'flex',flexDirection: 'column',gap: '10px'}}>
                    
                    {allRequests.map((request, dayIndex) => (
                        <div key={"key_"+request.day} >
                        {(request.day == day.day) ? 
                            <div key={request.day} style={{display: 'flex',flexDirection:'column',alignItems:'center', gap:'10px'}}>
                            
                                <div style={{display: 'flex',flexDirection:'column', alignItems: 'center',gap: '10px', backgroundColor: '#f5f5f5',padding: '8px 12px',borderRadius: '8px'}}>
                                    {request.slots.map((slot, slotIndex) => (
                                        <div key={"available_"+slotIndex} style={{display: 'flex',flexDirection:'column', alignItems: 'center',gap: '10px'}}>
                                            
                                            <div style={{display: 'flex',gap: '10px',alignItems:'start'}}>
                                                <p>{formatTime24To12(slot.start)}</p>
                                                <span>to</span>
                                                <p>{formatTime24To12(slot.end)}</p>
                                                <X className={`${styles.icon} `} style={{cursor:'pointer'}} onClick={() => removeSlotFromDB(request.day, slot.start, slot.end)}/>
                                                
                                            </div>
                                        </div>
                                        
                                    ))}
                                </div>
                                {/* <Button onClick={() => handleAddSlot1(dayIndex)}>Add Slot</Button> */}

                            
                            </div>
                        : ''}
                    </div>

                    ))}
                    </div>
                    : ''}
                
                
            </div>


           { searching ? <Skeleton className="h-4 w-[50px]" /> :
            <Button onClick={() => addSlotToDB(day.day, dayIndex)}>Add Slot</Button>}


          </div>
          <Separator />
        </div>
      ))}
      
      
    </div>
    
    </div>
               
                
        </div>
    
    </div>
    
    
  );
}


