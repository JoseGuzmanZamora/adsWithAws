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
                    "status":400,
                    "messages":['Database connection error']
                }
                ));
        }
    }


    
    if (!('ads' in event.body)) {
        throw new Error(JSON.stringify({'status': 400, 'messages': ['ads not found.']}));
    }
    if (event.body['ads'].length < 1) {
        throw new Error(JSON.stringify({'status': 400, 'messages': ['ads is invalid.']}));
    }
    
    var code;
    var result;
    var valor;
    var campaign_id = event.campaign_id;
    var ads_id = event.body['ads'];
    
 
    try{
        [result] = await connection.query(`DELETE FROM campaign_ads WHERE campaign_id = ${campaign_id}`);
        for(var i = 0;  i < ads_id.length; i++ ){
            
            valor = ads_id[i];
            await connection.query(`INSERT INTO campaign_ads(campaign_id, ad_id) VALUES(${campaign_id}, ${valor})`);

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
                'status':400,
                'messages':['Database query error']
            }
            ));
        }
    }
}