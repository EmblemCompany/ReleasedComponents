exports.id = 'bitcoinblocksws';
exports.title = 'Bitcoin Blocks';
exports.group = 'Blockchain.com';
exports.color = '#164799';
exports.click = true;
exports.input = false;
exports.output = true;
exports.author = 'Shannon Code <shannon@unspecified.me>';
exports.icon = 'bitcoin';
exports.brand = true;
exports.version = '0.0.3';
exports.options = {  };

exports.readme = '60000314750';

exports.html = ``;

exports.install = function(instance) {

	var subscribed = false;
	const WebSocket = require('ws');

	const ws = new WebSocket('wss://ws.blockchain.info/inv');

	ws.on('open', function open() {
		instance.status("Connected", "green")
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


	instance.on('click', () => toggleSubscribe())
	
	function toggleSubscribe() {
		if (subscribed) {
			instance.status("UnSubscribed");
			subscribed = false;
			ws.send(JSON.stringify({"op": "blocks_unsub"}));
		} else {
			instance.status("Subscribed");
			subscribed = true;
			ws.send(JSON.stringify({"op": "blocks_sub"}));
		}
	}
};
