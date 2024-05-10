import pool from '../../../../db'
import { Keyverify } from '../../../../secretverify';
import dayjs from 'dayjs'

// S1 ADMIN ––––– get the appointments that are unassigned and assigned by campus by duration
// S2 ADMIN ––––– get the appointments by user
// S3 USERS ––––– get the appointments that are mine by requestDate
// S4 SUPERADMIN ––––– get all appointments 

// 1 role – SuperAdmin / PAdmin / Student
// 2 stage
// 3 requestStatus – Approved, Issued or All
// 4 offset – 0
// 5 collegeId - Super33
// 6 campusId - SVECW or All
// 7 dates – from,to
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
                    
                    query = 'SELECT * FROM psych_appointment WHERE collegeId = "'+params.ids[5]+'" ORDER BY createdOn DESC LIMIT 20 OFFSET '+params.ids[4];
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

                // check for the user role
                // if SuperAdmin, get all the requests w.r.t status
                else if(params.ids[1] == 'PsychAdmin'){

                    // verify what type of requests admin is asking
                    let query = '';
                    let query1 = '';
                    let query2 = '';

                    // based on the status, the query might change because of the ORDER BY
                    if(params.ids[2] == 'S1'){

                        // get the unassigned appointments by campus
                        var query1 = '', query2 = '';
                        if(params.ids[6] == 'All'){ // check if we need to call all campuses data or specific campus
                            // query1 = 'SELECT * FROM psych_appointment WHERE requestStatus = "'+params.ids[3]+'" ORDER BY createdOn DESC LIMIT 50 OFFSET '+params.ids[4];
                            query1 = 'SELECT a.*,u.username,u.email,u.phoneNumber,u.course,u.branch,u.year,u.gender FROM psych_appointment a JOIN users u ON a.collegeId=u.collegeId WHERE a.requestStatus = "'+params.ids[3]+'" ORDER BY a.createdOn DESC LIMIT 50 OFFSET '+params.ids[4];
                            // get the assigned appointments by campus
                            // query2 = 'SELECT * FROM psych_appointment WHERE adminId = "'+params.ids[5]+'" ORDER BY createdOn DESC LIMIT 50 OFFSET '+params.ids[4];    
                            query2 = 'SELECT a.*,u.username,u.email,u.phoneNumber,u.course,u.branch,u.year,u.gender FROM psych_appointment a JOIN users u ON a.collegeId=u.collegeId WHERE a.adminId = "'+params.ids[5]+'" ORDER BY a.createdOn DESC LIMIT 50 OFFSET '+params.ids[4];    
                        }
                        else {
                            // query1 = 'SELECT * FROM psych_appointment WHERE requestStatus = "'+params.ids[3]+'" AND campusId = "'+params.ids[6]+'" ORDER BY createdOn DESC LIMIT 50 OFFSET '+params.ids[4];
                            query1 = 'SELECT a.*,u.username,u.email,u.phoneNumber,u.course,u.branch,u.year,u.gender FROM psych_appointment a JOIN users u ON a.collegeId=u.collegeId WHERE a.requestStatus = "'+params.ids[3]+'" AND a.campusId = "'+params.ids[6]+'" ORDER BY a.createdOn DESC LIMIT 50 OFFSET '+params.ids[4];
                            // get the assigned appointments by campus
                            // query2 = 'SELECT * FROM psych_appointment WHERE campusId = "'+params.ids[6]+'" AND adminId = "'+params.ids[5]+'" ORDER BY createdOn DESC LIMIT 50 OFFSET '+params.ids[4];
                            query2 = 'SELECT a.*,u.username,u.email,u.phoneNumber,u.course,u.branch,u.year,u.gender FROM psych_appointment a JOIN users u ON a.collegeId=u.collegeId WHERE a.campusId = "'+params.ids[6]+'" AND a.adminId = "'+params.ids[5]+'" ORDER BY a.createdOn DESC LIMIT 50 OFFSET '+params.ids[4];
                        }
                    
                        const [rows1, fields1] = await connection.execute(query1);
                        const [rows2, fields2] = await connection.execute(query2);
                        connection.release();
                    
                        // check if user is found
                        if(rows2.length > 0 || rows1.length > 0){
                            // return the requests data
                            return Response.json({status: 200, message:'Data found!', newdata: rows1, olddata: rows2}, {status: 200})

                        }
                        else {
                            // user doesn't exist in the system
                            return Response.json({status: 404, message:'No new requests!'}, {status: 200})
                        }
                    }
                    else if(params.ids[2] == 'S2'){
                        
                        query = 'SELECT * FROM psych_appointment WHERE collegeId = "'+params.ids[5]+'" ORDER BY requestDate ASC LIMIT 50 OFFSET '+params.ids[4];
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
                    else if(params.ids[2] == 'S3'){
                        
                        query = 'SELECT * FROM psych_appointment ORDER BY requestDate ASC LIMIT 50 OFFSET '+params.ids[4];
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
  