var AWS = require("aws-sdk")
var express = require('express');
const app = express();

app.use(express.json());

AWS.config.update({
    "region":"",
    "accessKeyId":"",
    "secretAccessKey":""
});

var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();

app.get('/clickh', function(req, res){
    res.status(200);
    res.send("OK");
});

app.post('/clicki', function(req, res){
    var contenido = req.body;

    var params = {
        TableName: "clicks",
        Item: contenido
    };

    docClient.put(params, function(err, data) {
       if (err) {
           console.log(contenido);
           console.error(err);
           res.status(500);
           res.send("Dynamodb connection error");
       } else {
           console.log("PutItem succeeded");
           res.status(200);
           res.send(contenido);
       }
    });

});
app.get('/click', function(req, res){
    var impression_id = req.query.impression_id;
    var query_id = req.query.query_id;

    if(typeof impression_id != 'undefined' && impression_id && typeof query_id != 'undefined' && query_id){
        var params = {
            TableName : 'clicks',
            Key: {
              'query-id': query_id
            }
        };
        docClient.get(params, function(err, data) {
            if (err) {
              console.log("Error", err);
              res.status(500);
              res.send("Dynamo error");
            } else {
              var siguiente = data.Item['ads'];
              var direccion = "";
              for(var i = 0; i < siguiente.length; i++){
                  if(siguiente[i]['impression_id'] == impression_id){
                      direccion = siguiente[i]['url'];
                      console.log("hola" , direccion);
                    }
                }
                if(direccion != ""){
                    res.status(302);
                    res.redirect(direccion);
                }else{
                    res.status(404);
                    res.send("Not found");
                }
              }
            });
      }
  });
  
  var server = app.listen(3000, function(){});
  
  