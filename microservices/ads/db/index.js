const mysql = require('mysql'); 

const connection = mysql.createPool({

});

let db = {};

db.getvalues = (advertiserCampaigns) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT DISTINCT campaign_id, id, headline, description, url
        FROM ads JOIN campaign_ads ON ads.id = campaign_ads.ad_id
        WHERE campaign_ads.campaign_id IN (?)`,advertiserCampaigns, (err, results) => {
        if(err) return reject(err);
        return resolve(results);
        });
    });
};

module.exports = db;