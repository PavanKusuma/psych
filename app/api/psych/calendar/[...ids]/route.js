import pool from '../../../db'
import { Keyverify } from '../../../secretverify';
import dayjs from 'dayjs'

// 1 role – SuperAdmin / PAdmin / Student
// 2 offset – 0
// 3 campusId - SVECW or All
// 4 collegeId - Super33
export async function GET(request,{params}) {

    // get the pool connection to db
    const connection = await pool.getConnection();

    try{

        // authorize secret key
        if(await Keyverify(params.ids[0])){
            
                // check for the user role
                // if SuperAdmin, get all the requests w.r.t status
                if(params.ids[1] == 'Student'){

                    let query = '';
                    // check what type of requests to be shown
                    
                    query = `SELECT 
                                DISTINCT a.assessmentId,
                                a.campusId,
                                a.media,
                                a.title,
                                a.title2,
                                a.description,
                                a.adminId,
                                a.createdOn,
                                a.assessmentType,
                                CASE
                                    WHEN ans.collegeId IS NOT NULL THEN 'yes'
                                    ELSE 'no'
                                END AS assessmentStatus,
                                    CASE
                                    WHEN ans.collegeId IS NOT NULL THEN ans.createdOn
                                    ELSE '-'
                                END AS assessmentOn
                                    
                            FROM psych_assessments a
                            LEFT JOIN (SELECT assessmentId, collegeId, createdOn FROM psych_answers order by createdOn DESC LIMIT 1) ans 
                            ON a.assessmentId = ans.assessmentId AND ans.collegeId = ?
                            WHERE a.campusId = ?`;
                    // query = 'SELECT * FROM psych_assessments WHERE campusId = "'+params.ids[5]+'" ORDER BY createdOn DESC LIMIT 20 OFFSET '+params.ids[3];
                    const [rows, fields] = await connection.execute(query, [params.ids[4], params.ids[3]]);
                    connection.release();

                    // check if user is found
                    if(rows.length > 0){
                        // return the requests data
                        return Response.json({status: 200, message:'Data found!', data: rows}, {status: 200})

                    }
                    else {
                        // user doesn't exist in the system
                        return Response.json({status: 404, message:'No new requests!'}, {status: 200})
                    }
                }

                // check for the user role
                // if SuperAdmin, get all the requests w.r.t status
                else if(params.ids[1] == 'PsychAdmin'){

                    // get the list of calendar slots
                    if(params.ids[2] == 1) {
                        let query = '';

                        query = 'SELECT day,startTime,endTime FROM psych_calendar WHERE collegeId = "'+params.ids[3]+'"';
                        
                        console.log(query);
                        const [rows, fields] = await connection.execute(query);
                        connection.release();

                        // check if user is found
                        if(rows.length > 0){

                            // Now process rows to group by dayOfWeek
                            // const schedule = rows.reduce((acc, row) => {
                            //     acc[row.day] = acc[row.day] || [];
                            //     acc[row.day].push({ start: row.startTime, end: row.endTime });
                            //     return acc;
                            // }, {});


                            // Initialize an object to hold the schedule grouped by days
                            const dayGroups = {};

                            // Process rows to group by dayOfWeek
                            rows.forEach(row => {
                                if (!dayGroups[row.day]) {
                                    dayGroups[row.day] = [];
                                }
                                dayGroups[row.day].push({ start: row.startTime, end: row.endTime });
                            });

                            // Convert the grouped object into an array
                            const scheduleArray = Object.keys(dayGroups).map(day => ({
                                day: day,
                                slots: dayGroups[day]
                            }));

                            // return the requests data
                            return Response.json({status: 200, message:'Data found!', data: scheduleArray}, {status: 200})

                        }
                        else {
                            // user doesn't exist in the system
                            return Response.json({status: 404, message:'No new requests!'}, {status: 200})
                        }
                    }

                    // get the list of assessment results
                    else if(params.ids[2] == 2){
                        let query1 = '', query2 = '';
                        // check what type of requests to be shown

                        // query1 = 'SELECT * FROM psych_results where assessmentId = "'+params.ids[3]+'"';
                        
                        const requests = params.ids[4];
                        console.log(requests);
                        const requestData = JSON.parse(requests)
                        // Function to process requests

                        requestData.forEach(request => {
        // Check if slots is present and is an array
                        if (Array.isArray(request.slots)) {
                            request.slots.forEach(slot => {
                                console.log(`Processing slot from ${slot.start} to ${slot.end} on ${request.day}`);
                                console.log(fomarttedTimeforMe(slot.start));
                                console.log(fomarttedTimeforMe(slot.end));
                                // console.log(dayjs(slot.start, "h:mm A").format("HH:mm:ss"));
                                // console.log(dayjs(slot.end, "h:mm A").format("HH:mm:ss"));
                                // Add your processing logic here
                            });
                        } else {
                            console.warn(`Slots not found or not iterable for day: ${request.day}`);
                        }
                    });


                        for (const request of requestData) {
                            
                            for (const slot of request.slots) {
                                const query = 'INSERT INTO psych_calendar (collegeId, day, startTime, endTime) VALUES (?, ?, ?, ?)';
                                connection.execute(query, [params.ids[3], request.day, fomarttedTimeforMe(slot.start), fomarttedTimeforMe(slot.end)], (err, results) => {
                                    if (err) {
                                        console.log('Failed to insert data:', err);
                                        return Response.json({status: 404, message:'Data not inserted!'}, {status: 200})
                                        return;
                                    }
                                    connection.release();
                                    console.log('Insert success:', results);
                                });
                            }
                        }
                        return Response.json({status: 200, message:'Data saved!'}, {status: 200})
                        
                        
                    }
                    // Remove a matching slot
                    else if(params.ids[2] == 3){
                        let query2 = '';
                        
                        // check what type of requests to be shown
                        query2 = 'DELETE FROM psych_calendar where collegeId = "'+params.ids[3]+'" AND day = "'+params.ids[4]+'" AND startTime = "'+params.ids[5]+'" AND endTime = "'+params.ids[6]+'" ';
                        
                        console.log(query2);
                        const [rows1, fields1] = await connection.execute(query2);
                        connection.release();

                        // check if user is found
                        if(rows1.affectedRows > 0){
                            // return the requests data
                            return Response.json({status: 200, message:'Slot removed!'}, {status: 200})

                        }
                        else {
                            // user doesn't exist in the system
                            return Response.json({status: 404, message:'No new requests!'}, {status: 200})
                        }
                    }
                    // add a slot to db
                    else if(params.ids[2] == 4){
                        
                        const query = 'INSERT INTO psych_calendar (collegeId, day, startTime, endTime) VALUES (?, ?, ?, ?)';
                        const [rows1, fields1] = await connection.execute(query, [params.ids[3], params.ids[4], params.ids[5], params.ids[6]])
                            connection.release();
                            if (rows1.affectedRows > 0) {
                                console.log('Insert success');
                                return Response.json({status: 200, message:'Slot removed!'}, {status: 200})
                                
                            }
                            else {
                                console.log('Failed to insert data:');
                                return Response.json({status: 404, message:'Data not inserted!'}, {status: 200})
                            }

                    }
                    
                }
                
                else{
                    // wrong role
                    return Response.json({status: 401, message:'Unauthorized'}, {status: 200})
                }



            // search for user based on the provided collegeId
            // const [rows, fields] = await connection.execute('SELECT * FROM request where isOpen = 1 and collegeId = "'+params.ids[2]+'" ORDER BY requestDate LIMIT 5 OFFSET '+params.ids[4]);
            
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

  const fomarttedTimeforMe = (timeStr) => {
    // Manually handle AM/PM
        const parts = timeStr.split(' ');
        const time = parts[0].split(':');
        let hour = parseInt(time[0]);
        const minute = parseInt(time[1]);
        const isPM = parts[1] === 'PM';

        if (isPM && hour < 12) hour += 12;
        if (!isPM && hour === 12) hour = 0;  // Convert 12 AM to 00

        const formattedTime = dayjs().hour(hour).minute(minute).second(0).format("HH:mm:ss");
        return formattedTime;

  }
  