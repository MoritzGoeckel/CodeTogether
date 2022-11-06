import os
from flask import Flask, request, jsonify
from execute import execute

PORT = os.getenv('PORT')

app = Flask(__name__)

@app.post("/")
def index():
    data = request.get_json()
    if 'lang' not in data:
        return {'error': "'lang' not in request"}

    if 'code' not in data:
        return {'error': "'code' not in request"}

    result = execute(data['code'], data['lang'])

    return jsonify(result)

if __name__=='__main__':
    from waitress import serve   
    print("Listening on port " + PORT)
    serve(app, host='0.0.0.0', port=PORT)
