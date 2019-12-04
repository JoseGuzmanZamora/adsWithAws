var mysql = require('mysql2/promise');

var connection;

exports.handler = async (event) => {
    console.log(event);
    if (typeof connection === 'undefined') {
        try {
            connection = await mysql.createConnection({
                host: '',
                user: '',
                password: '',
                database: ''
                });
        }
        catch(err) {
            console.log(err);
            throw new Error(JSON.stringify({"status": 500, "messages": ['Database connection error']}));
        }
    }
    console.log(event);
    /*if (!(event.id)) {
        throw new Error(JSON.stringify({'status': 404, 'messages': ['Advertiser-id not found.']}));
    }*/
    var adID = parseInt(event.id, 10);
    
    var rows;
    var fields;
    try {
        [rows, fields] = await connection.query(`SELECT publisher_id FROM publisher_exclusions WHERE advertiser_id=${adID}`);
    }
    catch(err) {
        console.log(err);
        throw new Error(JSON.stringify({"status": 404, "messages": ['Database query error']}));
    }
    if (rows.length > 0){
        return {"status": 200, "response": rows};   
    }else{
        throw new Error(JSON.stringify({"status": 404, "messages": ['El advertiser no existe o no tiene exclusiones.']}));   
    }
}