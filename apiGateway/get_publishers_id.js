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
    var id = '"'+ event.id + '"';
    
    try{
        [rows, fields] = await connection.query(`SELECT * FROM publishers  WHERE id = ${id}`);
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
                "messages":['No publishers']
            }
            ));
    }
}