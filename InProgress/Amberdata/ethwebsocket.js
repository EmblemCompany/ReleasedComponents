// https://github.com/amberdata/amberdata-example-websockets/blob/master/index.js
// https://amberdata.io/guides/view-digital-asset-holdings
// https://docs.amberdata.io/reference	
exports.id = 'ethwebsocket';
exports.title = 'Amberdata Blockchain Events';
exports.group = 'Amberdata';
exports.color = '#6F748D';
exports.click = true;
exports.input = false;
exports.output = true;
exports.author = 'Shannon Code <shannon@unspecified.me>';
exports.icon = 'exchange-alt';
exports.version = '0.0.3';
exports.options = {  events: 0};

exports.html = `
<div class="padding">
	<div class="row">
		<div class="col-md-12">
			<div data-jc="textbox" data-jc-path="amberdatakey" data-jc-config="type:password">@(amberdatakey) (required) </div>
			<div class="help"></div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-6">
			<div data-jc="dropdown" data-jc-path="event" data-jc-config="items:New Blocks|0,New Uncles|1, New Transactions|2, New Internal Message|3">@(Event Type) (required) </div>
			<div class="help"></div>
		</div>
		<div class="col-md-6">
			<div data-jc="dropdown" data-jc-path="blockchainid" data-jc-config="datasource:blockchains">@(Blockchain) (required) </div>
			<div class="help"></div>
		</div>
	</div>
</div>
<script>
	var blockchains = [
		{name:'Aion Moldoveanu',id:'ce4b52f276dcbab8'},
		{name:'Bitcoin Mainnet', id:'408fa195a34b533de9ad9889f076045e'},
		{name:'Bitcoin Cash', id:'43b45e71cc0615b491cb699e7071fc06'},
		{name:'Bitcoin SV', id:'a818635d36dbe125e26167c4438e2217'},
		{name:'Ethereum Mainnet', id:'1c9c969065fcd1cf'},
		{name:'Ethereum Rinkeby (Testnet)', id:'1b3f7a72b3e99c13'},
		{name:'Litecoin', id:'f94be61fd9f4fa684f992ddfd4e92272'},
		{name:'Stellar', id:'822e2ebe02f74df8'},
		{name:'Zcash', id:'b7d4f994f33c709be4ce6cbae31d7b8e'}
	];
</script>
`;

exports.readme = '60000534057';

exports.install = function(instance) {

	var subscribed = false;

	var blockchains = [
		{name:'Aion Moldoveanu',id:'ce4b52f276dcbab8'},
		{name:'Bitcoin Mainnet', id:'408fa195a34b533de9ad9889f076045e'},
		{name:'Bitcoin Cash', id:'43b45e71cc0615b491cb699e7071fc06'},
		{name:'Bitcoin SV', id:'a818635d36dbe125e26167c4438e2217'},
		{name:'Ethereum Mainnet', id:'1c9c969065fcd1cf'},
		{name:'Ethereum Rinkeby (Testnet)', id:'1b3f7a72b3e99c13'},
		{name:'Litecoin', id:'f94be61fd9f4fa684f992ddfd4e92272'},
		{name:'Stellar', id:'822e2ebe02f74df8'},
		{name:'Zcash', id:'b7d4f994f33c709be4ce6cbae31d7b8e'}
	];

	function getBlockchainNameById(id) {
		return blockchains.filter(chain=>{return chain.id===id})[0].name
	}

	var W3CWebSocket = require('websocket').w3cwebsocket;
 
	var client = makeClient()

	instance.on('click', () => toggleSubscribe())
	const eventMap = ['block', 'uncle', 'transaction', 'function']
	function toggleSubscribe() {
		if (!instance.options.blockchainid) {
			return instance.status("Configure me before you use me!", "red")
		}
		if (subscribed) {
			instance.status("UnSubscribed", "red");
			client = makeClient();
			subscribed = false;
		} else {
			instance.status("Subscribed to "+ eventMap[instance.options.event] + " events on the " +getBlockchainNameById(instance.options.blockchainid) + " blockchain", "green");
			subscribed = true;
			client.send(JSON.stringify({"jsonrpc":"2.0","id":instance.options.event,"method":"subscribe","params":[eventMap[instance.options.event]]}));
		}
	}
	function makeClient() {
		delete client;
		var client =  new W3CWebSocket('wss://ws.web3api.io?x-api-key=' + (instance.options.amberdatakey || 'UAK7d678b6284724438320dc35f1c31ec13') + '&x-amberdata-blockchain-id='+ instance.options.blockchainid, 'echo-protocol');
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
		return client;
	}
};
