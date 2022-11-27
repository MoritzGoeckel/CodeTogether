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

wss.on('connection', function connection(connection) {
  connection.on('message', function message(data) {
    console.log('received: %s', data)
    connection.send('pong')
  });

  connection.send('hi')
});

console.log("Listening to " + wsPort + " for socket")
