import pool from '../../../db'
import { Keyverify } from '../../../secretverify';
import dayjs from 'dayjs'

// 1 role – SuperAdmin / PAdmin / Student
// 2 answerId 
// 3 campusId - SVECW or All
// 4 collegeId - Super33
// 5 assessmentId
// 6 answers
// 7 resultId
export async function GET(request,{params}) {

    // get the pool connection to db
    const connection = await pool.getConnection();

    // current date time for updating
    var currentDate =  dayjs(new Date(Date.now())).format('YYYY-MM-DD HH:mm:ss');

    try{

        // authorize secret key
        if(await Keyverify(params.ids[0])){
                
            // create query for insert
            const q = 'INSERT INTO psych_answers (answerId, campusId, collegeId, assessmentId, answers, createdOn, resultId) VALUES ( ?, ?, ?, ?, ?, ?, ?)';
            // create new request
            const [rows, fields] = await connection.execute(q, [ params.ids[2], params.ids[3], params.ids[4], params.ids[5], params.ids[6], currentDate, params.ids[7]]);
            connection.release();

            // return the user data
            return Response.json({status: 200, message:'Result saved!'}, {status: 200})          
              
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
  