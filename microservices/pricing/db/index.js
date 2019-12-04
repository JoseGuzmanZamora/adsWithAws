const mysql = require('mysql'); 

const connection = mysql.createPool({
});

let db = {};

db.getvalues = (publisher_campaign) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT commission FROM publisher_campaigns WHERE id = ? `, publisher_campaign, (err, results) => {
            if(err) return reject(err);
            return resolve(results);
        });
    });
};

module.exports = db;

