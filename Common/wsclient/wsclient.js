exports.id = 'wsclient';
exports.title = 'WebSocket Client';
exports.group = 'Files and Data I/O';
exports.color = '#ffa500';
exports.input = false;
exports.click = true;
exports.output = true;
exports.author = 'Martin Smola';
exports.icon = 'comment';
exports.version = '1.0.0';
exports.options = {  };

exports.readme = '60000316221';

exports.html = `<div class="padding">
	<div class="row m">
		<div class="col-md-3">
			<div data-jc="textbox" data-jc-path="host" data-jc-config="placeholder:echo.websocket.org;required:true">@(Host or IP address)</div>
			<div class="help m">@()</div>
		</div>
		<div class="col-md-3">
			<div data-jc="textbox" data-jc-path="subscribe" data-jc-config="placeholder:{op: 'sub'}">@(Subscribe Command) (@(required))</div>
		</div>
		<div class="col-md-3">
			<div data-jc="textbox" data-jc-path="unsubscribe" data-jc-config="placeholder:{op: 'unsub'}">@(Un Subscribe Command) (@(required))</div>
		</div>
	</div>
	<div class="row m">
		<div class="col-md-3">
			<div data-jc="checkbox" data-jc-path="secure">@(Secure (will use wss://))</div>
		</div>
	</div>
</div>`;

exports.install = function(instance) {

	var subscribed = false;
	const WebSocket = require('ws');
	init();
	// const ws = new WebSocket('wss://ws.blockchain.info/inv');
	var ws;
	instance.on('click', () => toggleSubscribe())
	instance.on('options', ()=>{
		init()
	});
	function init(){
		if (instance.options.host && instance.options.subscribe && instance.options.unsubscribe) {
			instance.status("Connecting", "green");
			var host = instance.options.host || FLOW.variables.host
			if (!host.includes('://')) {
				instance.options.secure ? host = 'wss://' + host : host = 'ws://' + host;
			}
			ws = new WebSocket(host);
			ws.on('open', function open() {
				toggleSubscribe()
			});
			ws.on('message', (data) => {
				data = JSON.parse(data)
				var flowdata = instance.make()
				flowdata.data = data
				if (instance.options.downstream) {
					flowdata.set(instance.name, flowdata.data);
				}
				instance.send(flowdata)
			});
		} else {
			instance.status("Please Configure", "red")
		}
	}

	function toggleSubscribe() {
		if (subscribed) {
			instance.status("UnSubscribed");
			subscribed = false;
			var command = instance.options.unsubscribe;
			ws.send(typeof(command) === 'object'? JSON.stringify(command): command );
		} else {
			instance.status("Subscribed");
			subscribed = true;
			var command = instance.options.subscribe;
			ws.send(typeof(command) === 'object'? JSON.stringify(command): command );
		
		}
	}
};

