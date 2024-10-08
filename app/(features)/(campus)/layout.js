'use client'
import { Inter, DM_Sans, DM_Serif_Text } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
const dmSans = DM_Sans({ subsets: ['latin'] })
const dmSerifText = DM_Serif_Text({weight: "400", subsets: ['latin'] })

import styles from '../../../app/page.module.css'
import { Monitor, UserFocus, ArrowSquareOut, PresentationChart, IdentificationBadge, CalendarCheck, UserPlus, FileImage, PersonSimpleRun, Calendar, PenNib, Clock, ClockAfternoon } from 'phosphor-react'

import Biscuits from 'universal-cookie'
const biscuits = new Biscuits
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react';
import { Toaster } from "@/app/components/ui/toaster"


// export const metadata = {
//     title: 'Dashboard',
//     description: 'Overview of your campus',
//   }
  
  export default function CampusLayout({ children }) {

    // // variable to store the active tab
    const [selectedTab, setSelectedTab] = useState('Appointments');
    const [userData, setUserData] = useState();
    const [role, setRole] = useState();
    const [id, setId] = useState();
    // function handleTabChange(tabName){
    //     setSelectedTab(tabName);
    //     console.log(tabName);
    //   }
    
    // create a router for auto navigation
    const router = useRouter();
    // setTab();
    // clear cookies or logout and navigate to verification
    function clearCookies(){

      //  document.cookie = "";
      biscuits.remove('sc_user_detail')
      router.push('/')
      
  }

  // this will ask you to stop before reloading
  useEffect(() => {


    let cookieValue = biscuits.get('sc_user_detail')
    if(cookieValue){
        const obj = JSON.parse(decodeURIComponent(cookieValue)) // get the cookie data

        // configure some variables
        setUserData(obj);
        setRole(obj.role);
        setId(obj.collegeId);

        // set the user state variable
        
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
        router.push('/')
    }

    // const handleBeforeUnload = (event) => {
    //   event.returnValue = 'ok ok';
    // };

    // window.addEventListener('beforeunload', handleBeforeUnload);

    // return () => {
    //   window.removeEventListener('beforeunload', handleBeforeUnload);
    // }
  }, []);

    
    // Navigation
    function navigateDashboard(){
      // biscuits.set('selectedTab', 'Dashboard', {path: '/', expires: new Date(Date.now() + 10800000)})
      setSelectedTab('Dashboard')
      router.push('/dashboard')
    }
    function navigateStudents(){
      // biscuits.set('selectedTab', 'Chat', {path: '/', expires: new Date(Date.now() + 10800000)})
      setSelectedTab('Students')
      router.push('/students')
    }
    // function navigateStudents(){
    //   // biscuits.set('selectedTab', 'Chat', {path: '/', expires: new Date(Date.now() + 10800000)})
    //   setSelectedTab('Students')
    //   router.push('/student360/search')
    // }
    function navigateAppointments(){
      // biscuits.set('selectedTab', 'Chat', {path: '/', expires: new Date(Date.now() + 10800000)})
      setSelectedTab('Appointments')
      router.push('/appointments')
    }
    function navigateAssessments(){
      // biscuits.set('selectedTab', 'Chat', {path: '/', expires: new Date(Date.now() + 10800000)})
      setSelectedTab('Assessments')
      router.push('/assessments')
    }
    function navigateCalendar(){
      // biscuits.set('selectedTab', 'Chat', {path: '/', expires: new Date(Date.now() + 10800000)})
      setSelectedTab('Calendar')
      router.push('/calendar')
    }
    

    return (


        <div className={styles.main}>
          
        <div className={dmSerifText.className}>
          <div className={styles.topbar} style={{height:'6vh'}}>
            <div className={styles.horizontalsection}>
              {/* <Image src="/sc_logo1.svg" alt="Smart Campus" width={160} height={40} priority /> */}
              <span className="text-xl font-semibold hidden sm:inline-block">Dear Me</span>
              
              {/* <span style={{color: '#CCCCCC'}}>|</span> */}
              {/* <Image src="/svecw_sc_logo.svg" alt="Smart Campus" width={90} height={40} priority /> */}
              {/* <h3>Smart Campus</h3> */}
            </div>
            <div>
              <p onClick={clearCookies.bind(this)} className={`${inter.className} ${styles.text2}`} style={{cursor:'pointer'}} >Logout</p>
              {/* <ProfileBtn show={false} /> */}
            </div>
          </div>
         
          <div style={{border: '0.5px solid #E5E7EB', width:'100vw'}}></div>
              
              
          
        </div>

      <div className={styles.mainlayoutsection} style={{height:'94vh',gap:'0px'}}>

        {(role != 'Student') ? 
            <div style={{padding:'24px 12px 24px 20px',height: '100%',borderRight: '1px solid #efefef',width:'15%', display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
              
              <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                {/* <div className={`${styles.horizontalsection} ${inter.className} ${selectedTab == 'Dashboard' ? styles.leftMenuItem_selected : styles.leftMenuItem} `} onClick={navigateDashboard.bind(this)} style={{cursor:'pointer', gap:'0px'}}><Monitor className={styles.menuicon}/> Dashboard</div> */}
                {/* <div className={`${styles.horizontalsection} ${inter.className} ${selectedTab == 'Chat' ? styles.leftMenuItem_selected : styles.leftMenuItem} `} onClick={navigateStudents.bind(this)} style={{cursor:'pointer', gap:'0px'}}><UserFocus className={styles.menuicon}/> Chat</div> */}
                <div className={`${styles.horizontalsection} ${inter.className} ${selectedTab == 'Appointments' ? styles.leftMenuItem_selected : styles.leftMenuItem} `} onClick={navigateAppointments.bind(this)} style={{cursor:'pointer', gap:'0px'}}><Clock className={styles.menuicon}/>Appointments</div>
                <div className={`${styles.horizontalsection} ${inter.className} ${selectedTab == 'Assessments' ? styles.leftMenuItem_selected : styles.leftMenuItem} `} onClick={navigateAssessments.bind(this)} style={{cursor:'pointer', gap:'0px'}}><PenNib className={styles.menuicon}/>Assessments</div>
                <div className={`${styles.horizontalsection} ${inter.className} ${selectedTab == 'Calendar' ? styles.leftMenuItem_selected : styles.leftMenuItem} `} onClick={navigateCalendar.bind(this)} style={{cursor:'pointer', gap:'0px'}}><Calendar className={styles.menuicon}/>Calendar</div>
                <div className={`${styles.horizontalsection} ${inter.className} ${selectedTab == 'Students' ? styles.leftMenuItem_selected : styles.leftMenuItem} `} onClick={navigateStudents.bind(this)} style={{cursor:'pointer', gap:'0px'}}><UserFocus className={styles.menuicon}/>Students</div>
                {/* <div className={`${styles.horizontalsection} ${inter.className} ${styles.text2}`} style={{cursor:'pointer'}}><ArrowSquareOut className={styles.menuicon} style={{backgroundColor: '#26379b'}}/> Outing</div>
                <div className={`${styles.horizontalsection} ${inter.className} ${styles.text2}`} style={{cursor:'pointer'}}><PresentationChart className={styles.menuicon} style={{backgroundColor: '#26379b'}}/> Reports</div> */}
                {/* <div className={`${styles.horizontalsection} ${inter.className} ${selectedTab == 'Registration' ? styles.leftMenuItem_selected : styles.leftMenuItem} `} onClick={navigateRegistration.bind(this)} style={{cursor:'pointer'}}><UserPlus className={styles.menuicon}/> Registration</div> */}
                
                {/* {id == 'S33' ? <div className={`${styles.horizontalsection} ${inter.className} ${selectedTab == 'Manage images' ? styles.leftMenuItem_selected : styles.leftMenuItem} `} onClick={navigateManageImages.bind(this)} style={{cursor:'pointer'}}><FileImage className={styles.menuicon}/> Manage images</div> : ''} */}
                {/* <div className={`${styles.horizontalsection} ${inter.className} ${selectedTab == 'Registration' ? styles.text1 : styles.text2}`} onClick={navigateRegistration.bind(this)} style={{cursor:'pointer'}}><IdentificationBadge className={styles.menuicon} style={{backgroundColor: '#26379b'}}/> Visitor pass</div> */}
                {/* <div className={`${styles.horizontalsection} ${inter.className} ${styles.text2}`} ><CalendarCheck className={styles.menuicon} /> Control campus outing</div> */}
              </div>
              
              {userData ?
              <div className={styles.verticalsection} style={{gap:'8px',padding: '8px',backgroundColor: '#f0f0f0',border: '1px solid #e5e5e5',borderRadius: '8px'}}>
                  {/* <p className={`${inter.className} ${styles.text3}  ${styles.tag}`} style={{cursor:'pointer'}} >{userData.role}</p> */}
                  <p className={`${inter.className} ${styles.text1}`} style={{cursor:'pointer'}} >{userData.username}</p>
                  <p onClick={clearCookies.bind(this)} className={`${inter.className} ${styles.text2}`} style={{cursor:'pointer'}} >Log out</p>
              </div>
              : ''}
            </div>
          : ''}

        <div className={styles.maindivcenter} style={{height:'90vh', padding: '0px 24px'}}>
        {/* <div className={styles.maindivcenter} style={{height:'90vh', contentVisibility:'auto',padding: '0px 24px'}}> */}
            
{/* 
          <div style={{height:'8vh',display:'flex',flexDirection:'column',justifyContent:'space-around'}}>
              <h2 className={inter.className}>{selectedTab}</h2>
          </div> */}

          {children}

          <Toaster />
        </div>
          
        </div>





          {/* <div className={`${styles.bottombar} ${inter.className} ${styles.text3}`} style={{display: 'flex', flexDirection:'column', height:'4vh'}}> 
          Made with 💙 to empower campuses
          <br/>
            
          </div> */}
      </div>
    )
  }
  