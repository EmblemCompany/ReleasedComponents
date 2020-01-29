
require('total.js');
require('./circuitRunner');
var circuit = require('./circuit.json')
// var list = require("https://raw.githubusercontent.com/UnspecifiedLLC/ReleasedComponents/master/free-components.json")
const { fork } = require('child_process');
var startComponent = "bitcointransactionsws"
var component = circuit.components.findComponentsByName(startComponent)[0]
execComponent({component0 : component.component, action: 'click', options0: component.options}, (flowdata)=>{
    nextComponentExecute(flowdata, (flowdata)=>{
        console.log("flowdata", flowdata.data)
        process.exit(0)
    })
})

function nextComponentExecute(flowdata, cb) {
    component = circuit.components.findComponentsByName(flowdata.parent.component)[0]
    var connectionId = component.connections["0"][0].id
    var component = circuit.components.findComponentsById(connectionId)[0]
    execComponent({component0 : component.component, options0: component.options, data: flowdata.data}, (flowdata)=>{
        console.log('flowdata.data', flowdata.data)
        component = circuit.components.findComponentsByName(flowdata.parent.component)[0]
        if (component.connections[0] && component.connections[0].length > 0) {
            var connectionId = component.connections["0"][0].id
            var component = circuit.components.findComponentsById(connectionId)[0]
            flowdata.component0 = component.component
            flowdata.options0 = component.options
            return nextComponentExecute(flowdata, cb)
        } else {
            return cb(flowdata)
        }
    })
}
function execComponent(options, cb) {
    const compute = fork('run.js');
    compute.send(options);

    compute.on('message', result => {
        return cb(result);
    });
}

