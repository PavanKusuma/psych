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
                let query = '';
                if(params.ids[3] == 'EMOTION') {

                    if(params.ids[4] != 'All'){

                        // get the feelings for specific emotion
                        query = 'SELECT emotion,feeling,description,media FROM psych_emotions where emotion = "'+params.ids[4]+'" ORDER BY feeling ASC LIMIT 50 OFFSET '+params.ids[2];

                    }
                    else {
                        
                        // get the feelings
                        query = 'SELECT emotion,feeling,description,media FROM psych_emotions ORDER BY feeling ASC LIMIT 50 OFFSET '+params.ids[2];
                    }
                }
                else if(params.ids[3] == 'FEELING'){
                                        
                    // get the specific feeling details
                    query = 'SELECT * FROM psych_emotions where feeling = "'+params.ids[4]+'"';

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
  