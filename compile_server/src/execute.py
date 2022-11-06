from shared import write, run, COMPILE_DIR
import os

def execute_js(content):
    filename = COMPILE_DIR + "/test.js"
    write(filename, content)
    result = run('sudo -u run_user node ' + filename)
    os.remove(filename)
    return result

def execute_cpp(content):
    return execute_js(content)

def execute_py(content):
    return execute_js(content)

def execute(content, lang):
    if lang == 'js':
        return execute_js(content)

    if lang == 'cpp':
        return execute_cpp(content)

    if lang == 'py':
        return execute_py(content)

    return {'error': "language not supported", 'output': "", 'timeout': ""}

