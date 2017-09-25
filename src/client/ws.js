connections = (()=>{
    var ws;
    var keysDown = {}

    const showMessage = (message)=>{
        console.log(message)
    }

    const handleResponse = (response)=>{
        return response.ok
            ? response.json()
            : Promise.reject(new Error('Unexpected response'))
    }
    
    const stringifyObject = (jsonMessage)=>{
        return JSON.stringify(jsonMessage, null, 2)
    }

    const setupWsSession = (messageHandler)=>{

        console.log("function passed in", messageHandler)
        if(ws){
            ws.onerror = ws.onopen = ws.onclose = null;
            ws.close()
        }
        ws = new WebSocket(`ws://${location.host}`)
        ws.onerror = ()=> showMessage('Websocket Error')
        ws.onopen = ()=> showMessage(' Websocket connection established')
        ws.onclose = ()=> showMessage('Websocket connection closed')
        ws.onmessage = (messageString)=>{
            let messageObject = JSON.parse(messageString.data)
    
            if(messageObject.result == 'OK'){
                if (messageHandler){
                    messageHandler(messageObject)
                }else{
                    defaultMessageHandler(messageObject)
                }
            }else{
                console.error(`${messageObject.type} : ERROR - ${messageObject.data.errorMessage}`)
            }
        }
    }

    const makeConnection = (messageHandler)=>{
        fetch('./login', {method:'POST', credentials: 'same-origin'})
            .then(handleResponse)
            .then(stringifyObject)
            .then(showMessage)
            .then(setupWsSession(messageHandler))
            .catch((err)=> showMessage(err.message))
    }

    const sendInput = ()=>{
        let message = {
            'type':'control',
            'data': {}
        }
        ws.send(JSON.stringify(message))
    }

    const controlSetup =  ()=>{
        // CONTROL TRIGGERS
        window.addEventListener('keydown', (e)=>{ // record keypressed
            keysDown[e.keyCode] = true;
            sendControl()
        })

        window.addEventListener('keyup', (e)=>{ // remove keypressed
            delete keysDown[e.keyCode]
        })

        return "Controls setup"
    }

    const sendControl = ()=>{
        let myHeaders = new Headers({
            "control":JSON.stringify(keysDown)
        })

        fetch('/control', {method:'POST', credentials:'same-origin', headers: myHeaders})
            .then(handleResponse)
            .then(stringifyObject)
            .then(showMessage)
            .catch((err)=>showMessage(err.message))
    }

    const defaultMessageHandler = (messageObject)=>{
        console.log(messageObject)
    }

    return {
        listenForControls: makeConnection,
        wsControlSetup: controlSetup
    }
})()