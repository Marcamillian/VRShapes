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
var shapeRotation = {'pitch':0, "yaw":0, "roll":0}



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
    
    console.log("wss clients:", wss.clients)

    console.log("HTTP request to set up the session")
    const id=uuid.v4();
    
    req.session.userId = id;
    console.log(`Creating and assigning sessionID: ${req.session.userId}`)

    res.send({result:"OK", message: 'Session updated '})
})

app.post('/control', (req, res)=>{ // for pushing control to the VR view
    
    let keysPressed = JSON.parse(req.headers['control']);
    let rotateTo = Object.assign({}, shapeRotation)
    let rotateUpdate = false;
    
    if(keysPressed[73]){
        wss.broadcast('control', "up")
    }
    if(keysPressed[74]){    // j
        wss.broadcast("control", "left")     
    }
    if(keysPressed[75]){ // k
        wss.broadcast("control", "down")
    }
    if(keysPressed[76]){    //k
        wss.broadcast("control","right")
    }
    
        // orientation of the model
    var horizontal;
    var vertical;
    var pitchThing = shapeRotation.pitch/180
    var rollThing = shapeRotation.roll/180;
    horizontal = (Math.round(pitchThing) == pitchThing) ? 'pitch' : 'yaw';
    vertical = (Math.round(rollThing) == rollThing) ? 'roll' : 'pitch'

    console.log(`rotate ${horizontal} ${vertical}`)

    // create the roll to animation
    if(keysPressed[37]){ // left
        rotateTo.roll += 90
        rotateUpdate = true
    }
    if(keysPressed[38]){  // up
        rotateTo.pitch -= 90
        rotateUpdate = true
    }
    if(keysPressed[39]){  // right
        rotateTo.roll -= 90
        rotateUpdate = true
    }
    if(keysPressed[40]){  // down
        rotateTo.pitch += 90
        rotateUpdate = true
    }

    if(rotateUpdate){
        wss.broadcast("rotate",{
            to:{'pitch': rotateTo.pitch ,
                'yaw': rotateTo.yaw,
                'roll': rotateTo.roll},
            from: shapeRotation
            }
        )

        // update the model
        shapeRotation.pitch = rotateTo.pitch
        shapeRotation.yaw = rotateTo.yaw
        shapeRotation.roll = rotateTo.roll
        console.log(shapeRotation)
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
            //done(info.req.session.userId)
            done(true)  // automatically accept the connection
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

wss.broadcast = (type,data)=>{
    let message = {
        result: 'OK',
        type:type,
        data:data
    }

    wss.clients.forEach((ws)=>{
        ws.send(JSON.stringify(message))
    })
}

server.listen(8080, ()=>{console.log("Listening on a port 8080")})