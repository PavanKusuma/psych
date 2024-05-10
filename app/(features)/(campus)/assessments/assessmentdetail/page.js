'use client'



import { Inter, DM_Sans, DM_Serif_Text } from 'next/font/google'
import { ArrowDown, ArrowLeft, SpinnerGap } from 'phosphor-react'
import { useEffect, useState } from 'react'
const inter = Inter({ subsets: ['latin'] })
const dmSans = DM_Sans({ subsets: ['latin'] })
const dmSerifText = DM_Serif_Text({weight: "400", subsets: ['latin'] })
import Biscuits from 'universal-cookie'
import styles from '../../../../../app/page.module.css'
import { useRouter } from 'next/navigation'
const biscuits = new Biscuits
import dayjs from 'dayjs'
import Toast from '../../../../components/myui/toast';
import { Button } from "@/app/components/ui/button"
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/app/components/ui/table"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle,} from "@/app/components/ui/card"
import { Skeleton } from "@/app/components/ui/skeleton"
const xlsx = require('xlsx');

// get the appointments for PsychAdmin
const getAllAppointmentsDataAPI = async (pass, role, campusId, offset) => 
  
fetch("/api/psych/assessments/"+pass+"/"+role+"/2/"+campusId+"/"+offset, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});


// get the appointments for PsychAdmin
const getStudentsDataAPI = async (pass, role, students) => 
  
fetch("/api/psych/assessments/"+pass+"/"+role+"/3/"+students, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});
// verification using college Id
// In future, based on the type of the user verification can be succeded
// If the user is found in the database, OTP will be sent for the user mobile number based on the user type
// incase parent is logging in on behalf of student, the OTP is sent to parent's number
// After verification, data is saved in local storage
export default function AssessmentDetail({ searchParams}) {
    
    // create a router for auto navigation
    const router = useRouter();
      console.log(searchParams.id);
      console.log(searchParams.title);
      console.log(searchParams.type);
        
    // session variable to track login
    const [session, setSession] = useState(false);
    // var finalData = [];
    const [finalData, setFinalData] = useState([]);
    const [allAnswers, setAllAnswers] = useState([]);
    const [allResults, setAllResults] = useState([]);
    const [assessmentId, setAssessmentId] = useState(searchParams.id);
    const [assessmentTitle, setAssessmentTitle] = useState(searchParams.title);
    const [assessmentType, setAssessmentType] = useState(searchParams.type);
    const [username, setUsername] = useState('');
    const [offset, setOffset] = useState(0);
    const [email, setEmail] = useState('');
    const [downloading, setDownloading] = useState(false);
    const [errorMsg, seterrorMsg] = useState('');

    const [otpSent, setotpSent] = useState(false);
    const [verifyOtpMsg, setverifyOtpMsg] = useState('');
    const [otp, setOTP] = useState()

    const [infoMsg, setinfoMsg] = useState(false);
    const [user, setUser] = useState();

    // this is to save the jsonResult for verification
    const [queryResult, setQueryResult] = useState(); 
    const [resultType, setResultType] = useState('');
    const [resultMessage, setResultMessage] = useState('');
    //create new date object
    const today = new dayjs();

    useEffect(()=>{
        
    
        // Retrieve the cookie
        let cookieValue = biscuits.get('sc_user_detail')
        // let cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)sc_user_detail\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        if(cookieValue){
            const obj = JSON.parse(decodeURIComponent(cookieValue))
            
            // get the details
            getAssessmentDetails();
        }
        else{
            // setSession(false)
            // console.log('Not found')
        }
    },[]);
 

    // verify the collegeId by calling the API
    async function getAssessmentDetails(){

        try{

            // call the api using secret key and collegeId provided
            // console.log("/api/psych/assessments/"+process.env.NEXT_PUBLIC_API_PASS+"/"+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).role+"/2/"+assessmentId+"/"+offset);
            const result  = await getAllAppointmentsDataAPI(process.env.NEXT_PUBLIC_API_PASS, JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).role, assessmentId, offset, )
            
            const resultData = await result.json() // get data
            setQueryResult(resultData); // store data
            // console.log(resultData);
            // check if query result status is 200
            // if 200, that means, user is found and OTP is sent
            if(resultData.status == 200) {
                
                // set the state variables with the user data

                setAllAnswers(resultData.answers);
                setAllResults(resultData.results);

                resultData.results.forEach(result => {

                    // Step 2: Filter the array to know how many users took this assessment
                    const users = resultData.answers.filter(answer => answer.resultId == result.resultId);

                    // Step 3: Get the count of users who meet the condition
                    const count = users.length;

                });
            }
            else if(resultData.status == 404) {

                seterrorMsg('No match found. Contact your campus administrator.')
                // setuserFound(false)
                // setinfoMsg(true) // show the big info message about reaching out
                // // otp sent
                // setotpSent(false)
            }
            
        }
        catch(e){
            
            // show and hide message
            setResultType('error');
            setResultMessage('Error reaching server. Please try again later!');
            setTimeout(function(){
                setResultType('');
                setResultMessage('');
            }, 3000);
        }
    }

function getUniqueStudentsCount(resultId){
    const result = allAnswers.filter(answer => answer.resultId == resultId);
    const uniqueCollegeIds = [...new Set(result.map(item => item.collegeId))];
    return uniqueCollegeIds.length;
}

function downloadNow(resultId) {
    
    setDownloading(true);
    const result = allAnswers.filter(answer => answer.resultId == resultId);

    try {
        const uniqueCollegeIds = [...new Set(result.map(item => item.collegeId))];
        const commaSeparatedCollegeIds = uniqueCollegeIds.join(',');
        
        // call for data
        getStudentDetailsForDownload(commaSeparatedCollegeIds);
        
    } catch (error) {
        console.error("Failed to process college IDs:", error);
    }
    
}


    // get student details for download
    async function getStudentDetailsForDownload(data){

        try{

            // call the api using secret key and collegeId provided
            // console.log("/api/psych/assessments/"+process.env.NEXT_PUBLIC_API_PASS+"/"+JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).role+"/"+data);
            const result  = await getStudentsDataAPI(process.env.NEXT_PUBLIC_API_PASS, JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).role, data, )
            
            const resultData = await result.json() // get data
            setQueryResult(resultData); // store data
            // console.log(resultData);
            // check if query result status is 200
            // if 200, that means, user is found and OTP is sent
            if(resultData.status == 200) {

                const worksheet = xlsx.utils.json_to_sheet(resultData.data);
                const workbook = xlsx.utils.book_new();
                xlsx.utils.book_append_sheet(workbook,worksheet,'Students');
                xlsx.writeFile(workbook, 'AssessmentResult_'+assessmentTitle+'_'+dayjs((today).toDate()).format("DD-MM-YYYY").toString()+'.xlsx');
                
                setDownloading(false);
            }
            else if(resultData.status == 404) {

                setDownloading(false);
                seterrorMsg('No match found. Contact your campus administrator.')
            }
            
        }
        catch(e){
            
            // show and hide message
            setDownloading(false);
            setResultType('error');
            setResultMessage('Error reaching server. Please try again later!');
            setTimeout(function(){
                setResultType('');
                setResultMessage('');
            }, 3000);
        }
    }
  
  return (
    
    <div className={styles.verticalsection} style={{height:'100vh',gap:'16px'}}>
        <Button variant="secondary" onClick={() => router.back()} style={{marginTop: '16px'}}> <ArrowLeft className="mr-2 h-4 w-4"/> Back</Button>
        <div className={dmSans.className} style={{display:'flex',flexDirection:'column',justifyContent:'space-around', marginTop:'12px'}}>
            
            <div className={styles.horizontalsection}>
                <h1 className="text-3xl font-bold leading-normal">Assessment Results</h1>
                {(allResults.length == 0) ? <SpinnerGap className={`${styles.icon} ${styles.load}`} /> : ''}
            </div>
            {/* <p className="text-sm text-slate-500">Students will be in any of below result set once assessment is taken by them.</p> */}
            
        </div>     
      
        <div className={styles.horizontalsection}>
            <Card className="w-[350px]">
                <CardHeader>
                {(allResults.length == 0) ? <div className={styles.horizontalsection}>
                                    <SpinnerGap className={`${styles.icon} ${styles.load}`} />
                                    <Skeleton className="h-4 w-[250px]" />
                                </div> : ''}
                    <CardTitle>Total times taken</CardTitle>
                    <CardDescription className='text-xl'>{allAnswers.length}</CardDescription>
                </CardHeader>
            </Card>
            <Card className="w-[350px]">
                <CardHeader>
                {(allResults.length == 0) ? <div className={styles.horizontalsection}>
                                    <SpinnerGap className={`${styles.icon} ${styles.load}`} />
                                    <Skeleton className="h-4 w-[250px]" />
                                </div> : ''}
                    <CardTitle>Total students taken</CardTitle>
                    <CardDescription className='text-xl'>{allResults.length}</CardDescription>
                </CardHeader>
            </Card>
        </div>

     
        {(assessmentType == 1) ? 
            <div>The evaluation of this assessment is based on {allResults.length} categories</div>
            : <div>This assessment's evaluation is based on {allResults.length} ranges</div>
        }
        
        <div className={`${inter.className}`} style={{display:'flex',flexDirection:'row',justifyContent:'space-between', width:'100%', alignItems: 'start',gap:'8px'}}>
            {/* {allResults.map(result => ( */}
            {allResults.map((result, dayIndex) => (
            <Card key={dayIndex} className="w-[350px]">
                <CardHeader>
                {(allResults.length == 0) ? <div className={styles.horizontalsection}>
                                    <SpinnerGap className={`${styles.icon} ${styles.load}`} />
                                    <Skeleton className="h-4 w-[250px]" />
                                </div> : ''}
                    <CardTitle>{result.title}</CardTitle>
                    <CardDescription className='text-base'>
                        Result range: {result.result}<br/>
                        Students attempted: {getUniqueStudentsCount(result.resultId)}
                    </CardDescription>
                    <br/>
                    <Button variant="outline" onClick={()=>downloadNow(result.resultId)}> <ArrowDown className="mr-2 h-4 w-4"/> Download</Button>
                </CardHeader>
            </Card>
            
                            // <div className={`${inter.className}`} key={result.resultId} style={{display:'flex',flexDirection:'column',alignItems: 'start',gap:'8px', borderLeft: '4px solid #0088FE',padding: '4px 12px'}}>
                                
                            //     {(allResults.length == 0) ? <div className={styles.horizontalsection}>
                            //         <SpinnerGap className={`${styles.icon} ${styles.load}`} />
                            //         <p className={`${inter.className} ${styles.text3}`}>Loading ...</p> 
                            //     </div> : ''}
                            //     <div className='flex flex-row gap-0'><p className={`${inter.className} ${styles.text3}`} style={{width:'100px'}}>Range: </p><p className={`${inter.className} ${styles.text1}`} style={{width:'100px'}}>{result.result}</p></div>
                            //     <div className='flex flex-row gap-0'><p className={`${inter.className} ${styles.text3}`} style={{width:'100px'}}>Result: </p><p className={`${inter.className} ${styles.text1}`} style={{width:'200px'}}>{result.title}</p></div>
                            //     <div className='flex flex-row gap-0'><p className={`${inter.className} ${styles.text3}`} style={{width:'100px'}}>Attempts: </p><p className={`${inter.className} ${styles.text1}`} style={{width:'100px'}}>{allAnswers.filter(answer => answer.resultId == result.resultId).length}</p></div>
                            //     <div className='flex flex-row gap-0'><p className={`${inter.className} ${styles.text3}`} style={{width:'100px', paddingBottom: '12px'}}>Students attempted: </p><p className={`${inter.className} ${styles.text1}`} style={{width:'100px'}}>{getUniqueStudentsCount(result.resultId)}</p></div>
                                
                            //     {/* <Button variant="outline"> <ArrowDown className="mr-2 h-4 w-4"/> Download</Button> */}
                            //     <Button variant="outline" onClick={()=>downloadNow(result.resultId)}> <ArrowDown className="mr-2 h-4 w-4"/> Download</Button>
                            // </div>
                      
        ))}
        </div>
        
        {downloading ? 
        <div className={styles.horizontalsection} style={{width:'100%',backgroundColor:'forestgreen',borderRadius:'4px',padding: '8px 12px'}}>
            <SpinnerGap className={`${styles.icon} ${styles.load}`} style={{color: 'white'}}/>
            <p className={`${inter.className} ${styles.text3}`} style={{color: 'white'}}>Downloading ...</p> 
        </div> : ''}
        
      
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
  {/* <DataTable columns={columns} data={allRequests} status={currentStatus} downloadNow={downloadRequestsNow} initialDates={initialDatesValues} requestAgain={updateOffset} loadingIds={loadingIds} /> */}
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

