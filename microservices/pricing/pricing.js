const express = require('express');
const app = express();
const db = require('./db');

app.get('/pricingh', function(req, res){
    res.status(200);
    res.send("OK");
});

app.get('/pricing', function(req, res){
    var advertiser_campaigns = req.query.advertiser_campaigns;
    var advertiser_campaigns_bids = req.query.advertiser_campaign_bids
    var publisher_campaign = req.query.publisher_campaign
    
    if(typeof advertiser_campaigns != 'undefined' && advertiser_campaigns && typeof advertiser_campaigns_bids != 'undefined'  && advertiser_campaigns_bids && typeof publisher_campaign != 'undefined' && publisher_campaign){
        advertiser_c = advertiser_campaigns.split(',');
        advertiser_cb = advertiser_campaigns_bids.split(',');
        
        try{
            let result = db.getvalues(publisher_campaign);
            if(result.length > 0){
                var nuevo = [];
                var valor_temp = 0;
                for(var i = 0; i < advertiser_c.length; i++){
                    valor_temp = result[0]['commission'] * advertiser_cb[i];
                    nuevo.push({'id': parseInt(advertiser_c[i]), 'price':valor_temp});
                }
                if(nuevo.length > 0){
                    res.status(200);
                    res.json(nuevo);
                }else{
                    res.status(200);
                    res.json(nuevo);
                }
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
        res.status(500);
        res.send("BAD REQUEST");
    }
})
var server = app.listen(3000, function(){});

 