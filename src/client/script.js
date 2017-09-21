var container = document.querySelector('#shape-container');

var pitch = 0;
var yaw = 0;
var roll = 0;


window.addEventListener('keyup', (event)=>{

    var rotate = { pitch: 0, yaw: 0, roll:0 } 
    console.log(event.keyCode)
    switch(event.keyCode){
        case 73: // i
            rotate.pitch = 90
            break;
        case 74:    // j
            rotate.yaw = 90
            break;
        case 75:    // k
            rotate.pitch = -90
            break;
        case 76:    // l
            rotate.yaw = -90
            break;
    }

    if(rotate.pitch || rotate.yaw || rotate.roll){
   
        removeAnimation()

        container.appendChild(addAnimation({pitch:pitch, yaw:yaw, roll:roll}, {pitch: pitch+rotate.pitch, yaw: yaw+rotate.yaw, roll: roll+rotate.roll}))

        // update the current position
        pitch += rotate.pitch;
        yaw += rotate.yaw;
        roll += rotate.roll
    }
})

addAnimation = function (from,to){

    var rotateAnimation = document.createElement('a-animation')

    console.log(`from || ${from.pitch} ${from.yaw} ${from.roll}`)
    console.log(`to || ${to.pitch} ${to.yaw} ${to.roll}`)
    
    rotateAnimation.setAttribute('attribute', 'rotation')
    rotateAnimation.setAttribute('dur', '1000')
    rotateAnimation.setAttribute('fill', 'forwards')
    rotateAnimation.setAttribute('from', `${from.pitch} ${from.yaw} ${from.roll}`)
    rotateAnimation.setAttribute('to', `${to.pitch} ${to.yaw} ${to.roll}`)

    rotateAnimation.setAttribute('repeat', '0')

    return rotateAnimation
}

removeAnimation = function (){
    container.querySelectorAll('a-animation').forEach((animation)=>{
        container.removeChild(animation)
    })
}






