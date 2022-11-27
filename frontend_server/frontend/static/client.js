
let ws = new WebSocket("ws://v220221146664206314.happysrv.de:3080");

ws.onopen = function (event) {
    ws.send("WebSocket is really cool");
};

ws.onmessage = (event) => { 
    console.log(event.data); 
}