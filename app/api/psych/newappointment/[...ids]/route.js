import pool from '../../../db'
import { Keyverify } from '../../../secretverify';
var mysql = require('mysql2')
import dayjs from 'dayjs'
const OneSignal = require('onesignal-node')

const client = new OneSignal.Client(process.env.ONE_SIGNAL_APPID, process.env.ONE_SIGNAL_APIKEY)

// create new appointment request by the student
// returns the data on success

// mode (0 – inperson, 1 – googlemeet, 2 – zoom)
// appointmentId, collegeId, adminId, topic, description, requestDate, isOpen, requestStatus, notes, mode, createdOn, updatedOn, campusId
export async function GET(request,{params}) {

    // get the pool connection to db
    const connection = await pool.getConnection();

    // current date time for updating
    var currentDate =  dayjs(new Date(Date.now())).format('YYYY-MM-DD HH:mm:ss');

    try{

        // authorize secret key
        if(await Keyverify(params.ids[0])){

                try {

                    // check if any active request exists for the provided collegeId
                    const q0 = 'select collegeId from psych_appointment where collegeId="'+params.ids[2]+'" and isOpen = 1';
                    const [rows0, fields0] = await connection.execute(q0);
                    
                    if(rows0.length == 0){

                        // create query for insert
                        const q = 'INSERT INTO psych_appointment (appointmentId, collegeId, adminId, topic, description, requestDate, isOpen, requestStatus, notes, mode, createdOn, updatedOn, campusId) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                        // create new request
                        const [rows, fields] = await connection.execute(q, [ params.ids[1], params.ids[2], params.ids[3], params.ids[4], decodeURIComponent(params.ids[5]), params.ids[6], 1,  "Submitted", "-", 0, currentDate, currentDate, params.ids[7]]);
                        connection.release();

                        // get the gcm_regIds of SuperAdmin and branch admin to notify
                        // const [nrows, nfields] = await connection.execute('SELECT gcm_regId FROM `user` where role IN ("SuperAdmin_P")');

                        // // get the gcm_regIds list from the query result
                        // var gcmIds = [];
                        // for (let index = 0; index < nrows.length; index++) {
                        //   const element = nrows[index].gcm_regId;
                        //   if(element.length > 3)
                        //     gcmIds.push(element); 
                        // }

                        // // var gcmIds = 
                        // // console.log(gcmIds);

                        // // send the notification
                        // const notificationResult = await send_notification('New appointment request received!', gcmIds, 'Multiple');
                            
                        // // return successful update
                        // return Response.json({status: 200, message:'Request submitted and waiting for confirmation!', notification: notificationResult}, {status: 200})

                        // return the user data
                        return Response.json({status: 200, message:'Request submitted!'}, {status: 200})                   
                      
                    }
                    else {
                      // return message to close active requests
                      return Response.json({status: 201, message:'Close active requests before raising new one!'}, {status: 201})
                    }

                    
                } catch (error) {
                    // user doesn't exist in the system
                    return Response.json({status: 404, message:'Error creating request. Please try again later!'+error.message}, {status: 200})
                }
            
        }
        else {
            // wrong secret key
            return Response.json({status: 401, message:'Unauthorized'}, {status: 200})
        }
    }
    catch (err){
        // some error occured
        return Response.json({status: 500, message:'Facing issues. Please try again!'}, {status: 200})
    }
    
    
  }

  

  // send the notification using onesignal.
  // use the playerIds of the users.
  // check if playerId length > 2
  async function send_notification(message, playerId, type) {
// console.log(playerId);
    return new Promise(async (resolve, reject) => {
      // send notification only if there is playerId for the user
      if (playerId.length > 0) {
        // var playerIds = [];
        // playerIds.push(playerId);
  
        var notification;
        // notification object
        if (type == 'Single') {
          notification = {
            contents: {
              'en': message,
            },
            // include_player_ids: ['playerId'],
            // include_player_ids: ['90323-043'],
            include_player_ids: [playerId],
          };
        } else {
          notification = {
            contents: {
              'en': message,
            },
            include_player_ids: playerId,
          };
        }
  
        try {
          // create notification
          const notificationResult = await client.createNotification(notification);
          
          resolve(notificationResult);

        } catch (error) {
          
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  }


