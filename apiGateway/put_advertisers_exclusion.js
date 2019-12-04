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
    if (!('advertiser_id' in event)) {
        throw new Error(JSON.stringify({'status': 400, 'messages': ['Advertiser-id not found.']}));
    }
    if (!('publishers' in event.body)) {
        throw new Error(JSON.stringify({'status': 400, 'messages': ['Publishers not found.']}));
    }
    
    if (event.body["publishers"].length < 1){
        throw new Error(JSON.stringify({'status': 400, 'messages': ['Publishers not found.']}));
    }
    
    
    var adID = parseInt(event.advertiser_id);
    var publisher = event.body["publishers"];
    var rows;
    var fields;
    var code;
    var result;
    var valor;
    try{
        await connection.query(`DELETE FROM publisher_exclusions WHERE advertiser_id = ${adID}`);
        for(var i = 0; i < publisher.length; i++){
            valor = parseInt(publisher[i])
            await connection.query(`INSERT INTO publisher_exclusions(advertiser_id, publisher_id) VALUES(${adID}, ${valor})`);
        }
        
        return {
            'status':204
        };
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
            connection.rollback();
            throw new Error(JSON.stringify(
            {
                'status':404,
                'messages':['Database query error']
            }
            ));
        }
    }
}