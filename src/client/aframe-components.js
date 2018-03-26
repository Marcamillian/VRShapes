AFRAME.registerComponent('gaze-control',{
    schema:{
    },
    init: function(){        
        var el = this.el;
        var defaultColor = el.getAttribute('material').color;
        var controlDirection = el.getAttribute('control-direction')

        // when the control is looked at
        el.addEventListener('mouseenter', function(){

            el.setAttribute('color', 'red')

            // check to see if there is an animation playing currently
            if(hasAnimations(modelContainer)){ return } // if so - step out

            // decide the new rotation of the model is
            // limit the rotations to < 360 deg
            let from = Object.assign({}, modelRotation)
            let to = Object.assign({}, modelRotation)

            let controls = getControlAxes();

            switch (controlDirection){
                case 'up':
                    to[controls.vAxis] += 90*(controls.vSense);
                break;
                case 'down':
                    to[controls.vAxis] += -90*(controls.vSense);
                break;
                case 'right':
                    to[controls.hAxis] += 90*(controls.hSense);
                break;
                case 'left':
                    to[controls.hAxis] += -90*(controls.hSense);
                break;
                default:
                    console.log(`Unknown rotate direction : ${controlDirection}`)
            }
            
            // add the animation html to the model
            modelContainer.appendChild(genRotationAnimEl(from, to))

        })

        el.addEventListener('mouseleave', function(){
            el.setAttribute('color', defaultColor)
        })
    }
})
