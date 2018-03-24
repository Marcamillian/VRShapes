

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

let modelArray_cube = [
    [ // layers
        [ ['green'], ['green'], ['green'] ], // rows  | cubes
        [ ['green'], ['green'], ['green'] ],
        [ ['green'], ['green'], ['green'] ]
    ],
    [
        [ ['red'], ['green'], ['red'] ],
        [ ['green'], ['red'], ['green'] ],
        [ ['red'], ['green'], ['red'] ]
    ],
    [
        [ ['yellow'], ['green'], ['yellow'] ],
        [ ['green'], ['green'], ['green'] ],
        [ ['yellow'], ['green'], ['yellow'] ]
    ]
]

let modelArray_hCross=[

]

let modelArray_vCross=[

]


const genModelHTML = (modelArray)=>{
     
    const layers = modelArray.length;
    const layer_rows = modelArray[0].length;
    const layer_cols = modelArray[0][0].length;

    /*
        TODO: check that each layer has the same dims
         !!  as long as two are the same we are OK
    */

    // generate a container for the model
    let container = document.createElement('a-entity');

    // step through the array creating each cubes html
    for( y=0; y < layers ; y++ ){
        for( z=0; z < layer_rows ; z++ ){
            for( x=0; x < layer_cols; x++ ){
                let cube = genCubeHTML(modelArray[y][z][x]);
                cube.setAttribute('position', `${x} ${-y} ${z}`)
                container.appendChild(cube)
            }
        }
    }

    // set the container to the middle
    container.setAttribute('position', `${0} ${0} ${-layer_rows/2}` )

    return container;
}

genCubeHTML = (color = 'white')=>{
    let cube = document.createElement('a-box')
    cube.setAttribute('color', color)
    return cube
}

container.appendChild(genModelHTML(modelArray_cube));
