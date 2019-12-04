const express = require('express');
const app = express();
const db = require('./db');

app.get("/exlusionh", function(req,res){
    res.status(200);
    res.send("ok");
});

app.get('/exclusion', async function(req, res){
    var publisherCampaign = req.query.publisher_campaign;
    var advertiserCampaigns = req.query.advertiser_campaigns.split(",");
    var excludedRes = [];
        
    if(typeof publisherCampaign != 'undefined' && publisherCampaign && typeof advertiserCampaigns != 'undefined' && advertiserCampaign){
        try{
            let result = await db.getvalues(publisherCampaign);
            if(result.length > 0){
                var todos = []
                for(var i = 0 ; i < result.length; i++){
                    todos.push(result[i]['id']);
                }
                var nuevo = [];
                for(var i = 0; i < advertiserCampaigns.length; i++){
                    nuevo.push(parseInt(advertiserCampaigns[i]));
                }
                var nuevo2 = nuevo.filter(x => !todos.includes(x));
                res.status(200);
                res.json(nuevo2);
            }else{
                    res.status(200);
                    res.send(excludedRes);
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
