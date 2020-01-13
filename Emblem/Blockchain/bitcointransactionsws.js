exports.id = 'bitcointransactionsws';
exports.title = 'Bitcoin Transactions';
exports.group = 'Blockchain.com';
exports.color = '#164799';
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

exports.readme = `# Bitcoin transactions

Toggle flow of incoming data by pressing the button.
`;

exports.install = function(instance) {

	var subscribed = false;
	const WebSocket = require('ws');

	const ws = new WebSocket('wss://ws.blockchain.info/inv');

	ws.on('open', function open() {
		instance.status("Connected", "green")
	});

	ws.on('message', (data) => {
		data = JSON.parse(data)
		if (!instance.options.raw) {
			data = makeSimple(data);
		}
		var flowdata = instance.make()
		flowdata.data = data
		if (instance.options.downstream) {
			flowdata.set(instance.name, flowdata.data);
		}
		instance.send(flowdata)
	});


	instance.on('click', () => toggleSubscribe())
	
	function makeSimple(tx) {
		var newData = {hash: tx.x.hash, from: [], to: []}
		tx.x.inputs.forEach((input) => {
			newData.from.push({"address": input.prev_out.addr, sats: input.prev_out.value, btc: Number(input.prev_out.value)*0.00000001})
		})
		tx.x.out.forEach((output)=>{
			var isChange = newData.from.filter(input => {return input.address === output.addr}).length > 0
			if (isChange) {
				newData.change = {"address": output.addr, "sats": output.value, btc: Number(output.value)*0.00000001}
			} else {
				newData.to.push({"address": output.addr, "sats": output.value, btc: Number(output.value)*0.00000001})
			}
		})
		var totalFrom = 0
		newData.from.forEach(from=>{
			totalFrom = totalFrom + from.btc
		})
		if (newData.change) {
			totalFrom = totalFrom - newData.change.btc
		}
		newData.totalSpent = totalFrom;
		return newData
	}

	function toggleSubscribe() {
		if (subscribed) {
			instance.status("UnSubscribed");
			subscribed = false;
			ws.send(JSON.stringify({"op": "unconfirmed_unsub"}));
		} else {
			instance.status("Subscribed");
			subscribed = true;
			ws.send(JSON.stringify({"op": "unconfirmed_sub"}));
		}
	}
};
