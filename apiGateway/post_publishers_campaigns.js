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
            throw new Error(JSON.stringify({'status': 500, 'messages': ['Database connection error']}));
        }
    }
    if (!('id' in event)) {
        throw new Error(JSON.stringify({'status': 400, 'messages': ['Publisher-id not found.']}));
    }
    if (!('name' in event.body)) {
        throw new Error(JSON.stringify({'status': 400, 'messages': ['Name not found.']}));
    }
    console.log("MIRAR", event.body['name'].length);
    if (event.body['name'].length < 1) {
        throw new Error(JSON.stringify({'status': 400, 'messages': ['Name is invalid.']}));
    }
    if (!('id' in event)) {
        throw new Error(JSON.stringify({'status': 400, 'messages': ['Publisher-id not found.']}));
    }
    var q = `INSERT INTO publishers_campaigns(name, commission, publisher_id) VALUES('${event.body['name']}', 0.5, ${event.id})`;
    console.log("query: " + q);
    var result;
    try {
        //[result] = await connection.query('INSERT INTO publishers_campaigns SET name = ?, commission = ?, publisher_id = ?', [event.body['name'], 0.5, event['id']]);
        [result] = await connection.query(`INSERT INTO publisher_campaigns(name, commission, publisher_id) VALUES('${event.body['name']}', 0.5, ${event.id})`);
        console.log(result);
        return {'status': 200, 'response': {'id': result.insertId}};
    } catch(err) {
        console.log(err);
        throw new Error(JSON.stringify({'status': 500, 'messages': ['Database query error']}));
    }
}