const Twitter = require('node-twitter-api');
const TwitterClient = new Twitter();

exports.id = 'posttweet';
exports.title = 'Post Tweet';
exports.group = 'Twitter';
exports.color = '#8bc53f';
exports.input = true;
exports.output = true;
exports.author = 'Stacy Howerton <stacy@unspecified.me>';
exports.icon = 'bird';
exports.version = '0.0.1';
exports.options = {  };
exports.npm = [];

// exports.html = `
// <div class="padding">
//     <div class="row">
//         <div class="col-md-6">
//             <div data-jc="textbox" data-jc-path="publishKey" data-jc-config=";type:password">@(Publish Key) (required) </div>
//             <div class="help"></div>
//         </div>
//         <div class="col-md-6">
//             <div data-jc="textbox" data-jc-path="subscribeKey" data-jc-config=";type:password">@(Subscribe Key) (required) </div>
//             <div class="help"></div>
//         </div>
//     </div>
//     <div class="row">
//         <div class="col-md-6 m">
//             <div data-jc="textbox" data-jc-path="channel" data-placeholder="@(Type channel to publish to here)">@(Channel) (required)</div>
//         </div>
//     </div>
// </div>`;

// exports.readme = '0000000';

// twitter.statuses("update", {
//     status: "Hello world!"
// },
// accessToken,
// accessTokenSecret,
// function(error, data, response) {
//     if (error) {
//         // something went wrong
//     } else {
//         // data contains the data sent by twitter
//     }
// }
// );
// exports.install = function(instance) {
//     var twitter;
//     instance.status("Not Configured", "red")
//     subscribe()
//     instance.on('data', (flowdata)=>{
//         pubnub.publish(
//             {
//                 message: flowdata,
//                 channel: instance.options.channel || 'hello_world',
//                 sendByPost: true, // true to send via POST
//                 storeInHistory: false, //override default storage options
//                 meta: {
//                     "cool": "meta"
//                 } // publish extra meta with the request
//             },
//             function (status, response) {
//                 flowdata.data = {status: status, response: response}
//                 if (instance.options.downstream) {
//                     flowdata.set(instance.name, flowdata.data);
//                 };
//                 instance.send(flowdata)
//                 // handle status, response
//             }
//         );
//     })
//     instance.on('options', ()=>{
//         subscribe()     
//     })
//     function subscribe() {
//         pubnub = new PubNub({
//             publishKey : instance.options.publishKey || FLOW.variables.publishKey || 'demo',
//             subscribeKey : instance.options.subscribeKey || FLOW.variables.subscribeKey || 'demo',
//             uuid: "myUniqueUUID"
//         });
//         instance.status("Publishing to channel " + (instance.options.channel || 'hello_world'), "green")
//     }

