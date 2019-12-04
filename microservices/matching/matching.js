const express = require('express');
const app = express();
const db = require("../db");

app.get('/matchingh', (req, res) => {
    res.status(200);
    res.send("OK");
});


app.get('/matching', async (req, res) => {
    var category = req.query.category;
        
    if(typeof category != 'undefined' && category ){

        try{
            let result = await db.db(category);
            if(result.length > 0){
                res.status(200);
                res.json(result);
            }else{
                res.status(200);
                res.json(result);
            }
        }catch(e){
            res.status(500);
            res.send("Error in query or connection")
        }
    }
})

var server = app.listen(3000, function(){});
