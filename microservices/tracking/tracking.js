var express = require('express');
const uniqueid = require('uuid/v4');
const app = express();

app.use(express.json());

app.get('/trackingh', function(req, res){
    res.status(200);
    res.send("OK");
});

app.post('/tracking', function(req, res){
    var contenido = req.body;
    var timestamp_usar = Date.now();
    var importante = contenido[0][1];

    var respuesta_query = {
        'query-id':importante['query-id'],
        'timestamp':timestamp_usar.toString(),
        'publisher_campaign_id':contenido[1],
        'category':contenido[2],
        'zip-code':contenido[3],
        'publisher_id':contenido[4][1]
    }
    console.log(respuesta_query);
    
    var respuesta_impression = []
    for(var i = 0; i < importante['ads'].length; i++){
        //encontrar el precio
        var ad_temporal = importante['ads'][i];
        var respuesta_temporal = {
            'query-id':importante['query-id'],
            'impression-id':ad_temporal['impression_id'],
            'timestamp':timestamp_usar.toString(),
            'publisher_id':contenido[4][1],
            'publisher_campaign_id':contenido[1],
            'advertiser_id':ad_temporal['advertiser_id'],
            'advertiser_campaign_id':ad_temporal['advertiser_campaign_id'],
            'category':contenido[2],
            'ad_id':ad_temporal['ad_id'],
            'zip_code':contenido[3],
            'advertiser_price':ad_temporal['advertisers_price'],
            'publisher_price':ad_temporal['publishers_price'],
            'position':ad_temporal['position']
        }
        respuesta_impression.push(respuesta_temporal);
    }

    console.log(respuesta_impression);
    res.status(200);
    res.send("OK");
});

app.post('/tracking2', function(req, res){
    console.log("ENTRE");
    var contenido = req.body;
    var importante = contenido[0];
    var timestamp_dif = Date.now();

    var respuesta = {
        'query-id':contenido[1],
        'impression_id':importante['impression_id'],
        'click_id':uniqueid(),
        'timestamp':timestamp_dif,
        'publisher_id':importante['publisher_id'],
        'publisher_campaign_id':importante['publisher_campaign_id'],
        'advertiser_id':importante['advertiser_id'],
        'advertiser_campaign_id':importante['advertiser_campaign_id'],
        'category':importante['category'],
        'ad_id':importante['ad_id'],
        'zip_code':importante['zip_code'],
        'advertiser_price':importante['advertisers_price'],
        'publisher_price':importante['publishers_price'],
        'position':importante['position']
    }

    console.log(respuesta);
    res.status(200);
    res.send("OK");
});

  
var server = app.listen(3000, function(){});
  
  