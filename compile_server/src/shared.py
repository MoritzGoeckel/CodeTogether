import sys
import os
import shlex
from subprocess import Popen, PIPE, TimeoutExpired

COMPILE_DIR = os.getenv('COMPILE_DIR')

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

