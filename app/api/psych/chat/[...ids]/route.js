import pool from '../../../db'
import { Keyverify } from '../../../secretverify';
var mysql = require('mysql2')
import dayjs from 'dayjs'
const OneSignal = require('onesignal-node')

const client = new OneSignal.Client(process.env.ONE_SIGNAL_APPID, process.env.ONE_SIGNAL_APIKEY)

// S1 –––– New chat
// S2 –––– Assign admin to chat (Admin)
// S3 –––– Get chat (Student)
// S4 –––– Get chats (Admin)

// create new chat and updates existing chat for a user
export async function GET(request,{params}) {

    // get the pool connection to db
    const connection = await pool.getConnection();

    // current date time for updating
    var sentAt =  dayjs(new Date(Date.now())).format('YYYY-MM-DD HH:mm:ss');
    var currentDate =  dayjs(new Date(Date.now())).format('YYYY-MM-DD');

    try{

        // authorize secret key
        if(await Keyverify(params.ids[0])){

                try {
                  if(params.ids[1] == 'S1'){

                      // create query for insert
                      const q = 'INSERT INTO psych_chat (chatId, collegeId, adminId, message, sentAt, sentBy, chatDate, campusId) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)';
                      // create new message
                      const [rows, fields] = await connection.execute(q, [ params.ids[2], params.ids[3], params.ids[4], decodeURIComponent(params.ids[5]), sentAt, params.ids[6], currentDate, params.ids[7]]);
                      connection.release();

                      // return successful update
                      return Response.json({status: 200, message:'Message sent!'}, {status: 200})                 
                  }
                  else if(params.ids[1] == 'S2'){
                      // Assign admin to user
                      // const query1 = `UPDATE psych_chat SET adminId = ? where collegeId=?`;
                      const query1 = `UPDATE psych_chat
                                        SET adminId = CASE
                                            WHEN adminId IS '-' THEN ?
                                            ELSE CONCAT(adminId, ',', ?)
                                        END
                                        WHERE collegeId = ?;`;
                      
                      const [rows1, fields1] = await connection.execute(query1, [params.ids[2], params.ids[2], params.ids[3]]);
                      connection.release();

                      if(rows1.length > 0){
                          // return the messages data
                          return Response.json({status: 200, message:'Admin assigned!', data: rows1}, {status: 200})

                      }
                      else {
                          // user doesn't exist in the system
                          return Response.json({status: 404, message:'No more messages!'}, {status: 200})
                      }
                  }
                  else if(params.ids[1] == 'S3'){
                      // get the messages of user
                      const query1 = `select * from psych_chat where collegeId=? ORDER BY sentAt ASC LIMIT 20 OFFSET ?`;
                      
                      const [rows1, fields1] = await connection.execute(query1, [params.ids[2], params.ids[3]]);
                      connection.release();

                      if(rows1.length > 0){
                          // return the messages data
                          return Response.json({status: 200, message:'Data found!', data: rows1}, {status: 200})

                      }
                      else {
                          // user doesn't exist in the system
                          return Response.json({status: 404, message:'No more messages!'}, {status: 200})
                      }
                  }
                  else if(params.ids[1] == 'S4'){
                      // get the messages of user by admin
                      const query1 = `select collegeId,MAX(sentAt) as sentAt from psych_chat where (adminId LIKE ? OR adminId = '-') GROUP BY collegeId ORDER BY sentAt ASC LIMIT 20 OFFSET ?`;
                      // const query1 = `select collegeId,MAX(sentAt) as sentAt from psych_chat where adminId LIKE ? GROUP BY collegeId ORDER BY sentAt ASC LIMIT 20 OFFSET ?`;
                                            
                      const [rows1, fields1] = await connection.execute(query1, ["%"+params.ids[2]+"%", params.ids[3]]);
                      connection.release();

                      if(rows1.length > 0){
                          // return the messages data
                          return Response.json({status: 200, message:'Data found!', data: rows1}, {status: 200})

                      }
                      else {
                          // user doesn't exist in the system
                          return Response.json({status: 404, message:'No more messages!'}, {status: 200})
                      }
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


