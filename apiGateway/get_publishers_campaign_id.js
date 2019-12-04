var mysql = require('mysql2/promise');

var connection;

exports.handler = async (event) => {
    console.log(event);
    if (typeof connection === 'undefined') {
        try {
            connection = await mysql.createConnection({

                });
        }
        catch(err) {
            console.log(err);
            throw new Error(JSON.stringify({"status": 500, "messages": ['Database connection error']}));
        }
    }
    if (!('publisher-id' in event)) {
        throw new Error(JSON.stringify({'status': 404, 'messages': ['Publisher-id not found.']}));
    }
    if (!('campaign-id' in event)) {
        throw new Error(JSON.stringify({'status': 404, 'messages': ['Campaign-id not found.']}));
    }
    var pubID = event['publisher-id'];
    var campID = event['campaign-id'];
    var rows;
    var fields;
    try {
        [rows, fields] = await connection.query(`SELECT id, name, commission FROM publisher_campaigns WHERE id=${campID} and publisher_id=${pubID}`);
    }
    catch(err) {
        console.log(err);
        throw new Error(JSON.stringify({"status": 500, "messages": ['Database query error']}));
    }
    if (rows.length > 0){
        return {"status": 200, "response": rows};   
    }else{
        throw new Error(JSON.stringify({"status": 404, "messages": ['No publishers_campaigns']}));   
    }
}