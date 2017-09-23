(()=>{
    var ws;

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

    }

    const makeConnection = ()=>{
        fetch('./login', {method:'POST', credentials: 'same-origin'})
            .then(handleResponse)
            .then(stringifyObject)
            .then(showMessage)
            .catch((err)=> showMessage(err.message))
    }

    makeConnection()
    setupWsSession()
})()