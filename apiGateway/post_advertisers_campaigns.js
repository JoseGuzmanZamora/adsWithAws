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

    if(!('name' in event.body)){
        throw new Error(JSON.stringify(
            {
                'status':400,
                'messages':['Name not found']
            }
        ));
    }
    
    if(!('category' in event.body)){
        throw new Error(JSON.stringify(
            {
                'status':400, 
                'messages':['Category not found']
            }
            ));
    }

    if(event.body['name'].length < 1){
        throw new Error(JSON.stringify(
            {
                'status':400, 
                'messages':['Name is invalid']
            }
        ));
    }
    
    if (typeof event.body['category'] != 'number'){
        throw new Error(JSON.stringify(
            {
                'status':400,
                'messages':['Category is invalid']
            }
            ));
    }

    var result;
    var id = event.id;
    var nombre = '"' + event.body['name'] + '"';
    var category = event.body['category'];

    try{
        [result] = await connection.query(`INSERT INTO advertiser_campaigns(advertiser_id, category, name, status, bid, budget) VALUES(${id}, ${category}, ${nombre}, False, 0, 0)`);
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