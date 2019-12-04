import boto3
import uuid
import json
import datetime
from ast import literal_eval
from flask import Flask
from flask import request, redirect
from decimal import *

app = Flask(__name__)
dynamodb = boto3.resource('dynamodb', region_name=, aws_access_key_id=, aws_secret_access_key=)
table = dynamodb.Table('clicks')

@app.route('/clickh')
def clicks_health():
    return "OK", 200

@app.route('/click')
def clicks_func():
    impression_id = request.args.get('impression_id')
    query_id = request.args.get('query_id')

    if impression_id != None and query_id != None:
        response = table.get_item(Key={'query-id':query_id})
        print(response)
        siguiente = response['Item']['ads']
        direccion = ""
        for i in range(len(siguiente)):
            if siguiente[i]['impression_id'] == impression_id:
                direccion = siguiente[i]['url']
        return redirect(str(direccion), code=302)
    else:
        return "bad", 500

@app.route('/clicki', methods=['POST'])
def click_insert():
    contenido = literal_eval(request.json)
    print(type(contenido))
    table.put_item(
        Item=contenido
    )
    return "OK", 200

app.run(host='0.0.0.0', port=3000)


