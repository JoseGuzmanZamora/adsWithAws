const mysql = require('mysql'); 

const connection = mysql.createPool({
});

let db = {};

db.getvalues = (zip_code, separados) => {
    return new Promise((resolve, reject) => {
        connection.query( `SELECT c.id
            FROM advertiser_campaigns c
            JOIN campaign_targeting t ON c.id = t.campaign_id
            WHERE t.zip_code = ?
            UNION
            SELECT c.id
            FROM advertiser_campaigns c
            WHERE c.id IN (?)
            AND NOT EXISTS (
            SELECT t.campaign_id
            FROM campaign_targeting t
            WHERE t.campaign_id = c.id)`,[zip_code,separados], (err, results) => {
        if(err) return reject(err);
        return resolve(results);
        });
    });
};

module.exports = db;

