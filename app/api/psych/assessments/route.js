import pool from '../../db'
import { Keyverify } from '../../secretverify';
import dayjs from 'dayjs'

// 1 role – SuperAdmin / PAdmin / Student
// 2 offset – 0
// 3 campusId - SVECW or All
// 4 collegeId - Super33

export async function POST(request) {
    try {
        const { pass, role, type, students } = await request.json();

        // Authorize secret key
        if (!(await Keyverify(pass))) {
            return Response.json({ status: 401, message: 'Unauthorized' }, { status: 200 });
        }

        // Only allow for PsychAdmin and correct route
        if (role !== 'PsychAdmin' || type !== 3) {
            return Response.json({ status: 403, message: 'Forbidden' }, { status: 200 });
        }

        const connection = await pool.getConnection();
        const formattedIds = students.split(',').map(id => `'${id}'`).join(', ');
        const query = `SELECT username, collegeId, campusId, email, gender, phoneNumber, course, branch, year, section FROM users WHERE collegeId IN (${formattedIds})`;
        const [rows] = await connection.execute(query);
        
        connection.release();

        if (rows.length > 0) {
            return Response.json({ status: 200, message: 'Data found!', data: rows }, { status: 200 });
        } else {
            return Response.json({ status: 404, message: 'No new requests!' }, { status: 200 });
        }
    } catch (err) {
        return Response.json({ status: 500, message: 'Error: ' + err.message }, { status: 200 });
    }
}

export async function GET(request,{params}) {

    // get the pool connection to db
    const connection = await pool.getConnection();

    try{

        // authorize secret key
        if(await Keyverify(params[0])){
            
                // check for the user role
                // if SuperAdmin, get all the requests w.r.t status
                if(params[1] == 'Student'){

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
                    // query = 'SELECT * FROM psych_assessments WHERE campusId = "'+params[5]+'" ORDER BY createdOn DESC LIMIT 20 OFFSET '+params[3];
                    const [rows, fields] = await connection.execute(query, [params[4], params[3]]);
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
                else if(params[1] == 'PsychAdmin'){

                    // get the list of assessments
                    if(params[2] == 1) {
                        let query = '';
                        // check what type of requests to be shown

                        if(params[3] == 'All'){
                            query = 'SELECT * FROM psych_assessments ORDER BY createdOn DESC LIMIT 20 OFFSET '+params[4];
                        }
                        else {
                            query = 'SELECT * FROM psych_assessments where campusId = "'+params[3]+'" ORDER BY createdOn DESC LIMIT 20 OFFSET '+params[4];
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
                    else if(params[2] == 2){
                        let query1 = '', query2 = '';
                        // check what type of requests to be shown

                        query1 = 'SELECT * FROM psych_results where assessmentId = "'+params[3]+'"';
                        query2 = 'SELECT * FROM psych_answers where assessmentId = "'+params[3]+'" ORDER BY createdOn DESC';
                        // query2 = 'SELECT * FROM psych_answers where assessmentId = "'+params[3]+'" ORDER BY createdOn DESC LIMIT 20 OFFSET '+params[4];
                        
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
                    else if(params[2] == 3){
                        let query1 = '', query2 = '';
                        const collegeIds = params[3].split(',');
                        const formattedIds = collegeIds.map(id => `'${id}'`).join(', ');

                        // check what type of requests to be shown

                        query2 = `SELECT username, collegeId, campusId, email, gender, phoneNumber, course, branch, year, section FROM users where collegeId IN (${formattedIds})`;
                        
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

                    // get list of assessments taken by student
                    else if(params[2] == 4){
                        let query1 = '';
                        
                        // check what type of requests to be shown
                        query1 = 'SELECT *, aa.title as assessmentTitle, a.createdOn as assessedOn FROM psych_answers a JOIN psych_assessments aa ON a.assessmentId=aa.assessmentId JOIN psych_results r ON a.resultId=r.resultId where collegeId = "'+params[3]+'"';
                        const [rows1, fields1] = await connection.execute(query1);
                        
                        var questions = [];
                        const promises1 = rows1.map(async (row) => {
                            let query2 = 'SELECT * FROM psych_questions where assessmentId = "'+row.assessmentId+'"';
                            const [rows2, fields2] = await connection.execute(query2);
                            rows2.map((row11) => {
                                questions.push(row11);
                            })
                        });
                        await Promise.all(promises1);
                        

                        connection.release();

                        // check if user is found
                        if(rows1.length > 0){
                            // return the requests data
                            return Response.json({status: 200, message:'Data found!', data: rows1, questions: questions}, {status: 200})

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
            // const [rows, fields] = await connection.execute('SELECT * FROM request where isOpen = 1 and collegeId = "'+params[2]+'" ORDER BY requestDate LIMIT 5 OFFSET '+params[4]);
            
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
  