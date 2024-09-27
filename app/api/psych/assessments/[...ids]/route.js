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
                            WHERE a.campusId = ? ORDER BY a.createdOn ASC`;
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

                    // get the list of assessments
                    if(params.ids[2] == 1) {
                        let query = '';
                        // check what type of requests to be shown

                        if(params.ids[3] == 'All'){
                            query = 'SELECT * FROM psych_assessments ORDER BY createdOn DESC LIMIT 20 OFFSET '+params.ids[4];
                        }
                        else {
                            query = 'SELECT * FROM psych_assessments where campusId = "'+params.ids[3]+'" ORDER BY createdOn DESC LIMIT 20 OFFSET '+params.ids[4];
                        }
                        
                        // console.log(query);
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

                    // get the list of assessment results
                    else if(params.ids[2] == 2){
                        let query1 = '', query2 = '';
                        // check what type of requests to be shown

                        query1 = 'SELECT * FROM psych_results where assessmentId = "'+params.ids[3]+'"';
                        query2 = 'SELECT * FROM psych_answers where assessmentId = "'+params.ids[3]+'" ORDER BY createdOn DESC LIMIT 20 OFFSET '+params.ids[4];
                        
                        // console.log(query1);
                        const [rows, fields] = await connection.execute(query1);
                        const [rows1, fields1] = await connection.execute(query2);
                        connection.release();

                        // check if user is found
                        if(rows.length > 0){
                            // return the requests data
                            return Response.json({status: 200, message:'Data found!', results: rows, answers: rows1}, {status: 200})

                        }
                        else {
                            // user doesn't exist in the system
                            return Response.json({status: 404, message:'No new requests!'}, {status: 200})
                        }
                    }
                    // get the students of specific result type of an assessment
                    else if(params.ids[2] == 3){
                        let query1 = '', query2 = '';
                        const collegeIds = params.ids[3].split(',');
                        const formattedIds = collegeIds.map(id => `'${id}'`).join(', ');

                        // check what type of requests to be shown

                        query2 = `SELECT username, collegeId, campusId, email, gender, phoneNumber, course, branch, year FROM users where collegeId IN (${formattedIds})`;
                        
                        // console.log(query2);
                        const [rows1, fields1] = await connection.execute(query2);
                        connection.release();

                        // check if user is found
                        if(rows1.length > 0){
                            // return the requests data
                            return Response.json({status: 200, message:'Data found!', data: rows1}, {status: 200})

                        }
                        else {
                            // user doesn't exist in the system
                            return Response.json({status: 404, message:'No new requests!'}, {status: 200})
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
  