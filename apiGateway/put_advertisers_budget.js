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

    if(!('budget' in event.body)){
        throw new Error(JSON.stringify(
            {
                'status':400,
                'messages':['Budget not found']
            }
        ));
    }
    

    if(event.body['budget'].toString().length < 1){
        throw new Error(JSON.stringify(
            {
                'status':400, 
                'messages':['budget is invalid']
            }
        ));
    }

    if(typeof event.body['budget'] != 'number'){
        throw new Error(JSON.stringify(
            {
                'status':400, 
                'messages':['budget is invalid']
            }
        ));
    }
    
    var code;
    var result;
    var id_ad = event.id_ad;
    var id_cam = event.id_cam;
    var bud = event.body['budget'];
    
 
    try{
        [result] = await connection.query(`UPDATE advertiser_campaigns SET budget = ${bud} WHERE id = ${id_cam} AND advertiser_id = ${id_ad}`);
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
                'messages':['Campign not found']
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