
AFRAME.registerComponent('gaze-control',{
    schema:{
    },
    init: function(){
        var el = this.el;
        var defaultColor = el.getAttribute('material').color;
        var controlDirection = el.getAttribute('control-direction')

        el.addEventListener('mouseenter', function(){
            el.setAttribute('color', 'red')
            console.log(controlDirection)
            rotateModel()
        })

        el.addEventListener('mouseleave', function(){
            el.setAttribute('color', defaultColor)
        })
    }
})
