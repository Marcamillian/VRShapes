'use strict'
// npm imports
const session = require('express-session');
const express = require('express')
const http = require('http')
const WebSocket = require('ws')
const uuid = require('uuid')


// server objects
var app = express();
var sessionParser;
var server;
var wss;

// game variables
var controls = ['up', 'down', 'left', 'right']

sessionParser = session({
    saveUninitialized: false,
    secret: 'passOpen',
    resave: false
})

// CONFIGURE AN EXPRESS APP
app.use(express.static('./src/client'));
app.use(sessionParser);



// EXPRESS ROUTING
app.post('/login', (req, res)=>{ // for initialising the websocket connection
    const id=uuid.v4();
    
    console.log(`Updating session for user ${id}`)
    req.session.userId = id;

    res.send({result:"OK", message: 'Session updated '})
})

app.post('/control', (req, res)=>{ // for pushing control to the VR view
    
    let keysPressed = JSON.parse(req.headers['control']);
    
    
    if(keysPressed[73]){
        wss.broadcast("up")
    }
    if(keysPressed[74]){    // j
        wss.broadcast("left")     
    }
    if(keysPressed[75]){ // k
        wss.broadcast("down")
    }
    if(keysPressed[76]){    //k
        wss.broadcast("right")
    }

    res.send({result:'OK', mesage: 'Control sent'})
})

// CREATE THE HTTP SERVER
server = http.createServer(app);

// CREATE THE WEBSOCKET SERVER
wss = new WebSocket.Server({
    verifyClient: (info, done)=>{
        console.log('Parsing session from request ...');
        sessionParser(info.req, {}, ()=>{
            console.log(`Session is parsed for user: ${info.req.session.userId}`)
            // reject the connection if the user if not revognised
            done(info.req.session.userId)
        })
    },server
})

// CONFIGURE WEBSOCKET SERVER
wss.on(`connection`, (ws,req)=>{
    ws.userId = req.session.userId;

    ws.on('message', (response)=>{
        let message = JSON.parse(response)
        console.log(message)
        // broadcast the control to the appropriate places
        wss.broadcast("left")
    })
})

wss.broadcast = (control)=>{
    let message = {
        result: 'OK',
        type:'control',
        data:control
    }

    wss.clients.forEach((ws)=>{
        ws.send(JSON.stringify(message))
    })
}

server.listen(8080, ()=>{console.log("Listening on a port 8080")})