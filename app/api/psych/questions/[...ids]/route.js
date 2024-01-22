import pool from '../../../db'
import { Keyverify } from '../../../secretverify';
import dayjs from 'dayjs'

// 1 role – SuperAdmin / PAdmin / Student
// 2 offset – 0
// 3 collegeId - Super33
// 4 campusId - SVECW or All
// 5 assessmentId 
export async function GET(request,{params}) {

    // get the pool connection to db
    const connection = await pool.getConnection();

    try{

        // authorize secret key
        if(await Keyverify(params.ids[0])){

                    let query = '';
                    let query2 = '';
                    // check what type of requests to be shown
                    
                    query = 'SELECT * FROM psych_questions WHERE assessmentId = "'+params.ids[5]+'" ORDER BY sequence DESC LIMIT 50 OFFSET '+params.ids[3];
                    query2 = 'SELECT * FROM psych_results WHERE assessmentId = "'+params.ids[5];
                    const [rows, fields] = await connection.execute(query);
                    const [rows1, fields1] = await connection.execute(query2);
                    connection.release();

                    // check if user is found
                    if(rows.length > 0){
                        // return the requests data
                        return Response.json({status: 200, message:'Data found!', questions: rows, results: rows1}, {status: 200})

                    }
                    else {
                        // user doesn't exist in the system
                        return Response.json({status: 404, message:'No questions!'}, {status: 200})
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
  