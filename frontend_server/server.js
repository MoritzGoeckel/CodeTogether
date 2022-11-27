// Server

const inform = (message) => {
  console.log("Info: " + message)
}

const warn = (message) => {
  console.log("Warning: " + message)
}

const debug = (message) => {
  // console.log("Debug: " + message)
}

const express = require('express')
const app = express()
const port = 3000

/*app.get('/', (req, res) => {
  res.send('Hello World!')
})*/

app.listen(port, () => {
  inform("http server listening on port " + port)
})

app.use(express.static('static'))
//app.use('/scripts', express.static('public'))

/*app.get('/users', (req, res) => {
  return res.send(Object.values(users));
});

app.get('/users/:userId', (req, res) => {
  return res.send(users[req.params.userId]);
});*/

// Socket

const request = require('request');

function generateId(){
  return String(Date.now())
}

let idToConnection = {}
let rooms = {}
let connectionIdToRoom = {}

function exitRooms(connection){
  if(connection.id in connectionIdToRoom){
    let roomId = connectionIdToRoom[connection.id]
    rooms[roomId]["clients"] = rooms[roomId]["clients"].filter((elem) => { return elem != connection.id })
    if(rooms[roomId]["clients"].length == 0){
      delete rooms[roomId] // room is now empty
      debug("Deleting room: " + roomId)
    }
  }
}

let handlers = {
  "room_req": (connection, req) => { 
    exitRooms(connection)
    let roomId = generateId()
    rooms[roomId] = { "code": req["content"], "lang": req["lang"], "clients": [connection.id] }
    connectionIdToRoom[connection.id] = roomId
    return { "room": roomId, "type": "room_res", "lang": req["lang"], "content": rooms[roomId]["code"] }
  },
  "code_full": (connection, req) => { 
    let roomId = req["room"]
    let room = rooms[roomId]
    room["code"] = req["content"]
    room["lang"] = req["lang"]
    room["code"] = req["content"]
    let message = JSON.stringify({"room": roomId, "type": "code_full", "lang": room["lang"], "content": room["code"]})
    room["clients"].forEach((conId) => { 
      if(conId != connection.id) {
        idToConnection[conId].send(message) 
      }
    })
    return null 
  },
  "room_join": (connection, req) => { 
    exitRooms(connection)
    let roomId = req["room"]
    let room = rooms[roomId]
    room["clients"].push(connection.id)
    return {"room": roomId, "type": "code_full", "lang": room["lang"], "content": room["code"]} 
  },
  "run_req": (connection, req) => {
    let roomId = req["room"]
    let room = rooms[roomId]
    // TODO: Room code?, Room lang?
    let compileRequest = {"lang": req["lang"], "code": req["content"]}

    let requestOptions = {
      url: 'http://127.0.0.1:3457', 
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(compileRequest) 
    }

    request.post(requestOptions, (err, res, body) => {
      if(err != undefined){
        warn("Error connecting to compile server:")
        warn(err)
      }

      let message = JSON.stringify({"room": roomId, "type": "run_res", "lang": req["lang"], "content": JSON.parse(body)})
      room["clients"].forEach((conId) => { idToConnection[conId].send(message) })
    })

    return null 
  },
  "none": (connection, req) => { return null }
}

const ws = require('ws')
const wsPort = 3080;
const wss = new ws.WebSocketServer({ port: wsPort });

function heartbeat() {
  this.isAlive = true
}

wss.on('connection', function connection(connection) {
  connection.id = generateId()
  idToConnection[connection.id] = connection

  connection.on('pong', heartbeat);
  connection.on('message', function message(data) {
    try{
      debug('Received message: ' + data)
      let req = JSON.parse(data)
      let result = handlers[req["type"]](connection, req)
      if(result != null){
        connection.send(JSON.stringify(result))
      }
    } catch (e){
      connection.send("Bad request: " + e)
    }
  });

  connection.ping()
});

const checkAliveConnectionsInterval = setInterval(function ping() {
  wss.clients.forEach(function each(connection) {
    if (connection.isAlive === false) {
      debug("Terminating connection " + connection.id)
      exitRooms(connection)
      delete idToConnection[connection.id]
      return connection.terminate();
    }

    connection.isAlive = false;
    connection.ping(); // This provokes a pong message
  });
}, 30000);

wss.on('close', function close() {
  clearInterval(checkAliveConnectionsInterval);
});

inform("ws server listening on port " + wsPort)

// Messages:
// {"room": "...", "type": "code_update", "lang": "...", "content": "..."} // TODO