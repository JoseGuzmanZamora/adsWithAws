var mysql = require('mysql2/promise');

var connection;

exports.handler = async (event) => {
    console.log(event);
    if (typeof connection === 'undefined') {
        try {
            connection = await mysql.createConnection({
                host: '',
                user: '',
                password: '',
                database: ''
                });
        }
        catch(err) {
            console.log(err);
            throw new Error(JSON.stringify({"status": 500, "messages": ['Database connection error']}));
        }
    }
    
    var rows;
    var fields;
    var code;
    var result;
    try{
        [result] = await connection.query(`DELETE FROM advertisers`);
        console.log("resultado:"+result);
        if((result.info).toString().includes('Rows matched: 0')){
            code = 404;
            throw new Error('Not Found');
        }else{
            return {
            'status':204
            };
        }
    }catch(err){
        console.log(err);
        if (code == 404){
            throw new Error(JSON.stringify(
            {
                'status':404,
                'messages':['Advertisers not found']
            }
            ));
        }else{
            throw new Error(JSON.stringify(
            {
                'status':500,
                'messages':['Database query error']
            }
            ));
        }
    }

}   