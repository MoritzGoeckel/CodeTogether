curl localhost:3457 -d '{"lang": "js", "code": "console.log(\"Aurelia\")"}' -H 'Content-Type: application/json'

curl localhost:3457 -d '{"lang": "js", "code": "while(true){console.log(\"Aurelia\")}"}' -H 'Content-Type: application/json'

curl localhost:3457 -d '{"lang": "py", "code": "print(\"Hello python!\")"}' -H 'Content-Type: application/json'
