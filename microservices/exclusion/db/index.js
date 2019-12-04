const mysql = require('mysql'); 

const connection = mysql.createPool({
});

let db = {};

db.getvalues = (publishercampaign) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT advertiser_campaigns.id
            FROM publisher_campaigns JOIN publishers ON publisher_campaigns.publisher_id = publishers.id
            JOIN publisher_exclusions ON publisher_exclusions.publisher_id = publishers.id
            JOIN advertisers ON publisher_exclusions.advertiser_id = advertisers.id
            JOIN advertiser_campaigns ON advertisers.id = advertiser_campaigns.advertiser_id
            WHERE publisher_campaigns.id = ? `,publishercampaign, (err, results) => {
        if(err) return reject(err);
        return resolve(results);
        });
    });
};

module.exports = db;

