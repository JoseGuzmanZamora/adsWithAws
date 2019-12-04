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

    if(!('zip-codes' in event.body)){
        throw new Error(JSON.stringify(
            {
                'status':400,
                'messages':['Zip codes not found']
            }
        ));
    }
    

    if(event.body['zip-codes'].length < 1){
        throw new Error(JSON.stringify(
            {
                'status':400, 
                'messages':['Zip codes are invalid']
            }
        ));
    }
    
    var code;
    var valor;
    var result;
    var id_cam = event.id_cam;
    var zip_codes = event.body['zip-codes'];
    
    if(typeof(zip_codes[0]) == 'number'){
       throw new Error(JSON.stringify(
            {
                'status':400,
                'messages':['Invalid']
            }
            )); 
    }
    
    try{
        [result] = await connection.query(`DELETE FROM campaign_targeting WHERE campaign_id = ${id_cam}`);
        for(var i = 0; i < zip_codes.length; i++){
            valor = zip_codes[i];
            await connection.query(`INSERT INTO campaign_targeting(campaign_id, zip_code) VALUES(${id_cam}, ${valor})`);
        }
        console.log(result);
        
        return {
            'status':204
        };
    }catch(err){
        console.log(err);
        if (code == 404){
            throw new Error(JSON.stringify(
            {
                'status':404,
                'messages':['Campaign not found']
            }
            ));
        }else{
            throw new Error(JSON.stringify(
            {
                'status':404,
                'messages':['Database query error']
            }
            ));
        }
    }
}