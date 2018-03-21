var modelContainer = document.querySelector('#shape-container'); // for removing animation

modelContainer.addEventListener('animationend', function(){

    // get the active animation element
    var rotateAnims = this.querySelectorAll('a-animation')

    // get the end position of the animation
    var endPosition = rotateAnims[0].getAttribute('to')

    // remove the animation element
    removeAnimations(this)

    // set the model to the end end postion
    this.setAttribute('rotation', endPosition)
    
    // update the model
    const rotationArray = endPosition.split(" ");

    modelRotation.pitch = Number(rotationArray[0]);
    modelRotation.yaw = Number(rotationArray[1]);
    modelRotation.roll = Number(rotationArray[2]);

})

var modelRotation = { pitch: 0, yaw: 0, roll: 0 }

const genRotationAnimEl = function (from,to){

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

const removeAnimations = function (element){
    element.querySelectorAll('a-animation').forEach((animation)=>{
        element.removeChild(animation)
    })
}

const recieveControl = function(wsData){
    switch(wsData.type){
        case "control":
            changeAngle = {'pitch':0, 'yaw':0, 'roll':0}
            switch (wsData.data){
                case 'left':
                    changeAngle.roll = 90;
                    break;
                case 'right':
                    changeAngle.roll = -90
                    break;
                case 'up':
                    changeAngle.pitch = 90
                    break;
                case 'down':
                    changeAngle.pitch = -90
                    break;
                default:
                    console.log('unknown control')
                    return "control cancelled"
                    break
            }
            if(changeAngle.pitch !=0 || changeAngle.yaw !=0 || changeAngle.roll !=0){
                removeAnimation()
                const animElement = addAnimation({'pitch':pitch, 'yaw':yaw, 'roll':roll},
                                {'pitch':pitch+changeAngle.pitch ,'yaw':yaw+changeAngle.yaw, 'roll':roll+changeAngle.roll}
                )
        
                container.appendChild(animElement)
        
                pitch = pitch+changeAngle.pitch;
                yaw = yaw+changeAngle.yaw;
                roll = roll+changeAngle.roll;
            }
            break;
    
        case "rotate":
            const rotateFrom = wsData.data.from;
            const rotateTo = wsData.data.to

            removeAnimation()
            const animElement = addAnimation(rotateFrom, rotateTo);
            container.appendChild(animElement)

            break;
     }
     
}

const hasAnimations = function(element){
    return (element.querySelectorAll('a-animation').length > 0 ) ? true : false;
}

//connections.listenForControls(recieveControl)









