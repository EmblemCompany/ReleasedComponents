var PubNub = require('pubnub')
exports.id = 'pnpublish';
exports.title = 'PubNub Publish';
exports.group = 'PubNub';
exports.color = '#D0202A';
exports.input = true;
exports.output = true;
exports.author = 'Shannon Code <shannon@unspecified.me>';
exports.icon = 'sign-out-alt';
exports.version = '0.0.1';
exports.options = {  };
// exports.npm = ["pubnub"];


exports.html = `
<div class="padding">
    <div class="row">
        <div class="col-md-6">
            <div data-jc="textbox" data-jc-path="publishKey" data-jc-config=";type:password">@(Publish Key) (required) </div>
            <div class="help"></div>
        </div>
        <div class="col-md-6">
            <div data-jc="textbox" data-jc-path="subscribeKey" data-jc-config=";type:password">@(Subscribe Key) (required) </div>
            <div class="help"></div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6 m">
            <div data-jc="textbox" data-jc-path="channel" data-placeholder="@(Type channel to publish to here)">@(Channel) (required)</div>
        </div>
    </div>
</div>`;

exports.readme = '0000000';

exports.install = function(instance) {
    var pubnub;
    instance.status("Not Configured", "red")
    subscribe()
    instance.on('data', (flowdata)=>{
        pubnub.publish(
            {
                message: flowdata,
                channel: instance.options.channel || 'hello_world',
                sendByPost: true, // true to send via POST
                storeInHistory: false, //override default storage options
                meta: {
                    "cool": "meta"
                } // publish extra meta with the request
            },
            function (status, response) {
                flowdata.data = {status: status, response: response}
                instance.send(flowdata)
                // handle status, response
            }
        );
    })
    instance.on('options', ()=>{
        subscribe()     
    })
    function subscribe() {
        pubnub = new PubNub({
            publishKey : instance.options.publishKey || FLOW.variables.publishKey || 'demo',
            subscribeKey : instance.options.subscribeKey || FLOW.variables.subscribeKey || 'demo',
            uuid: "myUniqueUUID"
        });
        instance.status("Publishing to channel " + (instance.options.channel || 'hello_world'), "green")
    }
}