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
                    "messages":['Database connection  error']
                }
                ));
        }
    }

    var rows;
    var fields;
    // id_camp = id advertiser campaigns
    var id_camp = event.id_camp;

    
    try{
        [rows, fields] = await connection.query(`SELECT * FROM campaign_ads  WHERE campaign_id = ${id_camp}`);
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
                "messages":['No compaign_ads found']
            }
            ));
    }
}