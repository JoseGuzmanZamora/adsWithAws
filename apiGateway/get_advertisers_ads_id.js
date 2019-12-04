var mysql = require('mysql2/promise');

var connection;

exports.handler = async (event) => {
    console.log(event);
    if (typeof connection === 'undefined') {
        try{
            connection = await mysql.createConnection({
                host: '',
                user: '',
                password: '',
                database: ''
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
    // id_adv = id advertiser
    var id_adv = '"'+ event.id_adv + '"';
    // id ad = id ads 
    var id_ad = '"'+ event.id_ad + '"';
    
    try{
        [rows, fields] = await connection.query(`SELECT * FROM ads  WHERE id = ${id_ad} AND advertiser_id = ${id_adv}`);
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
                "messages":['No ad found']
            }
            ));
    }
}