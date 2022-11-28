from shared import write, run, COMPILE_DIR
import time
import os

def getFileName(extension):
    secondsSinceEpoch = time.time()
    return COMPILE_DIR + "/" + str(secondsSinceEpoch) + "." + extension

def execute_js(content):
    filename = getFileName("js")
    write(filename, content)
    result = run('sudo -u run_user node ' + filename)
    os.remove(filename)
    return result

def execute_cpp(content):
    # sudo apt-get install build-essential
    # g++
    return execute_js(content)

def execute_py(content):
    filename = getFileName("py")
    write(filename, content)
    result = run('sudo -u run_user python ' + filename)
    os.remove(filename)
    return result

def execute(content, lang):
    if lang == 'js':
        return execute_js(content)

    if lang == 'cpp':
        return execute_cpp(content)

    if lang == 'py':
        return execute_py(content)

    return {'error': "language not supported", 'output': "", 'timeout': ""}

