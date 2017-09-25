

var container = document.querySelector('#shape-container'); // for removing animation

var pitch = 0;
var yaw = 0;
var roll = 0;

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

connections.listenForControls(recieveControl)







