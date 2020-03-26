var PubNub = require('pubnub')
exports.id = 'pnsubscribe';
exports.title = 'PubNub Subscribe';
exports.group = 'PubNub';
exports.color = '#D0202A';
exports.input = false;
exports.output = true;
exports.author = 'Shannon Code <shannon@unspecified.me>';
exports.icon = 'sign-in-alt';
exports.version = '0.0.1';
exports.options = {  };
// exports.npm = ["pubnub"];


exports.html = `
<div class="padding">
    <div class="row">
        <div class="col-md-6">
            <div data-jc="textbox" data-jc-path="publishKey" data-jc-config="placeholder:bitcoin;type:password">@(Publish Key) (required) </div>
            <div class="help"></div>
        </div>
        <div class="col-md-6">
            <div data-jc="textbox" data-jc-path="subscribeKey" data-jc-config="placeholder:bitcoin;type:password">@(Subscribe Key) (required) </div>
            <div class="help"></div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6 m">
            <div data-jc="textboxlist" data-jc-path="channels" data-placeholder="@(Type channels to join here)">@(Channels) (required)</div>
        </div>
    </div>
</div>`;

exports.readme = '60000534042';

exports.install = function(instance) {
    var pubnub;
    var subscribed = false;
    instance.status("Configure me before you use me!", "red")
    /* instance.on('click', ()=>{
        subscribe()
    }) */
    subscribe()

    instance.on('options', ()=>{
        subscribe()     
    })

    function subscribe() {
        if (!subscribed) {
            pubnub = new PubNub({
                publishKey : instance.options.publishKey || FLOW.variables.publishKey || 'demo',
                subscribeKey : instance.options.subscribeKey || FLOW.variables.subscribeKey || 'demo',
                uuid: "myUniqueUUID"
            });
            pubnub.subscribe({
                channels: instance.options.channels || ['hello_world']
            });
            pubnub.addListener({
                status: function(statusEvent) {
                    if (statusEvent.category === "PNConnectedCategory") {
                        
                    }
                },
                message: function(data) {
                    var flowdata =instance.make(data.message.data)
                    flowdata.repository = data.message.repository
                    delete flowdata.data.repository
                    delete data.message
                    flowdata.data.response = data
                    if (instance.options.downstream) {
                        flowdata.set(instance.name, flowdata.data);
                    };
                    instance.send(flowdata)
                },
                presence: function(presenceEvent) {
                    // handle presence
                }
            })
            subscribed = true;
            instance.status("Listening to configured channels", "green")
        } else {
            pubnub.unsubscribe({
                channels: ['hello_world'] 
            });
            subscribed = false;
        }
    }
}