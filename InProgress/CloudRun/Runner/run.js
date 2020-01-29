require('total.js');
require('./circuitRunner');
// CLOUD INTERFACE FOR CIRCUIT BUILDER COMPONENT

// ====================
// GLOBAL METHODS
// ====================

// FLOWDATA(data, input)       - sends data to component
// FLOWCLICK()                 - performs click event
// FLOWSIGNAL([data])          - sends signal to component
// FLOWEMIT(event, [data])     - emits an event
// FLOWOPTIONS(options)        - simulates a change of options
// FLOWCLOSE([callback])       - simulates closing
// FLOWTRIGGER(name, [data])   - simulates trigger
// FLOWDEBUG(true/false)       - enables internal output from console (default: true)
// FLOWUNINSTALL()             - uninstalls component
// FLOWINSTANCE                - a component instance

// ====================
// EVENTS FOR EXECUTION
// ====================

// ON('flow.ready')                    - triggered when the flow system is ready
// ON('flow.data', fn(data))           - triggered when FLOWDATA() is executed
// ON('flow.send', fn(index, data))    - triggered when the component performs `component.send()`
// ON('flow.options', fn(options))     - triggered when FLOWPTIONS() is executed
// ON('flow.signal', fn(index, data))  - triggered when FLOWSIGNAL() is executed
// ON('flow.status', fn(text, style))  - triggered when the component performs `component.status()`
// ON('flow.debug', fn(data, style))   - triggered when the component performs `component.debug()`
// ON('flow.close')                    - triggered when the component is closed

  
  process.on('message', message => {
    if (typeof(message) === 'string') {
        message = JSON.parse(message)
    }
    
    FLOWINIT(require('./'+message.component0));
    ON('flow.ready', function() {
        FLOWOPTIONS(message.options0);
        switch(message.action) {
            case 'click':
                setTimeout(FLOWCLICK, 2000)
                // FLOWCLICK();
            break;
        }
        FLOWDATA(message.data, 0)
    });
    ON('flow.send2', (index, data)=>{
        // console.log('data', data)
        process.send(data, index);
    })
    ON('flow.send', (index, data)=>{
        // console.log('data', data)
        process.send(data, index);
    })
    ON('flow.signal', (index, data)=>{
        console.log("SIGNAL")
        process.send(data, index);
    })
    ON('flow.debug', (data, style)=>{
        console.log("DEBUG")
    })
  });