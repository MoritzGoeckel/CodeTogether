let ws = new WebSocket("ws://v220221146664206314.happysrv.de:3080");

let selectedRoomId = ""
let prevCode = ""
let selectedLanguage = "js"

export function connect(jar){
    ws.onopen = function (event) {
        let request = {"type": "room_req", "lang": selectedLanguage, "content": jar.toString()}
        ws.send(JSON.stringify(request));
    };

    const handlers = {
        "room_res": (message) => {
            document.querySelector('#room_id').value = message["room"]
            selectedRoomId = message["room"]
        },
        "code_full": (message) => {
            let cursor = jar.save()
            jar.updateCode(message["content"])
            jar.restore(cursor)
        },
        "run_res": (message) => {
            let content = message["content"]
            let result = ""
            if(content["timeout"]){
                result = "Timeout"
            } else if (content["error"].length != 0){
                result = "Error: " + content["error"]
            } else {
                result = content["output"]
            }
            document.querySelector('#run_result').textContent = result
        }
    }

    ws.onmessage = (event) => { 
        console.log(event.data); 
        try{
            let message = JSON.parse(event.data)
            handlers[message["type"]](message)
        } catch(e){
            console.log("Bad message: " + e)
        }
    }

    jar.onUpdate(code => {
        // console.log("Update code, send: " + code); // TODO use partial updates. Don't always update, have a cooldown
        if(code != prevCode){
            let request = {"room": selectedRoomId, "type": "code_full", "lang": selectedLanguage, "content": jar.toString()}
            ws.send(JSON.stringify(request))
            prevCode = code
        }
    });

    document.querySelector('#join_btn').onclick = () => { 
        selectedRoomId = document.querySelector('#room_id').value
        let request = { "room": selectedRoomId, "type": "room_join" }
        ws.send(JSON.stringify(request));
    }

    document.querySelector('#run_btn').onclick = () => { 
        let request = { "room": selectedRoomId, "type": "run_req", "lang": selectedLanguage, "content": jar.toString()}
        ws.send(JSON.stringify(request));
    }

    document.querySelector('#lang_options').onchange = () => { 
        console.log("onChange")
        let newLanguage = document.querySelector('#lang_options').value   
        if(newLanguage != selectedLanguage){
            console.log("override")
            selectedLanguage = newLanguage
            // TODO inform server
            // TODO change highlighting
        }
    }
}