const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.use(express.static('static'))
//app.use('/scripts', express.static('public'))

/*app.get('/users', (req, res) => {
  return res.send(Object.values(users));
});

app.get('/users/:userId', (req, res) => {
  return res.send(users[req.params.userId]);
});*/

const ws = require('ws')
const wsPort = 3080;
const wss = new ws.WebSocketServer({ port: wsPort });

function heartbeat() {
  this.isAlive = true;
}

wss.on('connection', function connection(connection) {
  connection.on('pong', heartbeat);
  connection.on('message', function message(data) {
    console.log('received: %s', data)
    connection.send('hallo')
  });

  connection.send('hi')
});

const checkAliveConnectionsInterval = setInterval(function ping() {
  wss.clients.forEach(function each(connection) {
    if (connection.isAlive === false) {
      console.log("Terminating dead connection")
      return connection.terminate();
    }

    connection.isAlive = false;
    connection.ping(); // This provokes a pong message
  });
}, 30000);

wss.on('close', function close() {
  clearInterval(checkAliveConnectionsInterval);
});

console.log("Listening to " + wsPort + " for socket")
