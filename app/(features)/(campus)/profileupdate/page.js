'use client'

import { io } from 'socket.io-client'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'
import { Check, Info, SpinnerGap, X } from 'phosphor-react'
import React, { useCallback, useEffect, useState, useRef } from 'react'
const inter = Inter({ subsets: ['latin'] })
import styles from '../../../../app/page.module.css'
import Biscuits from 'universal-cookie'
const biscuits = new Biscuits
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Input } from '@/app/components/ui/input'
import { Button } from '@/app/components/ui/button'


// const spaceRef = ref(storage, 'images/space.jpg');
// check for the user
const checkUser = async (pass, id) => 
  
fetch("/api/user/"+pass+"/U6/"+id+"/0", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// declare the apis of this page
const submitUser = async (pass, id) => 
  
fetch("/api/user/"+pass+"/U7/"+id, {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// pass state variable and the method to update state variable
export default function ProfileUpdate() {

    // socket object
    const [socket, setSocket] = useState(undefined)

    // create a router for auto navigation
    const router = useRouter();

    // user state and requests variable
    const [user, setUser] = useState();
    const [collegeId, setCollegeId] = useState('');
    const [inputError, setInputError] = useState(false);
    const [searching, setSearching] = useState(false);
    
    const today = new dayjs();

    const [message, setMessage]=useState("")
    const [messages, setMessages]=useState([])
    const [roomName, setRoomName]=useState("")
   

    // get the user and fire the data fetch
    useEffect(()=>{

        const socket = io("http://localhost:3000");


        let cookieValue = biscuits.get('sc_user_detail')
            if(cookieValue){
                const obj = JSON.parse(decodeURIComponent(cookieValue)) // get the cookie data

                // set the user state variable
                setUser(obj)
                setCollegeId(obj.collegeId)
                setRoomName(obj.collegeId)
                
            }
            else{
                console.log('Not found')
                router.push('/')
            }

        socket.on('message',(message,roomName1,date) => {
            console.log("This is the message from server: \n"+message,roomName1,roomName,collegeId);
            
            // set the messages
            if(roomName1 == roomName){
                setMessages([...messages, {"message":message,"date":date}])
            }
            else {
                console.log('Not this id');
            }
        })
        setSocket(socket)
  

    },[collegeId, messages]);

    const onChangeHandler = (e) => {
        // console.log(e.target.value);
        setMessage(e.target.value);
    };
    const onSubmitHandler = (msg, rm) => {
        console.log(messages.length);
        console.log(rm);
        socket.emit('message',msg,rm,today)
        setMessage('');
        // socket.emit('message', e.target.value)
    };
    
// verify the collegeId by calling the API
async function submitHere(){

    // check for the input
    if(collegeId.length > 0){
        
        
    }
    else {
        setSearching(false);
        // show error incase of no input
        alert('Enter Student ID')
    }
  
}


    // clear cookies or logout
    function clearCookies(){

        //  document.cookie = "";
        biscuits.remove('sc_user_detail')

        // clearing the state variable
        setUser()
        
    }
    
  return (
    
          <div className={styles.verticalsection} style={{height:'90vh',gap:'8px',marginTop:'16px'}}>

            <div className={styles.horizontalsection} style={{height:'100%', width:'100%'}}>

                <div className={styles.carddatasection} key={1234} style={{height:'100%', width:'100%',overflow:'scroll',alignItems:'flex-start',padding:'24px',gap:'0px'}}>
                  
                  {user ?
                        <div className={styles.verticalsection} style={{ height:'100%', width:'100%',justifyContent:'space-between'}}>
                            
                                <div style={{ width:'100%'}}>
                                    {/* <p className={`${inter.className} ${styles.text1}`}>Anonymous chat</p> */}
                                    <h3 className="font-semibold leading-none tracking-tight">Anonymous chat</h3><br/>
                                    <p className="text-sm text-muted-foreground">Your details won't be disclosed to the receiver</p>
                                    {/* <p className={`${inter.className} ${styles.text3}`}>Your details won't be disclosed to the receiver</p> */}
                                    <br/>
                                        
                                        
                                        {/* <div style={{borderBottom: '0.5px solid #00000026', width:'100%',margin:'4px 0px'}}></div> */}
                                        <div>
                                            {messages.map((msg, index) => (
                                            <div key={index} style={{display:'flex',flexDirection:'column',textAlign:'end',width:'100%',flexWrap:'wrap'}}>
                                                {/* <p className={`${inter.className} ${styles.text3}`}>You</p> */}
                                                <p className={`${inter.className} ${styles.text2}`}>{msg.message}</p>
                                                <p className={`${inter.className} ${styles.text3}`} style={{fontSize:'10px'}}>{today.toString()}</p>
                                            </div>
                                            ))}
                                        </div>

                                        {/* <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:'100%',flexWrap:'wrap'}}>
                                            <p className={`${inter.className} ${styles.text3}`}>Your help</p>
                                            <p className={`${inter.className} ${styles.text2}`}>{user.email}</p>
                                        </div> */}
                                        <div style={{borderBottom: '0.5px solid #00000026', width:'100%',margin:'4px 0px'}}></div>
                                        
                                    {/* <p className={`${inter.className} ${styles.text3}`} style={{fontSize:'10px'}}>{today.toString()}</p> */}
                                  

                                

                                        <br/>
                                        <br/>
                                        
                                </div>
                                        <div className={`${inter.className}`} style={{display:'flex',flexDirection:'row',alignItems:'center',gap:'8px',width:'100%'}}>
                                {/* <input id="userObjectId" className={`${inter.className} ${styles.text2} ${styles.textInput}`} placeholder="Unique user ID" onKeyDown={handleKeyPress}/> */}
                                <Input placeholder="Type here" value={message} onChange={onChangeHandler} style={{width:'100%'}}/>
                                {/* <Input placeholder="Type here" value={input} /> */}
                                <Button onClick={() => onSubmitHandler(message,roomName)} >Send</Button>
                                
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
                                        
                                    </div>
                            
                            :''}
                       
                    
                    <br/>

    <div>
   
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


      