const express = require('express');
const app = express();
const https = require('https');
const request = require('request');
const uniqueid = require('uuid/v4');

var resultado_final;
var resultado_mostrar;

var query_id = 0;
const url_usar = 'urlloadbalancerprivado...';


var matching_function = (category) => {
    return new Promise((resolve, reject) => {
        request(`http://` + url_usar + `/matching?category=${category};`, {json:true}, (err, resp, body) => {
            if(err){
                console.log(err);
                return reject(err);
            }
            return resolve(body);
        });
    });
}

var pricing_function = (ides, pub) => {
    return new Promise((resolve, reject) => {
        var idees = []
        var bids = []
        for(var i = 0; i < ides.length; i++){
            idees.push(ides[i]['id']);
            bids.push(ides[i]['bid']);
        }
        var idees_send = idees.toString();
        var bids_send = bids.toString();

        request(`http://` + url_usar + `/pricing?advertiser_campaigns=${idees_send}&advertiser_campaign_bids=${bids_send}&publisher_campaign=${pub}`, {json:true}, (err, resp, body) => {
            if(err){
                console.log(err);
                return reject(err);
            }
            return resolve(body);
        });
    });
}

var ranking_function = (ides) => {
    return new Promise((resolve, reject) => {
        var idees = []
        var bids = []
        for(var i = 0; i < ides.length; i++){
            idees.push(ides[i]['id']);
            bids.push(ides[i]['bid']);
        }
        var idees_send = idees.toString();
        var bids_send = bids.toString();

        request(`http://` + url_usar + `/ranking?advertiser_campaigns=${idees_send}&advertiser_campaign_bids=${bids_send}`, {json:true}, (err, resp, body) => {
            if(err){
                console.log(err);
                return reject(err);
            }
            return resolve(body);
        });

    })
}

var targeting_function = (ides, zip_code) => {
    var idees = []
    for(var i = 0; i < ides.length; i++){
        idees.push(ides[i]['id'])
    }
    var idees_send = idees.toString();
    return new Promise((resolve, reject) => {
        request(`http://` + url_usar + `/targeting?advertiser_campaigns=${idees_send}&zip_code=${zip_code}`, { json: true}, (err, resp, body) => {
            if(err){
                console.log(err);
                return reject(err);
            }
            return resolve(body);
        });
    });
}


var exclusion_function = (ides, menos) => {
    return new Promise((resolve, reject) => {
        var idees = ides.toString();
        request(`http://` + url_usar + `/exclusion?advertiser_campaigns=${idees}&publisher_campaign=${menos}`, { json: true}, (err, resp, body) => {
            if(err){
                return reject(err);
            }
            return resolve(body);
        });
    });
}

var ads_function = (ides, categori, zip, pricing, publisherc, match) => {
    var idees = ides.toString();
    return new Promise((resolve, reject) => {
        request(`http://` + url_usar + `/ads?advertiser_campaigns=${idees}`, {json:true}, (err, resp, body) => {
            if(err){
                return reject(err);
            }

            var paraclick = []
            var paraver = []
            var query_id = uniqueid();
            if(body.length > 0){
                for(var i = body.length - 1 ; i >= 0; i--){
                    var precio_ad = 0; 
                    var precio_pub = 0;
                    for(var j = 0; j < match.length ; j++){
                        if(match[j]['id'] == body[i]['campaign_id']){
                            precio_ad = match[j]['bid'] + pricing[0][j]['price'];
                            precio_pub = pricing[0][j]['price'];
                        }
                    }

                    var impression_id = uniqueid();
                    var url_modificado = `publiclb.amazonaws.com/click?query_id=${query_id}&impression_id=${impression_id}`;
                    var insertarver = {
                        'impression_id':impression_id,
                        'headline':body[i]['headline'],
                        'description':body[i]['description'],
                        'url':url_modificado
                    }
                    var insertarclick = {
                        'impression_id':impression_id,
                        'headline':body[i]['headline'],
                        'description':body[i]['description'],
                        'url':body[i]['url'],
                        'advertiser_campaign_id':body[i]['campaign_id'],
                        'ad_id':body[i]['ad_id'],
                        'advertiser_id':body[i]['advertiser_id'],
                        'publisher_id':pricing[1],
                        'publisher_campaign_id':publisherc,
                        'category':categori,
                        'zip_code':zip, 
                        'position':i,
                        'advertisers_price':precio_ad,
                        'publishers_price':precio_pub
                    }
                    paraclick.push(insertarclick);
                    paraver.push(insertarver);
                }
                var mostrar = {
                    'query-id':query_id,
                    'ads':paraver
                }
                var click_send = {
                    'query-id':query_id,
                    'ads':paraclick
                }
                return resolve([mostrar, click_send]);
            }else{
                return resolve({});
            }
        });
    });
}

var click_function = (insertar) => {
    return new Promise((resolve, reject) => {
        console.log(JSON.stringify(insertar));
        try{
            if(JSON.stringify(insertar).length > 0){
                console.log("ENTRO");
                var valor = JSON.stringify(insertar);
                request({
                    url: "publiclb.amazonaws.com/clicki",
                    method: "POST",
                    json: true,
                    body: insertar,
                }, function (error, response, body){
                    if(error){
                        return reject(error);
                    }
                    console.log(body);
                    return resolve("yes");
                });
            }else{
                return resolve("yes");
            }
        }catch(error){
            return reject(error);
        }
    });
}

var tracking_function = (ads, pub, cat, zip, pub_id) => {
    return new Promise((resolve, reject) => {
        var insertar = []
        insertar.push(ads);
        insertar.push(pub);
        insertar.push(cat);
        insertar.push(zip);
        insertar.push(pub_id);
        try{
            request({
                url: "/tracking",
                method: "POST",
                json: true,
                body: insertar,
            }, function (error, response, body){
                if(error){
                    return reject(error);
                }
                console.log(body);
                return resolve("yes");
            });
        }catch(e){
            return reject(e);
        }
    });
}

app.get('/queryh', function(req, res){
    res.status(200);
    res.send("OK");
});

app.get('/query', async function(req, res){
    var category = req.query.category;
    var publisher_campaign = req.query.publisher_campaign;
    var maximum = req.query.maximum;
    var zipCode = req.query.zip_code;

    var resultado_matching = await matching_function(category);
    console.log(resultado_matching);
    if(resultado_matching.length > 0){
        var resultado_ranking = await ranking_function(resultado_matching);
        var resultado_pricing = await pricing_function(resultado_matching, publisher_campaign);
        console.log(resultado_ranking);
        console.log(resultado_pricing);
        var resultado_targeting = await targeting_function(resultado_ranking, zipCode);
        console.log(resultado_targeting);
        if(resultado_targeting.length > 0){
            var resultado_exclusion = await exclusion_function(resultado_targeting, publisher_campaign);
            console.log(resultado_exclusion)
            if(resultado_exclusion.length > 0){
                var resultado_ads = await ads_function(resultado_exclusion, category, zipCode, resultado_pricing, publisher_campaign, resultado_matching);
                console.log(resultado_ads);
                if(resultado_ads.length > 0){
                    console.log(resultado_ads[1]);
                    var resultado_click = await click_function(resultado_ads[1]);
                    var resultado_tracking = await tracking_function(resultado_ads, publisher_campaign, category, zipCode, resultado_pricing);
                    if(resultado_click == "yes"){
                        res.status(200);
                        res.json(resultado_ads[0]);
                    }else{
                        res.status(500);
                        res.send("Verificar dynamo");
                    }
                }else{
                    res.status(200);
                    res.send({});
                }
            }else{
                res.status(200);
                res.send({});
            }
        }else{
            res.status(200);
            res.send({});
        }
    }else{
        res.status(200);
        res.send({});
    }
});

var server = app.listen(3000, function(){});
