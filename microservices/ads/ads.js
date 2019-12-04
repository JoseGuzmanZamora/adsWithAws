const express = require('express');
const app = express();
const db = require('./db')


app.get('/adsh', function(req, res){
    res.status(200);
    res.send("OK");
});

app.get('/ads', async function(req, res){
    var advertiserCampaigns = req.query.advertiser_campaigns;
    if(typeof advertiserCampaigns != 'undefined' && advertiserCampaigns ){
        try{
            let result = await db.getvalues(advertiserCampaigns);
            if(result.length > 0){
                var nuevo = [];
                var siguiente = [];
                for(var i = 0; i < result.length; i++){
                    if(!nuevo.includes(result[i]['campaign_id'])){
                        nuevo.push(result[i]['campaign_id']);
                        siguiente.push({'campaign_id': result[i]['campaign_id'], 'ad_id':result[i]['id'], 'headline':result[i]['headline'],'description':result[i]['description'], 'url':result[i]['url']});
                    }
                }
                if(siguiente.length > 0){
                    res.status(200);
                    res.json(siguiente);
                }else{
                    res.status(200);
                    res.json(siguiente);
                }
            }else{
                res.status(200);
                var resultado = {};
                res.json(resultado);
            }
        }catch(e){
            res.status(500);
            console.log(e);
            res.send(e);
        }
    }else{
        res.status(500);
        res.send("BAD REQUEST");
    }
});

var server = app.listen(3000, function(){});