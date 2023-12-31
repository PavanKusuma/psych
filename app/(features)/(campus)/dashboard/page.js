'use client'

import { Inter } from 'next/font/google'
import { Check, Info, SpinnerGap, X, Plus } from 'phosphor-react'
import React, { useCallback, useEffect, useState, useRef } from 'react'
// import { XAxis, YAxis, Tooltip, Cell, PieChart, Pie, Area, AreaChart } from 'recharts';
const inter = Inter({ subsets: ['latin'] })
import styles from '../../../../app/page.module.css'
import Biscuits from 'universal-cookie'
const biscuits = new Biscuits
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
// import ImageWithShimmer from '../../components/imagewithshimmer'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// const storage = getStorage();
import firebase from '../../../../app/firebase';
import Toast from '../../../../app/components/myui/toast'
const storage = getStorage(firebase, "gs://smartcampusimages-1.appspot.com");


// Create a child reference
// const imagesRef = ref(storage, 'images');
// imagesRef now points to 'images'

// Child references can also take paths delimited by '/'
const spaceRef = ref(storage, '/');

// const spaceRef = ref(storage, 'images/space.jpg');
// check for the user
const getStats = async (pass, role, branch) => 
  
fetch("/api/requeststats/"+pass+"/"+role+"/"+branch+"/All/1", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// const spaceRef = ref(storage, 'images/space.jpg');
// check for the user
const getDetailedStats = async (pass, role, branch, date) => 
  
fetch("/api/requeststats/"+pass+"/"+role+"/"+branch+"/All/2/"+date, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});



// pass state variable and the method to update state variable
export default function Dashboard() {

    // create a router for auto navigation
    const router = useRouter();

    // user state and requests variable
    const [user, setUser] = useState();
    const [role, setRole] = useState('');
    const [branch, setBranch] = useState('');
    const [offset, setOffset] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [totalStudents, setTotalStudents] = useState(0);
    const [studentsInCampus, setStudentsInCampus] = useState(0);
    
    const [requestsInOuting, setRequestsInOuting] = useState(0);
    const [requestsIssued, setRequestsIssued] = useState(0);
    const [requestsApproved, setRequestsApproved] = useState(0);
    const [requestsPending, setRequestsPending] = useState(0);

    const [resultType, setResultType] = useState('');
    const [resultMessage, setResultMessage] = useState('');

    const [studentsList, setStudentsList] = useState();
    const [dataFound, setDataFound] = useState(true); // use to declare 0 rows
    const [inputError, setInputError] = useState(false);
    const [searching, setSearching] = useState(false);

    const [outingData, setOutingData] = useState();
    const pieColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const webcamRef = React.useRef(null);
    //create new date object
    const today = new dayjs();
    
    


    // get the user and fire the data fetch
    useEffect(()=>{

        let cookieValue = biscuits.get('sc_user_detail')
            if(cookieValue){
                const obj = JSON.parse(decodeURIComponent(cookieValue)) // get the cookie data

                // set the user state variable
                setUser(obj)
                
                if(!completed){
                    getData();
                    getDataDetails();
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
   


    // get the requests data
    // for the user based on their role.
    // the actions will be seen that are specific to the role and by the selected status
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
                    const result = queryResult.data;

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
            const queryResult = await result.json() // get data

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



    
  return (
    
        <div className={styles.verticalsection} style={{height:'100vh',gap:'8px'}}>
            
          <div style={{height:'8vh',display:'flex',flexDirection:'column',justifyContent:'space-around'}}>
              <h2 className={inter.className}>Dashboard</h2>
          </div>      

            {/* <div style={{width:'100%',display:'flex', flexDirection:'row',justifyContent:'space-between'}}>
                <div className={styles.horizontalsection}>
                    <div className={`${styles.primarybtn} `} style={{display:'flex', flexDirection:'row', width:'fit-content', cursor:'pointer', gap:'4px'}}> 
                        <Plus />
                        <p className={`${inter.className}`}>New circular</p>
                    </div>
                    <div className={`${styles.overlayBackground} ${showAddStudent ? styles.hideshowdivshow : styles.hideshowdiv}`}>
                        <AddStudent toggleAddStudentOverlay={toggleAddStudentOverlay}/> 
                    </div>
                </div>
               
            </div> */}
          
         
        <div className={styles.verticalsection} style={{height:'80vh', width:'100%',gap:'8px'}}>

        <div className={styles.horizontalsection} style={{height:'100%', width:'100%'}}>

                <div className={styles.carddatasection} key={1234} style={{height:'100%', width:'100%'}}>
                       
                <div className={styles.verticalsection} style={{height:'100%',width:'100%',overflow:'scroll'}}>
                        
                        <p className={`${inter.className} ${styles.text1_heading}`}>STUDENTS</p>
                        <div className={styles.horizontalsection} style={{gap:'16px',paddingTop:'4px'}}>
                           
                            <div className={`${inter.className}`} style={{display:'flex',flexDirection:'column',gap:'8px', borderLeft: '4px solid #e5e5e5',padding: '4px 12px', width:'260px !important'}}>
                                {/* <input id="userObjectId" className={`${inter.className} ${styles.text2} ${styles.textInput}`} placeholder="Unique user ID"/> */}
                                {/* <button onClick={getData.bind(this)} className={`${inter.className} ${styles.primarybtn}`} >Find</button> */}
                                <p className={`${inter.className} ${styles.text3}`}>Hostel strength:</p>
                                {searching ? <div className={styles.horizontalsection}>
                                    <SpinnerGap className={`${styles.icon} ${styles.load}`} />
                                    <p className={`${inter.className} ${styles.text3}`}>Loading ...</p> 
                                </div> : ''}
                                {/* <div className={`${inter.className} ${styles.text1}`}>{totalStudents}</div>  */}
                                <h2>{totalStudents}</h2>
                            </div>
                            <div className={`${inter.className}`} style={{display:'flex',flexDirection:'column',gap:'8px', borderLeft: '4px solid #e5e5e5',padding: '4px 12px', width:'260px !important'}}>
                                {/* <input id="userObjectId" className={`${inter.className} ${styles.text2} ${styles.textInput}`} placeholder="Unique user ID"/> */}
                                {/* <button onClick={getData.bind(this)} className={`${inter.className} ${styles.primarybtn}`} >Find</button> */}
                                <p className={`${inter.className} ${styles.text3}`}>Students in campus hostel:</p>
                                {searching ? <div className={styles.horizontalsection}>
                                    <SpinnerGap className={`${styles.icon} ${styles.load}`} />
                                    <p className={`${inter.className} ${styles.text3}`}>Loading ...</p> 
                                </div> : ''}
                                {/* <div className={`${inter.className} ${styles.text1}`}>{totalStudents}</div>  */}
                                <h2>{studentsInCampus}</h2>
                            </div>
                        </div>
                            
                         {/* OUTING */}
                         <br/>
                        <p className={`${inter.className} ${styles.text1_heading}`}>OUTING REQUESTS</p>
                        <div className={styles.horizontalsection} style={{gap:'16px',paddingTop:'4px',paddingBottom:'8px',width:'100%'}}>
                           
                            <div className={`${inter.className}`} style={{display:'flex',flexDirection:'column',gap:'8px', borderLeft: '4px solid #0088FE',padding: '4px 12px', width:'160px !important'}}>
                                {/* <input id="userObjectId" className={`${inter.className} ${styles.text2} ${styles.textInput}`} placeholder="Unique user ID"/> */}
                                {/* <button onClick={getData.bind(this)} className={`${inter.className} ${styles.primarybtn}`} >Find</button> */}
                                <p className={`${inter.className} ${styles.text3}`}>Pending:</p>
                                {searching ? <div className={styles.horizontalsection}>
                                    <SpinnerGap className={`${styles.icon} ${styles.load}`} />
                                    <p className={`${inter.className} ${styles.text3}`}>Loading ...</p> 
                                </div> : ''}
                                {/* <div className={`${inter.className} ${styles.text1}`}>{totalStudents}</div>  */}
                                <h2>{requestsPending}</h2>
                            </div>
                            <div className={`${inter.className}`} style={{display:'flex',flexDirection:'column',gap:'8px', borderLeft: '4px solid #00C49F',padding: '4px 12px', width:'160px !important'}}>
                                {/* <input id="userObjectId" className={`${inter.className} ${styles.text2} ${styles.textInput}`} placeholder="Unique user ID"/> */}
                                {/* <button onClick={getData.bind(this)} className={`${inter.className} ${styles.primarybtn}`} >Find</button> */}
                                <p className={`${inter.className} ${styles.text3}`}>Approved:</p>
                                {searching ? <div className={styles.horizontalsection}>
                                    <SpinnerGap className={`${styles.icon} ${styles.load}`} />
                                    <p className={`${inter.className} ${styles.text3}`}>Loading ...</p> 
                                </div> : ''}
                                {/* <div className={`${inter.className} ${styles.text1}`}>{totalStudents}</div>  */}
                                <h2>{requestsApproved}</h2>
                            </div>
                            <div className={`${inter.className}`} style={{display:'flex',flexDirection:'column',gap:'8px', borderLeft: '4px solid #FFBB28',padding: '4px 12px', width:'160px !important'}}>
                                {/* <input id="userObjectId" className={`${inter.className} ${styles.text2} ${styles.textInput}`} placeholder="Unique user ID"/> */}
                                {/* <button onClick={getData.bind(this)} className={`${inter.className} ${styles.primarybtn}`} >Find</button> */}
                                <p className={`${inter.className} ${styles.text3}`}>Issued:</p>
                                {searching ? <div className={styles.horizontalsection}>
                                    <SpinnerGap className={`${styles.icon} ${styles.load}`} />
                                    <p className={`${inter.className} ${styles.text3}`}>Loading ...</p> 
                                </div> : ''}
                                {/* <div className={`${inter.className} ${styles.text1}`}>{totalStudents}</div>  */}
                                <h2>{requestsIssued}</h2>
                            </div>
                            <div className={`${inter.className}`} style={{display:'flex',flexDirection:'column',gap:'8px', borderLeft: '4px solid #FF8042',padding: '4px 12px', width:'160px !important'}}>
                                {/* <input id="userObjectId" className={`${inter.className} ${styles.text2} ${styles.textInput}`} placeholder="Unique user ID"/> */}
                                {/* <button onClick={getData.bind(this)} className={`${inter.className} ${styles.primarybtn}`} >Find</button> */}
                                <p className={`${inter.className} ${styles.text3}`}>In outing:</p>
                                {searching ? <div className={styles.horizontalsection}>
                                    <SpinnerGap className={`${styles.icon} ${styles.load}`} />
                                    <p className={`${inter.className} ${styles.text3}`}>Loading ...</p> 
                                </div> : ''}
                                {/* <div className={`${inter.className} ${styles.text1}`}>{totalStudents}</div>  */}
                                <h2>{requestsInOuting}</h2>
                            </div>
                        </div>
                            
                        <div className={styles.horizontalsection}>
                            <div className={styles.verticalsection} style={{gap:'16px',padding:'8px 24px 12px 0px', backgroundColor:'#8fc8a870',borderRadius:'8px'}}>
                                {/* <p className={`${inter.className} ${styles.text1}`} style={{paddingLeft:'8px'}}>Last 3 months</p> */}
                                <p className={`${inter.className} ${styles.text1_heading}`} style={{paddingTop:'4px',paddingLeft:'16px'}}>LAST 3 MONTHS</p>
                                
                                
                            </div>
                        
                            {/* <div className={styles.horizontalsection} style={{gap:'16px',paddingTop:'4px',width:'100%', backgroundColor:'darkseagreen',borderRadius:'8px'}}>
                                
                                <LineChart width={600} height={200} data={outingData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }} className={`${inter.className} ${styles.text3}`}>
                                    <Line type="monotone" dataKey="request_count" stroke="darkgreen" width={'2px'} label="req" strokeWidth={3}/>
                                    <XAxis dataKey="month_year" />
                                    <YAxis />
                                    <Tooltip />
                                </LineChart>
                            </div> */}
                        
                        {/* <ResponsiveContainer style={{width:'100%',height:'100%'}}> */}
                            <div className={styles.verticalsection} style={{backgroundColor:'#c8c8c840',borderRadius:'8px'}}>
                            {/* <div className={styles.verticalsection} style={{backgroundColor:'#e1bf7840',borderRadius:'8px'}}> */}
                            
                                <p className={`${inter.className} ${styles.text1_heading}`} style={{paddingLeft:'12px',paddingTop:'8px'}}>REQUESTS BREAKUP</p>
                                
                                
                            </div>
                        </div>
                        {/* </ResponsiveContainer> */}
{/*                        
                       <PieChart width={300} height={300} className={`${inter.className} ${styles.text3}`} >
                            <Pie
                                dataKey="value"
                                data={studentsGraph1}
                                cx="200"
                                cy="200"
                                innerRadius={40}
                                outerRadius={80}
                                fill="#8884d8"
                                label
                            />
                            
                        </PieChart> */}

                       
                        {(resultMessage.length > 0) ? <Toast type={resultType} message={resultMessage} /> : ''}
                      </div>
                <div>
                    
                </div>
            </div>

                {/* <div className={styles.carddatasection} key={12345} style={{height:'100%',overflow:'scroll'}}>
                       
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
            </div> */}
        </div>
               
                
        </div>
    
    </div>
    
    
  );
}

