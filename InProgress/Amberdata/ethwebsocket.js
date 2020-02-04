// https://github.com/amberdata/amberdata-example-websockets/blob/master/index.js
// https://amberdata.io/guides/view-digital-asset-holdings
// https://docs.amberdata.io/reference	
exports.id = 'ethwebsocket';
exports.title = 'Ethereum Events';
exports.group = 'Ethereum';
exports.color = 'red';
exports.click = true;
exports.input = false;
exports.output = true;
exports.author = 'Shannon Code <shannon@unspecified.me>';
exports.icon = 'money-bill-wave-alt';
exports.version = '0.0.2';
exports.options = {  };

exports.html = `<div class="padding">
	<div data-jc="checkbox__raw">Raw Transactions (Not simplified)</div>
</div>`;

exports.readme = '00000';

exports.install = function(instance) {

	var subscribed = false;

	var W3CWebSocket = require('websocket').w3cwebsocket;
 
	var client = new W3CWebSocket('wss://ws.web3api.io?x-api-key=UAK7d678b6284724438320dc35f1c31ec13&x-amberdata-blockchain-id=ethereum-mainnet', 'echo-protocol');

	client.onerror = function() {
		console.log('Connection Error');
	};
	 
	client.onopen = function() {
		instance.status('WebSocket Client Connected', 'green');
		
	};
	 
	client.onclose = function() {
		console.log('echo-protocol Client Closed');
	};
	 
	client.onmessage = function(e) {
		if (typeof e.data === 'string') {
			// console.log("Received: '" + e.data + "'");
			instance.send(JSON.parse(e.data))
		}
	};

	instance.on('click', () => toggleSubscribe())
	// const BLOCK = 0, UNCLE = 1, TXN = 2, INTERNAL_MSG = 3
	function toggleSubscribe() {
		if (subscribed) {
			instance.status("UnSubscribed");
			subscribed = false;
			client.send(JSON.stringify({"jsonrpc":"2.0","id":0,"method":"unsubscribe","params":["block"]}));
		} else {
			instance.status("Subscribed");
			subscribed = true;
			client.send(JSON.stringify({"jsonrpc":"2.0","id":2,"method":"subscribe","params":["transaction"]}));
		}
	}
};
