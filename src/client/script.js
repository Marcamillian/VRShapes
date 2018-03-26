// = Define constants
const rotationMatrix_vertical = [  // [yaw][roll]
    [['pitch', 'pitch', 'pitch', 'pitch'],
     ['roll', 'roll', 'roll', 'roll'],
     ['pitch', 'pitch', 'pitch', 'pitch'],
     ['roll', 'roll', 'roll', 'roll']
    ],
    [['pitch', 'pitch', 'pitch', 'pitch'],
     ['pitch', 'pitch', 'pitch', 'pitch'],
     ['pitch', 'pitch', 'pitch', 'pitch'],
     ['pitch', 'pitch', 'pitch', 'pitch']
    ],
    [['pitch', 'pitch', 'pitch', 'pitch'],
     ['roll', 'roll', 'roll', 'roll'],
     ['pitch', 'pitch', 'pitch', 'pitch'],
     ['roll', 'roll', 'roll', 'roll']
    ],
    [['pitch', 'pitch', 'pitch', 'pitch'],
     ['pitch', 'pitch', 'pitch', 'pitch'],
     ['pitch', 'pitch', 'pitch', 'pitch'],
     ['pitch', 'pitch', 'pitch', 'pitch']
    ]
]

const rotationMatrix_VSense =[ //[pitch][yaw][roll]
    [[-1,-1,-1,-1],
     [-1,-1,-1,-1],
     [1,1,1,1],
     [1,1,1,1]
    ],
    [[-1,-1,-1,-1],
     [-1,-1,-1,-1],
     [1,1,1,1],
     [1,1,1,1]
    ],
    [[-1,-1,-1,-1],
     [1,1,1,1],
     [1,1,1,1],
     [-1,-1,-1,-1]
    ],
    [[-1,-1,-1,-1],
     [-1,-1,-1,-1],
     [1,1,1,1],
     [1,1,1,1]
    ]
]

const rotationMatrix_horizontal = [ // [pitch][yaw][roll]
    [['yaw', 'yaw', 'yaw', 'yaw'],
     ['yaw', 'yaw', 'yaw', 'yaw'],
     ['yaw', 'yaw', 'yaw', 'yaw'],
     ['yaw', 'yaw', 'yaw', 'yaw']
    ],
    [['roll', 'roll', 'roll', 'roll'],
     ['yaw', 'yaw', 'yaw', 'yaw'],
     ['roll', 'roll', 'roll', 'roll'],
     ['pitch', 'yaw', 'pitch', 'yaw']
    ],
    [['yaw', 'yaw', 'yaw', 'yaw'],
     ['yaw', 'yaw', 'yaw', 'yaw'],
     ['yaw', 'yaw', 'yaw', 'yaw'],
     ['yaw', 'yaw', 'yaw', 'yaw']
    ],
    [['roll', 'roll', 'roll', 'roll'],
     ['yaw', 'yaw', 'yaw', 'yaw'],
     ['roll', 'roll', 'roll', 'roll'],
     ['pitch', 'yaw', 'pitch', 'yaw']
    ]
]

const rotationMatrix_HSense = [
    [[1,1,1,1],
     [1,1,1,1],
     [1,1,1,1],
     [1,1,1,1]
    ],
    [[-1,-1,-1,-1],
     [-1,-1,-1,-1],
     [-1,-1,-1,-1],
     [-1,-1,-1,-1]
    ],
    [[1,1,1,1],
     [1,1,1,1],
     [1,1,1,1],
     [1,1,1,1]
    ],
    [[1,1,1,1],
     [1,1,1,1],
     [1,1,1,1],
     [1,1,1,1]
    ]
]

// = Define variables

var modelContainer = document.querySelector('#shape-container'); // for removing animation
var modelRotation = { pitch: 0, yaw: 0, roll: 0 }

// Event listeners

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

    Object.keys(modelRotation).forEach(( key )=>{
        var adjustedAngle = modelRotation[key] % 360;
        if(adjustedAngle < 0) adjustedAngle = 360 + adjustedAngle;
        
        modelRotation[key] = adjustedAngle;
    })

})


// == Functions ==

const genRotationAnimEl = function (from,to){

    var rotateAnimation = document.createElement('a-animation')

    //console.log(`from || ${from.pitch} ${from.yaw} ${from.roll}`)
    //console.log(`to || ${to.pitch} ${to.yaw} ${to.roll}`)
    
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

// something that rotates properly relative to the current
// rotation of the model
const getControlAxes = function(direction){

        // there are 6 faces we could be looking at - jsut need to figure out which and which orientation

        // default would be pitch and yaw
            // modify which are in control 

        let hAxis, hSense, vAxis, vSense;

        let pitchSegment = Math.ceil(modelRotation.pitch/90)%4
        let yawSegment = Math.ceil(modelRotation.yaw/90)%4
        let rollSegment = Math.ceil(modelRotation.roll/90)%4

        //console.log(`PitchSeg: ${pitchSegment} || YawSegment: ${yawSegment} || RollSegment: ${rollSegment}`)

        vAxis = rotationMatrix_vertical[pitchSegment][yawSegment][rollSegment];
        hAxis = rotationMatrix_horizontal[pitchSegment][yawSegment][rollSegment]

        vSense = rotationMatrix_VSense[pitchSegment][yawSegment][rollSegment]
        
        hSense = rotationMatrix_HSense[pitchSegment][yawSegment][rollSegment]
        
        return {
            vAxis,
            vSense,
            hAxis,
            hSense
        }
}

const rotateModel = function(to){

    modelContainer.setAttribute('rotation', `${to.pitch} ${to.yaw} ${to.roll}`)

    modelRotation.pitch = to.pitch;
    modelRotation.yaw = to.yaw;
    modelRotation.roll = to.roll;

    Object.keys(modelRotation).forEach(( key )=>{
        modelRotation[key] = modelRotation[key] % 360;
    })
}

const animateToRotation = function(to){
    let from = Object.assign({}, modelRotation)
    modelContainer.appendChild( genRotationAnimEl(from, to) )
}

const animateByAxis = function(axisKey, sense = 1){
    let to = Object.assign({}, modelRotation)
    let from = Object.assign({}, modelRotation)

    to[axisKey] += 90 *sense;

    modelContainer.appendChild( genRotationAnimEl(from, to) )
}

const rotPos = function (pitch, yaw, roll){
    return { pitch: pitch*90, yaw: yaw*90, roll:roll*90}
}

//connections.listenForControls(recieveControl)


//connections.listenForControls(recieveControl)

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
        [ ['green'], [], ['yellow'] ],
        [ ['green'], [], ['green'] ],
        [ ['green'], [], ['yellow'] ]
    ],
    [
        [ ['yellow'], ['green'], ['yellow'] ],
        [ ['green'], ['green'], ['green'] ],
        [ ['yellow'], ['green'], ['yellow'] ]
    ]

]

let modelArray_hCross=[
    [ // layers
        [ [], ['green'], [] ], // rows  | cubes
        [ ['green'], ['green'], ['green'] ],
        [ [], ['green'], [] ]
    ]
]

let modelArray_vCross=[
    [
        [[],['red'],[]]
    ],
    [
        [['red'],['red'],['red']]
    ],
    [
        [[],['red'],[]]
    ]
]

let shapeTest = [
    [
        [['red'],['red'],['red']]
    ],
    [
        [[],['yellow']],
        [[],['yellow']]
    ],
    [
        [['green'],['green'],['green']],
        [['green'],['green']],
        [['green'],['green'],['green']]
    ]
]


const genModelHTML = (modelArray)=>{
    
    // works only for cube based definitions - 
    const layers = modelArray.length; // y in eurler axis
    const layer_rows_max = modelArray.map((layer)=>{
                                    return layer.length
                            }).reduce(findMax);
    const layer_cols_max = modelArray.map((layer)=>{
                                return layer.map((row)=>{
                                    return row.length // number of elements in the row
                                }).reduce( findMax )
                            }).reduce(findMax);
    /*
    modelArray.reduce( (layer, maxModelCols)=>{
        let maxLayerCols = layer.reduce(findLongest);
        return( maxLayerCols > maxModelCols) ? maxLayerCols : maxModelCols;
    } )*/

    const modelCenter_x = (layer_cols_max/2) - 0.5;
    const modelCenter_y = (layers/2) - 0.5;
    const modelCenter_z = (layer_rows_max/2) - 0.5;

    /*
        TODO: check that each layer has the same dims
         !!  as long as two are the same we are OK
    */

    // generate a container for the model
    let container = document.createElement('a-entity');

    // step through the array creating each cubes html
    for( y=0; y < modelArray.length ; y++ ){
        for( z=0; z < modelArray[y].length ; z++ ){
            for( x=0; x < modelArray[y][z].length ; x++ ){
                let cube = genCubeHTML(modelArray[y][z][x]);
                if(cube != undefined){
                    cube.setAttribute('position', `${x - modelCenter_x} ${-y + modelCenter_y} ${z - modelCenter_z}`)
                    container.appendChild(cube)
                }
                
            }
        }
    }

    // TODO: make the origin of the object he middle of the model



    return container;
}

genCubeHTML = (color)=>{
    // exit if the value passed is not an array or is empty
    if( !Array.isArray(color) || color.length == 0){
        //console.log("no cube")
        return 
    } 
    let cube = document.createElement('a-box')
    cube.setAttribute('color', color)
    return cube
}

const findMax = (value, maxValue)=>{
    return (value > maxValue) ? value : maxValue
}

modelContainer.appendChild(genModelHTML(shapeTest));
