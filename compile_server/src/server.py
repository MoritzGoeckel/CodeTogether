from flask import Flask, request, jsonify
import os
import sys
import shlex
from subprocess import Popen, PIPE, TimeoutExpired

COMPILE_DIR = os.getenv('COMPILE_DIR')
PORT = os.getenv('PORT')

app = Flask(__name__)

def write(path, content):
    f = open(path, "w")
    f.write(content)
    f.close()

def run(command):
    result = {'output': "", 'timeout': False, 'error': ""}
    process = Popen(shlex.split(command), stdout=PIPE, stderr=PIPE)
    try:
        outs, errs = process.communicate(timeout=1)
        outs = outs.decode(sys.stdin.encoding)
        errs = errs.decode(sys.stdin.encoding)
        result['output'] = outs
        result['error'] = errs
    except TimeoutExpired:
        process.kill()
        result['timeout'] = True
    return result

def execute(content, lang):
    filename = COMPILE_DIR + "/test.js"
    write(filename, content)
    result = run('sudo -u run_user node ' + filename)
    os.remove(filename)
    return result

@app.post("/")
def index():
    data = request.get_json()
    if 'lang' not in data:
        return {'error': "'lang' not in request"}

    if 'code' not in data:
        return {'error': "'code' not in request"}

    result = execute(data['code'], "js")

    return jsonify({'error': "", 'output': result['output'], 'timeout': result['timeout']})

if __name__=='__main__':
    from waitress import serve   
    print("Listening on port " + PORT)
    serve(app, host='0.0.0.0', port=PORT)
