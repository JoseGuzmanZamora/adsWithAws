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
    
    if (!('headline' in event.body)) {
        throw new Error(JSON.stringify({'status': 400, 'messages': ['Name not found.']}));
    }
    if (event.body['headline'].length < 1) {
        throw new Error(JSON.stringify({'status': 400, 'messages': ['Name is invalid.']}));
    }
    if (!('description' in event.body)) {
        throw new Error(JSON.stringify({'status': 400, 'messages': ['Name not found.']}));
    }
    if (event.body['description'].length < 1) {
        throw new Error(JSON.stringify({'status': 400, 'messages': ['Name is invalid.']}));
    }
    if (!('url' in event.body)) {
        throw new Error(JSON.stringify({'status': 400, 'messages': ['Name not found.']}));
    }
    if (event.body['url'].length < 1) {
        throw new Error(JSON.stringify({'status': 400, 'messages': ['Name is invalid.']}));
    }
    

    var result;
    var id = event.id;
    var headline = event.body['headline'];
    var description = event.body['description'];
    var url = event.body['url'];

    try{
        [result] = await connection.query(`INSERT INTO ads (advertiser_id, headline, description, url) VALUES ( ${id}, "${headline}", "${description}", "${url}")`);
        console.log(result);
        return {
            'status':200,
            'response':{'id':result.insertId}
        };
    }catch(err){
        console.log(err);
        throw new Error(JSON.stringify(
            {
                'status':500,
                'messages':['Database query error']
            }
        ));
    }
}