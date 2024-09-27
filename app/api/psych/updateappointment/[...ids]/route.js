import pool from '../../../db'
import { Keyverify } from '../../../secretverify';
var mysql = require('mysql2')
import dayjs from 'dayjs'
const OneSignal = require('onesignal-node')

const client = new OneSignal.Client(process.env.ONE_SIGNAL_APPID, process.env.ONE_SIGNAL_APIKEY)

// params used for this API
// mode (0 – inperson, 1 – googlemeet, 2 – zoom)
// appointmentId, collegeId, adminId, topic, description, requestDate, isOpen, requestStatus, notes, mode, createdOn, updatedOn

// stage is useful to define which stage of the request is
// Stage1 –– To be Confirmed –– get the playerId of student for sending the status update for Stage 1 and 2
// Stage2 –– To be InMeeting –– both
// Stage3 –– To be Completed
// Stage4 –– To be Cancelled –– Move the request to closed by updating isOpen = 0 and status to Canceled – This can be done by Student or Admin (Add extra comment to mention who did it)
// Stage5 –– Just meeting time update to be done by admin or user

// 1 stage
// 2 appointmentId
// 3 collegeId
// 4 adminId
// 5 updatedOn
// 6 playerId
// 7 notes

export async function GET(request,{params}) {

    // get the pool connection to db
    const connection = await pool.getConnection();

    // check for the comment string incase if its empty
    let comment = '';
    if(params.ids[7] == '-'){
        comment = '-';
    }
    else {
        comment = decodeURIComponent(params.ids[7])+'\n';
        // comment = '\n'+params.ids[8];
    }

    // current date time for updating
    var currentDate =  dayjs(new Date(Date.now())).format('YYYY-MM-DD HH:mm:ss');
    
    try{

        // authorize secret key
        if(await Keyverify(params.ids[0])){

            if(params.ids[1] == 'S1'){
                    
                    try {
                        const [rows, fields] = await connection.execute('UPDATE psych_appointment SET adminId ="'+params.ids[3]+'", adminName ="'+params.ids[4]+'", requestStatus ="Confirmed", updatedOn ="'+params.ids[5]+'" where appointmentId = "'+params.ids[2]+'"');
                        // const [rows, fields] = await connection.execute('UPDATE psych_appointment SET adminId ="'+params.ids[4]+'", requestStatus ="'+params.ids[6]+'", updatedOn ="'+params.ids[7]+'" where appointmentId = "'+params.ids[2]+'"');

                        // get the player Id of users using collegeId
                        const [rows1, fields1] = await connection.execute('SELECT gcm_regId from users where collegeId = "'+params.ids[6]+'"');
                        connection.release();
    

                        // send the notification
                        const notificationResult = await send_notification('🙌 Your appointment is confirmed!', rows1[0].gcm_regId, 'Single');

                        // return the response
                        return Response.json({status: 200,message: 'Updated!',notification: notificationResult,});
                    
                    } catch (error) { // error updating
                        return Response.json({status: 404, message:'No request found!'+error.message}, {status: 200})
                    }
                
                
            }
            
            else if(params.ids[1] == 'S2'){
            
                try {
                    const [rows, fields] = await connection.execute('UPDATE psych_appointment SET requestStatus ="InMeeting", updatedOn ="'+params.ids[5]+'" where appointmentId = "'+params.ids[2]+'"');
                    // get the player Id of users using collegeId
                    const [rows1, fields1] = await connection.execute('SELECT gcm_regId from users where collegeId = "'+params.ids[6]+'"');
                    connection.release();

                    // send the notification
                    const notificationResult = await send_notification('🗓️ Your meeting stared!', rows1[0].gcm_regId, 'Single');
                    
                    // return successful update
                    return Response.json({status: 200, message:'Updated!',notification: notificationResult,}, {status: 200})
                } catch (error) { // error updating
                    return Response.json({status: 404, message:'No request found!'}, {status: 200})
                }
            
            
            }
            
            // 0. Pass
            // 1. stage
            // 2. appointmentId
            // 3. status
            // 4. updatedOn
            // 5. playerId
            // 6. notes
            else if(params.ids[1] == 'S3'){ 
                try {
                    const [rows, fields] = await connection.execute('UPDATE psych_appointment SET isOpen = 0, requestStatus ="Completed", updatedOn = "'+params.ids[5]+'", notes = "'+comment+'" where appointmentId = "'+params.ids[2]+'" and isOpen = 1');
                    const [rows1, fields1] = await connection.execute('SELECT gcm_regId from users where collegeId = "'+params.ids[6]+'"');
                    connection.release();
                    // check if the request is updated. 
                    // It will not get updated incase Any Admin has cancelled the request before checkout
                    if(rows.affectedRows == 0){
                        return Response.json({status: 403, message:'Your request is cancelled!'}, {status: 200})
                    }
                    else {
                       
                        // send the notification
                        const notificationResult = await send_notification('🗓️ Your appointment is completed', rows1[0].gcm_regId, 'Single');

                        // return successful update
                        return Response.json({status: 200, message:'Updated!',notification: notificationResult,}, {status: 200})
                    }
                    
                    
                } catch (error) { // error updating
                    return Response.json({status: 404, message:'No request found!'}, {status: 200})
                }
                
            }
            
            // 0. Pass
            // 1. stage
            // 2. appointmentId
            // 3. adminId
            // 4. collegeId

            else if(params.ids[1] == 'S4'){ 
                try {
                    const [rows, fields] = await connection.execute('UPDATE psych_appointment SET isOpen = 0, requestStatus ="Cancelled", updatedOn="'+currentDate+'" where appointmentId = "'+params.ids[2]+'"');
                    // get the player Id of users using collegeId
                    const [rows1, fields1] = await connection.execute('SELECT gcm_regId from users where collegeId = "'+params.ids[4]+'"');
                    const [rows2, fields2] = await connection.execute('SELECT u.gcm_regId, p.requestDate from users u JOIN psych_appointment p ON u.collegeId=p.adminId where p.appointmentId = "'+params.ids[2]+'"');
                    console.log('SELECT u.gcm_regId, p.requestDate from users u JOIN psych_appointment p ON u.collegeId=p.adminId where p.appointmentId = "'+params.ids[2]+'"');
                    
                    connection.release();

                    // send the notification
                    const notificationResult = await send_notification('✅ Your appointment is cancelled', rows1[0].gcm_regId, 'Single');
                    const notificationResult1 = await send_notification('✅ Appointment for '+dayjs().format('DD-MM-YYYY HH:mm A')+' is cancelled', rows2[0].gcm_regId, 'Single');
                    
                    // return successful update
                    return Response.json({status: 200, message:'Updated!',notification: notificationResult,notification1: notificationResult1,}, {status: 200})
                } catch (error) { // error updating
                    return Response.json({status: 404, message:'No request found!'+error.message}, {status: 200})
                }
                
            }
            
            // 0. Pass
            // 1. stage
            // 2. appointmentId
            // 4. requestDate
            // 5. adminId
            // 6. collegeId
            else if(params.ids[1] == 'S5'){ 
                try {
                    const [rows, fields] = await connection.execute('UPDATE psych_appointment SET requestDate="'+params.ids[3]+'", updatedOn="'+currentDate+'" where appointmentId = "'+params.ids[2]+'"');
                    // get the player Id of users using collegeId
                    const [rows1, fields1] = await connection.execute('SELECT gcm_regId from users where collegeId = "'+params.ids[5]+'"');
                    connection.release();

                    // send the notification
                    const notificationResult = await send_notification('🗓️ Your appointment time is updated', rows1[0].gcm_regId, 'Single');
                    
                    // return successful update
                    return Response.json({status: 200, message:'Updated!',notification: notificationResult,}, {status: 200})
                } catch (error) { // error updating
                    return Response.json({status: 404, message:'No request found!'+error.message}, {status: 200})
                }
                
            }
            
            else{
                // wrong role
                return Response.json({status: 401, message:'Unauthorized'}, {status: 200})
            }
        }
        else {
            // wrong secret key
            return Response.json({status: 401, message:'Unauthorized'}, {status: 200})
        }
    }
    catch (err){
        // some error occured
        return Response.json({status: 500, message:'Facing issues. Please try again!'+err.message}, {status: 200})
    }
  }

  // send the notification using onesignal.
  // use the playerIds of the users.
  // check if playerId length > 2
  async function send_notification(message, playerId, type) {

    return new Promise(async (resolve, reject) => {
      // send notification only if there is playerId for the user
      if (playerId.length > 0) {
        var playerIds = [];
        playerIds.push(playerId);
  
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
            include_player_ids: playerIds,
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

//   async function send_notification(message, playerId, type){
    
//     // send notification only if there is playerId for the user
//     if(playerId.length > 0){
//         var playerIds = []
//         playerIds.push(playerId)

//         var notification;
//         // notification object
//         if(type == 'Single'){
//             notification = {
//                 contents: {
//                     'en' : message,
//                 },
//                 // include_player_ids: ['playerId'],
//                 include_player_ids: [playerId]
//             };
//         }
//         else {
//             notification = {
                
//             contents: {
//                 'en' : message,
//             },
//             include_player_ids: playerIds,
//         };
//         }

//         await client.createNotification(notification).then(res => {
//             console.log(res);
//         }).catch(e => {
//             console.log(e);
//         })
        
        
//     }
//   }