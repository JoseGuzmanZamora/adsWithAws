console.log('starting function');

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region:'us-east-2'});
const mysql = require('mysql');
var pool = mysql.createPool({
});

var connection;
exports.handler = function(event, context, callback){
    context.callbackWaitsForEmptyEventLoop = false;
    
    var search = function(results, contador){
        return new Promise((resolve, reject)=>{
                let params = {
                    TableName:'budgets',
                    Key:{
                        'advertiser_campaign_id':JSON.stringify(results[contador]['id'])
                    }
                };
                docClient.get(params, function(err, data){
                    if(err){
                        return reject(err);
                    }else{
                        return resolve(data);
                    }
                });
        })
    }
    
    var insert = function(item){
        return new Promise((resolve, reject)=>{
            let params = {
                TableName:'budgets',
                Item:item
            }
            docClient.put(params, function(err, data) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(data);
                }
            });
        });
    }
    
    var update = function(id, cambio){
        return new Promise((resolve, reject)=>{
            var params = {
                TableName:'budgets',
                Key:{
                    "advertiser_campaign_id":id
                },
                UpdateExpression: "set budget = :b",
                ExpressionAttributeValues:{
                    ":b":cambio,
                },
                ReturnValues:"UPDATED_NEW"
            };
            
            docClient.update(params, function(err, data) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(data);
                }
            });
        });
    }
    
    pool.getConnection(function(err, connection){
        if(err){
            callback(err);
        }
        connection.query('SELECT * FROM advertiser_campaigns', async function(error, results, fields){
            
            connection.release();
            
            if(error) callback(error);
            
            if(results.length > 0){
                var promises = [];
                for(var i = 0; i < results.length; i++){
                    var data = search(results, i);
                    promises.push(data);
                }
                
                var todos = await Promise.all(promises);
                for(var j = 0; j < todos.length; j++){
                    let parametros = {
                        'advertiser_campaign_id':JSON.stringify(results[j]['id']),
                        'budget':results[j]['budget'],
                        'balance':0
                    }
                    if(todos[j]["Item"] != null){
                        var resultado_update = await update(JSON.stringify(results[j]['id']), results[j]['budget']);
                    }else{
                        console.log(parametros);
                        var resultado_put = await insert(parametros);
                    }
                }
                callback(null, todos);
            }else{
                callback(null);
            }
        });
    });
}