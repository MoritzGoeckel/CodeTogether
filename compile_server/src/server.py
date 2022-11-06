from flask import Flask, request, jsonify
import os

COMPILE_DIR = os.getenv('COMPILE_DIR')

app = Flask(__name__)

countries = [
    {"id": 1, "name": "Thailand", "capital": "Bangkok", "area": 513120},
    {"id": 2, "name": "Australia", "capital": "Canberra", "area": 7617930},
    {"id": 3, "name": "Egypt", "capital": "Cairo", "area": 1010408},
]

@app.post("/")
def index():
    return jsonify({'countires': countries, 'data': request.get_json()})

if __name__=='__main__':
    filename = COMPILE_DIR + "/test.js"
    f = open(filename, "w")
    f.write("console.log('hello world')")
    f.close()

    print(filename)

    stream = os.popen('sudo -u run_user node ' + filename)
    output = stream.read()

    print(output)

    from waitress import serve   
    serve(app, host='0.0.0.0', port=3457)
