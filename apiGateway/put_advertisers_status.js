var mysql = require('mysql2/promise');

var connection;

exports.handler = async (event) => {
    console.log(event);
    if (typeof connection === 'undefined') {
        try{
            connection = await mysql.createConnection({
               
            });
        }catch(err){
            console.log(err);
            throw new Error(JSON.stringify(
                {
                    "status":500,
                    "messages":['Database connection error']
                }
                ));
        }
    }

    if(!('status' in event.body)){
        throw new Error(JSON.stringify(
            {
                'status':400,
                'messages':['Status not found']
            }
        ));
    }
    

    if(event.body['status'].toString().length < 1){
        throw new Error(JSON.stringify(
            {
                'status':400, 
                'messages':['Status is invalid']
            }
        ));
    }
    
    var code;
    var result;
    var id_ad = event.id_ad;
    var id_cam = event.id_cam;
    var status = event.body['status'];
    
   if(status == true){
        status = 1;
    }else if(status == false){
        status = 0;
    }else{
        throw new Error(JSON.stringify(
            {
                'status':400,
                'messages':['Status is invalid']
            }
        ));
    }
    
 
    try{
        [result] = await connection.query(`UPDATE advertiser_campaigns SET status = ${status} WHERE id = ${id_cam} AND advertiser_id = ${id_ad}`);
        console.log(result);
        if((result.info).toString().includes('Rows matched: 0')){
            code = 404;
            throw new Error('Not Found');
        }else{
            return {
            'status':204
            };
        }
    }catch(err){
        console.log(err);
        if (code == 404){
            throw new Error(JSON.stringify(
            {
                'status':404,
                'messages':['Campign not found']
            }
            ));
        }else{
            throw new Error(JSON.stringify(
            {
                'status':500,
                'messages':['Database query error']
            }
            ));
        }
    }
}