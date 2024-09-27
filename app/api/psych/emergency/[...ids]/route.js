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

    try{

        // authorize secret key
        if(await Keyverify(params.ids[0])){

                try {

                    // details to send notification
                    const adminPhoneNumber = params.ids[1];
                    const studentId = params.ids[2];
                    const studentName = params.ids[3];
                    const studentPhoneNumber = params.ids[4];
                    
                    if(adminPhoneNumber.length > 0){

                        // get the gcm_regId of admin
                        const q = 'SELECT gcm_regId from users where phoneNumber = "'+adminPhoneNumber+'" and role="PsychAdmin"';
                        const [rows, fields] = await connection.execute(q);
                        connection.release();

                        // send the notification
                        const notificationResult = await send_notification('Emergency from '+studentName+'-('+studentId+'). Phone: '+studentPhoneNumber+'', rows[0].gcm_regId, 'Single');
                            
                        // return successful update
                        return Response.json({status: 200, message:'Request submitted!', notification: notificationResult}, {status: 200})

                        // // return the user data
                        // return Response.json({status: 200, message:'Request submitted!'}, {status: 200})                   
                      
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


