(()=>{
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

    const setupWsSession = ()=>{
        if(ws){
            ws.onerror = ws.onopen = ws.onclose = null;
            ws.close()
        }
        ws = new WebSocket(`ws://${location.host}`)
        ws.onerror = ()=> showMessage('Websocket Error')
        ws.onopen = ()=> showMessage(' Websocket connection established')
        ws.onclose = ()=> showMessage('Websocket connection closed')
        ws.onmessage = (messageString)=>{
            let message = JSON.parse(messageString.data)
                
            if(message.result != 'OK'){
                console.error(`${message.type} : ERROR - ${message.data.errorMessage}`)
            }

        }
        console.log(`websocket ${ws}`)
    }

    const makeConnection = ()=>{
        fetch('./login', {method:'POST', credentials: 'same-origin'})
            .then(handleResponse)
            .then(stringifyObject)
            .then(showMessage)
            .then(setupWsSession)
            .catch((err)=> showMessage(err.message))
    }

    const sendInput = ()=>{
        let message = {
            'type':'control',
            'data': {}
        }
        ws.send(JSON.stringify(message))
    }

    makeConnection()


    // CONTROL TRIGGERS
    window.addEventListener('keydown', (e)=>{ // record keypressed
        keysDown[e.keyCode] = true;
        sendInput()
    })

    window.addEventListener('keyup', (e)=>{ // remove keypressed
        delete keysDown[e.keyCode]
    })


})()