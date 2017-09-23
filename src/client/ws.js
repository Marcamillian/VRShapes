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

            if(message.result == 'OK'){
                switch(message.type){
                    case 'control':
                        console.log(`ws control: ${message.data}`)
                        break;
                    default:
                        console.log("ws message: unknown type")
                        break
                }
            }else{
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

    const controlSetup =  ()=>{
        // CONTROL TRIGGERS
        window.addEventListener('keydown', (e)=>{ // record keypressed
            keysDown[e.keyCode] = true;
            //sendInput()
            sendControl()
        })

        window.addEventListener('keyup', (e)=>{ // remove keypressed
            delete keysDown[e.keyCode]
        })

        return "Controls setup"
    }

    const sendControl = ()=>{
        let myHeaders = new Headers({
            "Control":keysDown
        })

        fetch('/control', {method:'POST', credentials:'same-origin', headers: myHeaders})
            .then(handleResponse)
            .then(stringifyObject)
            .then(showMessage)
            .catch((err)=>showMessage(err.message))
    }

    return {
        wsConnectionSetup: makeConnection,
        wsControlSetup: controlSetup
    }
})()