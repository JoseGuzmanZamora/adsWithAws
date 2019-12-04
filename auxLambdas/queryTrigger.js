console.log('Loading function');

const aws = require('aws-sdk');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });

//const pg = require('pg')
const { Client } = require('pg');



exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    console.log('Received event:', JSON.stringify(event, null, 2));
    
    
        const client = new Client({
            user: '',
            host: '',
            database: '',
            password: '',
            port: 5439,});
        client.connect();
    
    
        // Get the object from the event and show its content type
        const bucket = event.Records[0].s3.bucket.name;
        const file = event.Records[0].s3.object.key;
        
        const sql = 'copy query ' +
        'from \'s3://' + bucket + '/' + file + '\' ' +
        'iam_role \'arn\' ' +
        'json \'auto\'';
        
        console.log(sql);
    
        client.query(sql, (error, results) => {
            console.log("Entro!!!!!!!!1");
            if (error) {
                console.log("Error!!!!!!!!!!!! " + error);
                callback(JSON.stringify(error));
                return;
            }
            console.log("Results!!!!!!" + results)
            callback(null, results);
        });
     

};
