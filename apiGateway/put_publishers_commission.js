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
        throw new Error(JSON.stringify({'status': 400, 'messages': ['Publisher-id not found.']}));
    }
    if (!('campaign-id' in event)) {
        throw new Error(JSON.stringify({'status': 400, 'messages': ['Campaign-id not found.']}));
    }
    if (!('commission' in event.body)) {
        throw new Error(JSON.stringify({'status': 400, 'messages': ['Commission invalida.']}));
    }
    var code;
    var pubID = event['publisher-id'];
    var campID = event['campaign-id'];
    var commission = event.body['commission'];
    var rows;
    var fields;
    
    if(typeof(commission) != 'number'){
        throw new Error(JSON.stringify(
            {
                'status':400,
                'messages':['Commission Invalid']
            }
            ));
    }
    
    var result;
    try{
        [result] = await connection.query(`UPDATE publisher_campaigns SET commission=${commission} WHERE id=${campID} and publisher_id=${pubID}`);
        console.log(result);
        if((result.info).toString().includes('Rows matched: 0')){
            code = 404;
            throw new Error('Not Found');
        }else{
            return {
            'status':204
            };
        }
    }catch(err){
        console.log(err);
        if (code == 404){
            throw new Error(JSON.stringify(
            {
                'status':404,
                'messages':['Advertisers not found']
            }
            ));
        }else{
            throw new Error(JSON.stringify(
            {
                'status':500,
                'messages':['Database query error']
            }
            ));
        }
    }
}