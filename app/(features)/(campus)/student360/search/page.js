'use client'

import { io } from 'socket.io-client'

import { Inter } from 'next/font/google'
import { Check, Info, SpinnerGap, X, Plus, PencilSimple, UserGear } from 'phosphor-react'
import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useInView } from "react-intersection-observer";
const inter = Inter({ subsets: ['latin'] })
import styles from '../../../../page.module.css'
// import styles from '../../../../../app/page.module.css'
import Biscuits from 'universal-cookie'
const biscuits = new Biscuits
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import Toast from '../../../../components/myui/toast'
import AddStudent from '../../../../components/myui/addstudent'
import UpdateUser from '../../../../components/myui/updateuser'
import UpdateParents from '../../../../components/myui/updateparents'
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button'
// import ImageWithShimmer from '../../components/imagewithshimmer'

// search for user based on collegeId or username
const searchNow = async (pass, collegeId, offset) => 
  
fetch("/api/user/"+pass+"/U3/"+collegeId+"/"+offset, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});


// pass state variable and the method to update state variable
export default function SearchStudents() {

    const [socket, setSocket] = useState(undefined)
    
    // create a router for auto navigation
    const router = useRouter();

    const [dataFound, setDataFound] = useState(false); // use to declare 0 rows
    const [inputError, setInputError] = useState(false);
    const [searching, setSearching] = useState(false);
    const [user, setUser] = useState();
    const { ref, inView } = useInView();

    //create new date object
    const today = new dayjs();
    
   const [input,setInput] = useState('')

//    const [inbox, setInbox] = useState(["hello","nice"])
   const [message, setMessage]=useState("")
   
   const [iList,setIList]=useState([])
   const [allList,setAllList]=useState(['',[]])
   const [message1, setMessage1]=useState("")
//    const [roomName, setRoomName]=useState("Conversation007")
//    const [roomName1, setRoomName1]=useState("Conversation008")


const [messagesList, setMessagesList] = useState([]); // List of message and date objects


    // get the user and fire the data fetch
    useEffect(()=>{

        const socket = io("https://piltovr.com/socket.io");

        socket.on('help', (data) => {
            console.log("This is the message from server1: \n"+data);
            const chatObj = JSON.parse(data);

        }, (error) => {
            if (error) {
                console.error("Error receiving message:", error);
            }
        });
        
        socket.on('message2', (message) => {
            console.log("This is the message from server1: \n"+message);
        }, (error) => {
            if (error) {
                console.error("Error receiving message:", error);
            }
        });

        socket.on('message',(message,roomName1,date) => {
            console.log("Message : \n"+message);
            // console.log("CollegeId: \n"+roomName1);
            // setMessages([...messages, message]);

            // Create a new entry with the message and date
            const newEntry = { roomName1, message, date };

            // Update the messagesList state with the new entry
            setMessagesList((prevMessages) => [...prevMessages, newEntry]);

            // setIList((oldArray) => [...oldArray, newItem])
            
            
            
            // if(allList.length > 0){
            //     console.log('there');
            //     allList.map((item) => {
            //         if(item.collegeId == roomName1){
            //             item.obj.push({ at: date, message: message, });
            //             console.log('ooooooo');
            //         }
            //     })
            // }
            // else {
            //     console.log('not there');
            //     const freshMessage = { collegeId: roomName1, obj: iList, };
            //     setAllList([freshMessage]);
            //     console.log('first time');
            // }

            // iList([
            //     { id: 1, message: message, },
            //     { id: 2, name: 'Item 2', description: 'Description of item 2' },
            //     // ... more items
            //   ]);
           
            //   allList.push(iList)
        });

        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
        
        
        setSocket(socket)

        
        let cookieValue = biscuits.get('sc_user_detail')
            if(cookieValue){
                const obj = JSON.parse(decodeURIComponent(cookieValue)) // get the cookie data

                // set the user state variable
                setUser(obj)
            }
            else{
                router.push('/')
            }

    },[]);

    // socket initializer
    // const socketInitializer = async () => {
    //     await fetch("/api/socket");
    //     // const socket = io()

    //     // fetch("/api/user/"+pass+"/U3/"+collegeId+"/"+offset, {
    //     //     method: "GET",
    //     //     headers: {
    //     //         "Content-Type": "application/json",
    //     //         Accept: "application/json",
    //     //     },
    //     // });
        

    //     socket.on('connect', () => {
    //         console.log('Connected!');
    //     })

    //     socket.on('update-input', msg => {
    //         setInput(msg)
    //     })
    // }

    const onChangeHandler = (e) => {
        console.log(e.target.value);
        setMessage(e.target.value);
        // setRoomName(e.target.value+"OK");
        
        // setInput(e.target.value)
        // socket.emit('input-change', e.target.value)
    };
    const onChangeHandler1 = (e) => {
        console.log(e.target.value);
        setMessage1(e.target.value);
        // setRoomName(e.target.value+"OK");
        
        // setInput(e.target.value)
        // socket.emit('input-change', e.target.value)
    };

    const onSubmitHandler = (msg, rm) => {
        // socket.emit('message',msg,rm,today)
        // socket.emit('message1',msg)

        // chatMessage.chatId = C;
        // chatMessage.collegeId = collegeId;
        // chatMessage.adminId = '-';
        // chatMessage.message = messageController.text;
        // chatMessage.sentAt = "just now";
        // chatMessage.sentBy = collegeId;
        // chatMessage.chatDate = today.toString();
        // chatMessage.campusId = campusId;

        const obj = {
            chatId : 'C',
            collegeId: 'SS33',
            adminId: 'P33',
            message: msg,
            sentAt: today,
            sentBy: 'P33',
            chatDate: today,
            campusId: 'SVECW',

          };

        socket.emit('helpme',JSON.stringify(obj))
        // socket.emit('message', e.target.value)
    };

    // Function to handle the "Enter" key press
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            newSearch();
        }
    };

   
    
  return (

        <div className={styles.verticalsection} style={{height:'80vh',gap:'8px'}}>


            <div className={styles.horizontalsection} style={{height:'100%', width:'100%'}}>
            
                <div className={styles.carddatasection} key={1234} style={{height:'100%'}}>
                       
                    <div className={styles.verticalsection} style={{height:'100%',overflow:'scroll'}}>

                   
                        <p className={`${inter.className} ${styles.text3_heading}`}>Search by collegeId</p>
                        
                         <div className={`${inter.className}`} style={{display:'flex',flexDirection:'row',alignItems:'center',gap:'8px'}}>
                                {/* <input id="userObjectId" className={`${inter.className} ${styles.text2} ${styles.textInput}`} placeholder="Unique user ID" onKeyDown={handleKeyPress}/> */}
                                <Input placeholder="Type here" value={message} onChange={onChangeHandler}/>
                                {/* <Input placeholder="Type here" value={input} /> */}
                                <Button onClick={() => onSubmitHandler(message,'SS33')} >Find</Button>
                                {/* <button onClick={newSearch.bind(this)} className={`${inter.className} ${styles.scbtn}`} >Find</button> */}
                                
                                {/* {searching ? <div className={styles.horizontalsection}>
                                    <SpinnerGap className={`${styles.icon} ${styles.load}`} />
                                    <p className={`${inter.className} ${styles.text3}`}>Searching...</p> 
                                </div> : ''} */}
{/*                                 
                                {(searchedStudentsList!=null && searchedStudentsList.length > 0) ? <div className={styles.horizontalsection}>
                                    <p className={`${inter.className} ${styles.text3}`}>Results:</p> 
                                    <p className={`${inter.className} ${styles.text1}`}>{searchedStudentsList.length}</p>
                                </div> : ''} */}
                            </div>
                            <br/>
                            <br/>
                         <div className={`${inter.className}`} style={{display:'flex',flexDirection:'row',alignItems:'center',gap:'8px'}}>
                                {/* <input id="userObjectId" className={`${inter.className} ${styles.text2} ${styles.textInput}`} placeholder="Unique user ID" onKeyDown={handleKeyPress}/> */}
                                <Input placeholder="Type here" value={message1} onChange={onChangeHandler1}/>
                                {/* <Input placeholder="Type here" value={input} /> */}
                                <Button onClick={() => onSubmitHandler(message1,'SSS33')} >Find</Button>
                                {/* <button onClick={newSearch.bind(this)} className={`${inter.className} ${styles.scbtn}`} >Find</button> */}
                                
                                {/* {searching ? <div className={styles.horizontalsection}>
                                    <SpinnerGap className={`${styles.icon} ${styles.load}`} />
                                    <p className={`${inter.className} ${styles.text3}`}>Searching...</p> 
                                </div> : ''} */}
{/*                                 
                                {(searchedStudentsList!=null && searchedStudentsList.length > 0) ? <div className={styles.horizontalsection}>
                                    <p className={`${inter.className} ${styles.text3}`}>Results:</p> 
                                    <p className={`${inter.className} ${styles.text1}`}>{searchedStudentsList.length}</p>
                                </div> : ''} */}
                            </div>

{/* <div>
<pre>{JSON.stringify(collegeData, null, 2)}</pre>
</div> */}
                            <div>
                                {messagesList.map((msg, index) => (
                                <p key={index}>{msg.message}</p>
                                ))}
                            </div>
                          
                {/* <div>
                {iList.length > 0 ?
                            iList.map((item, index) => {
                    <div key={index}>
                    <p>{item.message}</p>
                    <p>{item.at}</p>
                    </div>
                    
                })
                : <p>No data</p>
            }
            </div>
            <div>
                           { allList.map((item, index) => {
                    <div key={index}>
                    <p>{item.collegeId}</p>
                    <p>{item.obj.message}</p>
                    </div>
                    
                })}
                </div> */}
                            <div className={styles.horizontalsection}>
                               
                                {searching ? <div className={styles.horizontalsection}>
                                        <SpinnerGap className={`${styles.icon} ${styles.load}`} />
                                        <p className={`${inter.className} ${styles.text3}`}>Searching...</p> 
                                    </div> : ''}
                            </div>
                           
                            
                            {/* <button id="submit" onClick={loginHere.bind(this)} className={`${inter.className} ${styles.text2} ${styles.primarybtn}`}>Sign in</button> */}
                        
                            {/* {(!dataFound && endOfData && searchedStudentsList.length == 0) ? <div className={`${styles.error} ${inter.className} ${styles.text2}`}>No match found</div> */}
                                {/* :''} */}
                            {/* {inputError ? <div className={`${styles.error} ${inter.className} ${styles.text2}`}>Enter valid ID to proceed</div>
                                :''} */}
                            

                      </div>
                
            </div>

        </div>
        
                
    </div>
    
    
    
  );
}
      
      function abbreviateName(name) {
        const words = name.split(' ');
        if (words.length >= 2) {
          return `${words[0][0]}${words[1][0]}`;
        } else if (words.length === 1) {
          return `${words[0][0]}${words[0][1]}`;
        } else {
          return 'Invalid Name';
        }
      }