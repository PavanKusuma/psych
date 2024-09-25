'use client'



import { Inter, DM_Sans, DM_Serif_Text } from 'next/font/google'
import { ArrowDown, ArrowLeft, ClipboardText, SpinnerGap } from 'phosphor-react'
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
// import { Table, TableHead, TableRow, TableCell, TableBody } from "@/app/components/ui/table"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle,} from "@/app/components/ui/card"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose
  } from "@/app/components/ui/sheet"
import { Skeleton } from "@/app/components/ui/skeleton"
const xlsx = require('xlsx');
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel} from '@/app/components/ui/select'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/app/components/ui/table"
import { Separator } from '@/app/components/ui/separator'
  

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

// get question answers of assessments
const getQuestionAnswersOfAssessmentDataAPI = async (pass, studentId, campusId, assessmentId) =>  
fetch("/api/psych/questions/"+pass+"/Student/0/"+studentId+"/"+campusId+"/"+assessmentId, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});


// Function to lighten or darken a color
function adjustColor(color, percent) {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);
  
    R = parseInt((R * (100 + percent)) / 100);
    G = parseInt((G * (100 + percent)) / 100);
    B = parseInt((B * (100 + percent)) / 100);
  
    R = R < 255 ? R : 255;
    G = G < 255 ? G : 255;
    B = B < 255 ? B : 255;
  
    let RR = R.toString(16).length == 1 ? '0' + R.toString(16) : R.toString(16);
    let GG = G.toString(16).length == 1 ? '0' + G.toString(16) : G.toString(16);
    let BB = B.toString(16).length == 1 ? '0' + B.toString(16) : B.toString(16);
  
    return `#${RR}${GG}${BB}`;
  }
  
  // Base color similar to #fff7cf
  const baseColor = '#fff7cf';

// verification using college Id
// In future, based on the type of the user verification can be succeded
// If the user is found in the database, OTP will be sent for the user mobile number based on the user type
// incase parent is logging in on behalf of student, the OTP is sent to parent's number
// After verification, data is saved in local storage
export default function AssessmentDetail({ searchParams}) {
    
    // create a router for auto navigation
    const router = useRouter();
    //   console.log(searchParams.id);
    //   console.log(searchParams.title);
    //   console.log(searchParams.type);
        
    // session variable to track login
    const [session, setSession] = useState(false);
    // var finalData = [];
    const [finalData, setFinalData] = useState([]);
    const [assessmentQuestions, setAssessmentQuestions] = useState([]);
    const [assessmentAnswers, setAssessmentAnswers] = useState([]);
    const [assessmentOptions, setAssessmentOptions] = useState([]);
    // const assessmentOptions = [];

    const [allAnswers, setAllAnswers] = useState([]);
    const [allResults, setAllResults] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [assessmentId, setAssessmentId] = useState(searchParams.id);
    const [assessmentTitle, setAssessmentTitle] = useState(searchParams.title);
    const [assessmentType, setAssessmentType] = useState(searchParams.type);
    const [offset, setOffset] = useState(0);
    const [downloading, setDownloading] = useState(false);
    const [errorMsg, seterrorMsg] = useState('');

    // Get unique result types and assign a shade
    const [shades, setShades] = useState([]);
    const [selectedResultType, setSelectedResultType] = useState("All result types");


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
            console.log(resultData);
            // check if query result status is 200
            // if 200, that means, user is found and OTP is sent
            if(resultData.status == 200) {
                
                // set the state variables with the user data

                setAllAnswers(resultData.answers);

                // Sort based on the first number in the 'result' range
                const sortedData = resultData.results.sort((a, b) => {
                    const aResult = parseInt(a.result.split(',')[0]); // Extract the first number from 'result'
                    const bResult = parseInt(b.result.split(',')[0]);
                    
                    return aResult - bResult; // Sort in ascending order
                });
                setAllResults(sortedData);



                // showing the list of students right away
                // const uniqueCollegeIds = [...new Set(resultData.answers.map(item => item.collegeId))];
                const uniqueCollegeIds = resultData.answers.map(item => item.collegeId);
                const commaSeparatedCollegeIds = uniqueCollegeIds.join(',');
                
                // call for students data right away to show on the UI
                const result2  = await getStudentsDataAPI(process.env.NEXT_PUBLIC_API_PASS, JSON.parse(decodeURIComponent(biscuits.get('sc_user_detail'))).role, commaSeparatedCollegeIds, )
            
                const resultData2 = await result2.json() // get data
                console.log(resultData2);
                setAllStudents(resultData2.data);

                // Get unique result types and assign a shade
                const shades = sortedData.map((item, index) => {
                    return adjustColor(baseColor, index * -10); // Darken by 10% for each item
                });
                setShades(shades);

                // get the selected assessement's questions and answers
                getQuestionAnswersOfAssessment(searchParams.id);

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
 // Function to handle dropdown change
 const handleResultTypeChange = (e) => {
    setSelectedResultType(e);
  };

  // Function to filter students based on result type
  const filteredStudents = allStudents.filter((student) => {
    if (selectedResultType === "All result types") {
      return true; // Show all students when "All result types" is selected
    }
    const resultData = getResultDataByCollegeId(student.collegeId);
    return resultData.title === selectedResultType;
  });

// Function to get the Result Data based on collegeId
function getResultDataByCollegeId(collegeId) {
    // Find the answer with matching collegeId
    const answer = allAnswers.find(a => a.collegeId === collegeId);
  
    if (answer) {
      // Find the result with matching resultId
      const result = allResults.find(r => r.resultId === answer.resultId);
      if (result) {
        return result;
      }
    }
    return 'No result found';
  }
  

// Function to get the Shade Color based on collegeId
function getShadeColorByCollegeId(collegeId) {
    // Find the answer with matching collegeId
    const answer = allAnswers.find(a => a.collegeId === collegeId);
  
    if (answer) {
      // Find the result with matching resultId
    //   const result = allResults.find(r => r.resultId === answer.resultId);

      const ind = allResults.findIndex(r => r.resultId === answer.resultId);
      return ind;
    }
    return 'No result found';
  }

  function getOptions(question, collegeId){
    // parse through each question and get the respective answers.
    const assessmentOptions1 = [];
    
        for (let j = 1; j <= question.options; j++) {
            
            assessmentOptions1.push(question[`option${j}`]);
          }
        // question.
        const correctOptions = allAnswers.find(a => a.collegeId === collegeId).answers.split(',').map(item => {
            const [sequence, correctOption] = item.split('-');
            return { sequence: parseInt(sequence, 10), correctOption: parseInt(correctOption, 10) };
        })

        // Find the correct option from the correctOptions array based on sequence
        const correctOptionData = correctOptions.find(item => item.sequence === question.sequence-1);

        return question[`option${correctOptionData.correctOption + 1}`];
    // return assessmentOptions1;
  }

function getUniqueStudentsCount(resultId){
    const result = allAnswers.filter(answer => answer.resultId == resultId);
    const uniqueCollegeIds = [...new Set(result.map(item => item.collegeId))];
    return uniqueCollegeIds.length;
}


    // Get question answers of assessment
    async function getQuestionAnswersOfAssessment(assessmentId){
        
        // setSearchingSales(true);

        try {    
            
            const result  = await getQuestionAnswersOfAssessmentDataAPI(process.env.NEXT_PUBLIC_API_PASS, '-','-',assessmentId) 
            const queryResult = await result.json() // get data

            console.log(queryResult);
            // check for the status
            if(queryResult.status == 200){

                // check if data exits
                if(queryResult.questions.length > 0){
                    
                    setAssessmentQuestions(queryResult.questions);
                    setAssessmentAnswers(queryResult.results);

                    // parse through each question and get the respective answers.
                    // const assessmentOptions1 = [];
                    // for (let i = 1; i <= queryResult.questions.length; i++) {
                    //     for (let j = 1; j <= queryResult.questions[i].options; j++) {
                    //         // setAssessmentOptions([...assessmentOptions, queryResult.questions[i][`option${j}`]])
                    //         // console.log(queryResult.questions[i][`option${j}`]);
                            
                    //         assessmentOptions1.push(queryResult.questions[i][`option${j}`]);
                    //       }
                    //   }
                    // setAssessmentOptions(assessmentOptions1);
                    setDataFound(true);
                }
                else {
                    setAssessmentQuestions([]);
                    setAssessmentAnswers([]);
                    setDataFound(false);
                }

                // setSearchingSales(false);
                // setCompleted(false);
            }
            else if(queryResult.status == 401 || queryResult.status == 201 ) {
                setAssessmentQuestions([]);
                setAssessmentAnswers([]);
                // setSearchingSales(false);
                // setDataFound(false);
                // setCompleted(true);
            }
            else if(queryResult.status == 404) {
                setAssessmentQuestions([]);
                setAssessmentAnswers([]);
                // toast({
                //     description: "No more requests with "+status+" status",
                //   })
                  
                //   setSearchingSales(false);
                // setDataFound(false);
                // setCompleted(true);
            }
        }
        catch (e){
            
            // toast({ description: "Issue loading. Please refresh or try again later!", })
        }
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
                <h1 className="text-3xl font-bold leading-normal">{searchParams.title}</h1>
                {(allResults.length == 0) ? <SpinnerGap className={`${styles.icon} ${styles.load}`} /> : ''}
            </div>
            <p className="text-sm text-slate-500">Assessment Results</p>
            {/* <p className="text-sm text-slate-500">Assessment Results - Students will be in any of below result set once assessment is taken by them.</p> */}
            
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
            : <div>This assessment evaluation is based on {allResults.length} ranges</div>
        }
        
        {(shades.length > 0) ? 
        <div className={`${inter.className}`} style={{display:'flex',flexDirection:'row',justifyContent:'space-between', width:'100%', alignItems: 'start',gap:'8px'}}>
            {/* {allResults.map(result => ( */}
            {allResults.map((result, dayIndex) => (
            <Card key={dayIndex} className="w-[350px]" style={{backgroundColor: `${shades[dayIndex]}`}}>
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
        : ''}
        
        {downloading ? 
        <div className={styles.horizontalsection} style={{width:'100%',backgroundColor:'forestgreen',borderRadius:'4px',padding: '8px 12px'}}>
            <SpinnerGap className={`${styles.icon} ${styles.load}`} style={{color: 'white'}}/>
            <p className={`${inter.className} ${styles.text3}`} style={{color: 'white'}}>Downloading ...</p> 
        </div> : ''}

        {(allStudents.length > 0) ? 
        <Card className='flex flex-col gap-2 p-2'>
            <Select value={selectedResultType} onValueChange={(e)=>handleResultTypeChange(e)}>
                <SelectTrigger className="text-black">
                    <SelectValue placeholder="All result types" className="text-black" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                    {/* <SelectLabel className="text-black">All result types</SelectLabel> */}
                    <SelectItem key='All result types' value='All result types' className="text-black">All result types</SelectItem>
                        {allResults.map((row) => (
                            <SelectItem key={row.resultId} value={row.title} className="text-black">{row.title}</SelectItem>))}
                        {/* {allResults.filter(row => row.role === 'SalesExecutive').map((row) => (
                            <SelectItem key={row.id} value={row.id} className="text-black">{row.name}<br/>{row.mapTo}</SelectItem>))} */}
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Branch</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>Result Range</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Assessment date</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {filteredStudents.map((row, dayIndex) => (
                    // {allStudents.map((row) => (
                        <TableRow key={dayIndex} style={{backgroundColor: `${shades[getShadeColorByCollegeId(row.collegeId)]}`}}>
                            <TableCell className="py-2">{row.username}<br/>
                                <p className="text-muted-foreground">
                                    {row.collegeId} 
                                </p>
                            </TableCell>
                            {/* <TableCell onClick={()=>console.log(row.username)}>
                                <div className="text-sm text-slate-500 bg-slate-50 px-1 py-1 w-fit border border-slate-200 rounded">
                                    {row.username}
                                </div>
                                </TableCell> */}
                            <TableCell>{row.branch}</TableCell>
                            <TableCell>{row.year}</TableCell>
                            <TableCell>{getResultDataByCollegeId(row.collegeId).result}</TableCell>
                            <TableCell>{getResultDataByCollegeId(row.collegeId).title}</TableCell>
                            <TableCell>{dayjs(allAnswers.find(a => a.collegeId === row.collegeId).createdOn).format("DD MMM YYYY hh:mm A")}</TableCell>
                            <TableCell>
                            
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <Button className="mx-2 px-2" ><ClipboardText size={24}/> &nbsp;View Assessment</Button>            
                                            {/* <Button variant='outline' className="mx-2 px-2 text-green-600" onClick={()=>selectDealerForUpdate(row)}><PencilSimpleLine size={24} className="text-green-600"/> &nbsp;Edit</Button>             */}
                                        </SheetTrigger>
                                        <SheetContent>
                                            <SheetHeader>
                                                <SheetTitle>Assessment Answers</SheetTitle>
                                                <SheetDescription>
                                                    {row.username}<br/>{row.collegeId}<br/>{row.campusId}<br/>{row.branch} - {row.year} year
                                                </SheetDescription>
                                            </SheetHeader>
                                            <div className="grid gap-4 py-4 h-5/6 overflow-scroll">
                                                
                                                <div className="flex flex-col py-2 gap-2">
                                                    {assessmentQuestions.map((question, dayIndex) => (
                                                        <Card className='flex flex-col p-2 gap-2' key={dayIndex}>
                                                            <p className='text-slate-700'>{dayIndex+1}.&nbsp;{question.question}</p>
                                                            <p className='text-black font-semibold'>{getOptions(question, row.collegeId)}</p>
                                                        </Card>
                                                    ))
                                                    }
                                                </div>
                                                <Separator />
                                                
                                                
                                            </div>
                                            <SheetFooter>
                                            <SheetClose asChild>
                                                {/* <Button type="submit" className="bg-blue-600 text-white" onClick={()=>updateDealer(row.id)}>Update</Button> */}
                                            </SheetClose>
                                            </SheetFooter>
                                        </SheetContent>
                                    </Sheet> 
                                {/* {row.isActive == 1 ?
                                    <Button variant='outline' className="mx-2 px-2 text-red-600" onClick={()=>updateActiveStatus(row.id, 0)}><UserMinus size={24} className="text-red-600"/> &nbsp;Deactivate</Button>
                                    : <Button variant='outline' className="mx-2 px-2 text-blue-600" onClick={()=>updateActiveStatus(row.id, 1)}><UserPlus size={24} className="text-blue-600"/> &nbsp;Activate</Button>
                                }  */}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
        : ''}
        
      
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

