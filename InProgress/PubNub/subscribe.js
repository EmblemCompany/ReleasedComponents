var PubNub = require('pubnub')
exports.id = 'subscribe';
exports.title = 'PubNub Subscribe';
exports.group = 'PubNub';
exports.color = '#D0202A';
exports.input = false;
exports.output = true;
exports.click = true;
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
</div>`;

exports.readme = '0000000';

exports.install = function(instance) {
    var pubnub;
    var subscribed = 'false';
    instance.on('data', function(flowdata) {
        
    });
    instance.on('click', ()=>{
        if (!subscribed) {
            pubnub = new PubNub({
                publishKey : instance.options.publishKey || 'demo',
                subscribeKey : instance.options.subscribeKey || 'demo',
                uuid: "myUniqueUUID"
            });
            pubnub.subscribe({
                channels: ['hello_world'] 
            });
            pubnub.addListener({
                status: function(statusEvent) {
                    if (statusEvent.category === "PNConnectedCategory") {
                        publishSampleMessage();
                    }
                },
                message: function(msg) {
                    console.log(msg.message.title);
                    console.log(msg.message.description);
                },
                presence: function(presenceEvent) {
                    // handle presence
                }
            }) 
        } else {
            pubnub.unsubscribe({
                channels: ['hello_world'] 
            });
        }
    })
}