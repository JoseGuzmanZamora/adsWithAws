console.log('Loading function');

const aws = require('aws-sdk');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });
var kinesis = new aws.Kinesis({region:''});

//const pg = require('pg')
const { Client } = require('pg');

exports.handler = async (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const bucket = event.Records[0].s3.bucket.name;
    const file = event.Records[0].s3.object.key;
    
    var kinesis_put = function(data){
        return new Promise((resolve, reject)=>{
            var params = {
                Data: data,
                PartitionKey: '1',
                StreamName: ''
                
            };
            kinesis.putRecord(params, function(err, data) {
                if (err){
                    return reject(err);
                }else{
                    return resolve(data);
                }
            });
        });
    }
    
    var redshift_put = function(){
        return new Promise((resolve, reject)=>{
            const client = new Client({
                user: '',
                host: 'redshift.amazonaws.com',
                database: '',
                password: '',
                port: 5439
            });
            
            client.connect();
            
            //Query para copiar el archivo de S3 a redshift
            const sql = 'copy click ' +
            'from \'s3://' + bucket + '/' + file + '\' ' +
            'iam_role \'\' ' +
            'json \'auto\'';
            
            //Ejecucion del query
            client.query(sql, (error, results) => {
                if (error) {
                    return reject(error);
                }else{
                    return resolve(results);
                }
            });
            
        });
    }
    
    var s3_get = function(parametros){
        return new Promise((resolve, reject)=>{
            s3.getObject(getParams, async function(err, data) {
                if (err){
                    return reject(err);
                }else{
                     return resolve(data.Body.toString('utf-8'));
                }
            });
        });
    }
    
    var getParams = { 
            Bucket: bucket,
            Key: file,
    };
    
    var resultado1 = await redshift_put();
    var resultado2 = await s3_get(getParams);
    console.log(resultado2);
    var resultado3 = await kinesis_put(JSON.stringify(resultado2));
    callback(null, resultado3);
};
