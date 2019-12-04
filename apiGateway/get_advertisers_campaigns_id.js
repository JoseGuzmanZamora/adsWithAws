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

    var rows;
    var fields;
    var id_ad = '"'+ event.id_ad + '"';
    var id_cam = '"'+ event.id_cam + '"';
    
    try{
        [rows, fields] = await connection.query(`SELECT * FROM advertiser_campaigns  WHERE id = ${id_cam} AND advertiser_id = ${id_ad}`);
    }catch(err){
        console.log(err);
        throw new Error(JSON.stringify(
            {
                "status":500,
                "messages":['Database query error']
            }
            ));
    }
    
    if (rows.length > 0){
        return {
            "status":200,
            "response": rows
        };
    }else{
        throw new Error(JSON.stringify(
            {
                "status":404,
                "messages":['No campaign found']
            }
            ));
    }
}