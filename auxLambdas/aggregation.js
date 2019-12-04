const AWS = require('aws-sdk');
const client = new AWS.DynamoDB.DocumentClient({region: ''});
const kinesis = new AWS.Kinesis({
        region:''
    });



exports.handler = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    
    var insert = function(id, cambio){
        return new Promise((resolve, reject)=>{
            var params = {
                TableName:'budgets',
                Key:{
                    "advertiser_campaign_id":id
                },
                UpdateExpression: "ADD balance :balancen",
                ExpressionAttributeValues:{
                    ":balancen":cambio
                },
                ReturnValues:"UPDATED_NEW"
            };
            client.update(params, function(err, data) {
                if (err) {
                    return reject(err);
                } else {
                    
                    return resolve(data);
                }
            });
        });
    }
   
    var ShardIterator = function(params) { 
        return new Promise((resolve,reject)=>{
        
            kinesis.getShardIterator(params, function(err, data2) {
              if (err){
               console.log(err, err.stack);  
              } else {
                var params = {
                      ShardIterator: data2.ShardIterator,
                };
                kinesis.getRecords(params, async function(err, data3) {
                    if (err) {
                        return reject(err);
                    }else{
                        
                        var quote, kinesisStr1, kinesisStr2, kinesisStr3, 
                        kinesisStr4, kinesisStr5, resultado_kinesis, bracket1, bracket2;
                        quote = "'";
                        bracket1 = '{"object" : [';
                        bracket2 = "]}";
                        kinesisStr1 = data3.Records[data3.Records.length - 1].Data.toString();
                        kinesisStr2 = kinesisStr1.substring(1,kinesisStr1.length-1);
                        //kinesisStr3 = kinesisStr2.concat(quote);
                        //kinesisStr4 = quote.concat(kinesisStr3);
                        kinesisStr3 = kinesisStr2.replace(/\\/g, "");
                        kinesisStr4 = kinesisStr3.replace(/}/g,"},");
                        kinesisStr4 = kinesisStr4.substring(0, kinesisStr4.length-1);
                        kinesisStr5 = bracket1.concat(kinesisStr4);
                        kinesisStr5 = kinesisStr5.concat(bracket2)
                        
                        console.log(kinesisStr5);
                        console.log(typeof kinesisStr5);
                        
                       
                        resultado_kinesis = kinesisStr5;

                        if(typeof resultado_kinesis == "string"){
                            try{
                                resultado_kinesis = JSON.parse(resultado_kinesis);
                                console.log(resultado_kinesis);
                                console.log(resultado_kinesis['object'].length);
                                var resultado_final = [];
                            for (var obj = 0; obj < resultado_kinesis['object'].length; obj++) {
                                console.log(resultado_kinesis['object'][obj]);
                                resultado_final.push(insert(JSON.stringify(resultado_kinesis['object'][obj]['advertiser_campaign_id']), resultado_kinesis['object'][obj]['advertiser_price']));
                                
                            }
                            
                            console.log(resultado_final);
                            var resf = await Promise.all(resultado_final);
                            console.log(resf);
                            return resolve(resf);
                            
                                
                            }catch(e){
                                return reject(e);
                            }
                        }
                        
                    }
                });
              }   
            });            
        });
    }
    
     var params = {
         ShardId: '',
         ShardIteratorType: 'TRIM_HORIZON',
         StreamName: ''
    };
    var resultado2 = await ShardIterator(params);
    callback(null, resultado2);
};
