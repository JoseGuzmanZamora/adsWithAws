const mysql = require('mysql'); 

const connection = mysql.createPool({
});

let db = {};

db.getvalues = (category) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT id, bid FROM advertiser_campaigns WHERE status = true AND category = ?`, category, (err, results) => {
            if(err) return reject(err);
            return resolve(results);
        });
    });
};

module.exports = db;

