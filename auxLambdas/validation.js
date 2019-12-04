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
    
    
    event.Records.forEach( async ( record) => {
    
        //console.log('DynamoBD Stream record: ', JSON.stringify(record, null, 2));
        
        if (record.eventName == 'INSERT') {
           console.log('');
        } else if ( record.eventName === 'MODIFY') {

            var rows, fields, id, status, balance, budget;
            
            console.log("advertiser_campaign_id:"+JSON.stringify(record.dynamodb.Keys.advertiser_campaign_id.S));
            console.log("New Image:"+JSON.stringify(record.dynamodb.NewImage));
            console.log("Old Image:"+JSON.stringify(record.dynamodb.OldImage));
            // ---------
            
            try{
                [rows, fields] = await connection.query('SELECT status FROM advertiser_campaigns where id = '+record.dynamodb.Keys.advertiser_campaign_id.S);
                status = rows[0].status;
                console.log("Current Status: "+status);
                balance = parseInt(record.dynamodb.NewImage.balance.N);
                budget = parseInt(record.dynamodb.NewImage.budget.N);
                console.log("Balance"+balance+"Budget"+budget);
                if (status === 1){

                    if (balance < budget ){
                        // update without status change
                        console.log("Balance es menor a Budget UPDATE");

                    } else {
                        // update with status change 0
                        console.log("Balance MAYOR o IGUAL a Budget");
                        // -----
                        try{
                        [rows, fields] = await connection.query('UPDATE advertiser_campaigns set status = 0 where id ='+record.dynamodb.Keys.advertiser_campaign_id.S);
                            }catch(err){
                                console.log(err);
                                throw new Error(JSON.stringify(
                                    {
                                        "status":500,
                                        "messages":['Database query error']
                                    }
                                    ));
                            }
                        // -----
                    }
                } else {
                    // no hace nada status = 0
                }
                
            }catch(err){
                console.log(err);
                throw new Error(JSON.stringify(
                    {
                        "status":500,
                        "messages":['Database query error']
                    }
                    ));
            }
            // ---------
            
        }
    
        
    });
    
    
    
}