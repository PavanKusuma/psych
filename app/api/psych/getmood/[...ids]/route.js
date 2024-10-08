import pool from '../../../db'
import { Keyverify } from '../../../secretverify';
import dayjs from 'dayjs'

// 1 role – SuperAdmin / PAdmin / Student
// 2 universityId – SS33
// 3 campusId – SS33
// 4 collegeId – SS33
// 5 year
// 6 month

// 3 id – ( 1 = list, 2 = detail )
// 4 topic – All, topicName – "This is for the listing and filter by All or TopicName"


// 3 campusId - SVECW or All
// 4 collegeId - Super33
export async function GET(request,{params}) {

    // get the pool connection to db
    const connection = await pool.getConnection();

    try{

        // authorize secret key
        if(await Keyverify(params.ids[0])){

                let query = '';
                if(params.ids[1] == 'Student') {

                    if(params.ids[2] == 'M1') {

                        // get the feelings for specific emotion
                        query = 'SELECT * FROM psych_mood WHERE collegeId = "'+params.ids[3]+'" ORDER BY id ASC LIMIT 30 OFFSET '+params.ids[4];
                        
                    }
                    else if(params.ids[2] == 'M2') {
                        // consolidated for the graph for student
                        query = 'SELECT DATE(createdOn) AS `Date`, SUM(CASE WHEN emotion = "MoreHappy" THEN 1 ELSE 0 END) AS MoreHappy, SUM(CASE WHEN emotion = "Happy" THEN 1 ELSE 0 END) AS Happy, SUM(CASE WHEN emotion = "Sad" THEN 1 ELSE 0 END) AS Sad, SUM(CASE WHEN emotion = "Fear" THEN 1 ELSE 0 END) AS Fear FROM psych_mood WHERE collegeId="'+params.ids[3]+'" GROUP BY DATE(createdOn) ORDER BY DATE(createdOn) ASC';
                        // // get the feelings for specific emotion
                        // query = 'SELECT title,description,media FROM psych_mood where FIND_IN_SET("'+params.ids[4]+'", feeling) > 0 ORDER BY createdDate ASC LIMIT 50 OFFSET '+params.ids[2];
                    }
                    else if(params.ids[2] == 'M3') {
                        // get all moods of a student for a given year and month
                        query = 'SELECT * FROM psych_mood WHERE YEAR(createdOn) = '+params.ids[5]+' AND MONTH(createdOn) = '+params.ids[6]+' AND collegeId = "'+params.ids[3]+'" ORDER BY createdOn ASC';
                    }
                    // web admin
                    else if(params.ids[2] == 'M4') {
                        // get all the moods checked in by a student
                        query = 'SELECT * FROM psych_mood WHERE collegeId = "'+params.ids[3]+'" ORDER BY createdOn DESC';
                    }

                }
                else {
                                        
                    // get the specific title details
                    query = 'SELECT emotion, count(*) as count, COUNT(DISTINCT collegeId) AS collegeId FROM `psych_mood` GROUP BY emotion';
                    
                }
                
                const [rows, fields] = await connection.execute(query);
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
  