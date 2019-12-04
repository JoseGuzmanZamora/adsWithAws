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
    if (!('publisher-id' in event)){
        throw new Error(JSON.stringify({'status': 404, 'messages': ['publisher-id not included']}));
    }
    var pubID = event['publisher-id'];
    var rows;
    var fields;
    try {
        [rows, fields] = await connection.query(`SELECT id, name FROM publisher_campaigns where publisher_id=${pubID}`);
    }
    catch(err) {
        console.log(err);
        throw new Error(JSON.stringify({"status": 500, "messages": ['Database query error']}));
    }
    if (rows.length > 0){
        return {"status": 200, "response": rows};   
    }else{
        throw new Error(JSON.stringify({"status": 404, "messages": ['No existe publisher o no tiene campaigns']}));   
    }
}   