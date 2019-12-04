const express = require('express');
const app = express();
const db = require('./db');

app.get('/targetingh', function(req, res){
    res.status(200);
    res.send("OK");
});

app.get('/targeting', async function(req, res){
    var advertiser_campaigns = req.query.advertiser_campaigns;
    var zip_code = req.query.zip_code;
    var separados = advertiser_campaigns;

    if(typeof advertiser_campaigns != 'undefined' && advertiser_campaigns && typeof zip_code != 'undefined' && zip_code){
        
       try{
           let result = await db.getvalues(zip_code,separados);
           if(result.length > 0){
               var nuevo = [];
                for(var i = 0; i < result.length; i++){
                    nuevo.push(result[i]['id']);
                }
                res.status(200);
                res.json(nuevo);
            }else{
                res.status(200);
                res.json(result);
            }
       }catch(e){
           res.status(500);
           console.log(e);
           res.send(e);
       }
    }else{
        res.status(200);
        var resultado = {};
        res.json(resultado);
    }
})

var server = app.listen(3000, function(){});
    
    
    
    
        