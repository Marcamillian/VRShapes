'use strict'
// npm imports
const session = require('express-session');
const express = require('express')
const http = require('http')
const WebSocket = require('ws')


// game objects
var app = express();
var sessionParser;
var server;
var wss;

sessionParser = session({
    saveUninitialized: false,
    secret: 'passOpen',
    resave: false
})

// CONFIGURE AN EXPRESS APP
app.use(express.static('./src/client'));
app.use(sessionParser);

// EXPRESS ROUTING


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
wss.on(`connection`, (wss,req)=>{
    ws.userId = req.session.userId
})

server.listen(8080, ()=>{console.log("Listening on a port 8080")})