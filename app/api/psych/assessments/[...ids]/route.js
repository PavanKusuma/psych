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

                    let query = '';
                    // check what type of requests to be shown

                    if(params.ids[2] == 'All'){
                        query = 'SELECT * FROM psych_assessments ORDER BY createdOn DESC LIMIT 20 OFFSET '+params.ids[3];
                    }
                    else {
                        query = 'SELECT * FROM psych_assessments where campusId = "'+params.ids[2]+'" ORDER BY createdOn DESC LIMIT 20 OFFSET '+params.ids[3];
                    }
                    
                    console.log(query);
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
  