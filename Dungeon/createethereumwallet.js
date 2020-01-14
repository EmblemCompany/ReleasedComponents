exports.id = 'ethereumwallet';
exports.title = 'Get or Create ETH Wallet';
exports.group = 'Ethereum';
exports.color = '#37BC9B';
exports.input = true;
exports.output = 1;
exports.version = '0.0.6';
exports.author = 'Shannon Code';
exports.icon = 'wallet';
exports.options = {  };
exports.npm = [];

exports.readme = `Ethereum Wallet Functionality`;

exports.html = ``;

exports.install = function(instance) {

	const Web3 = require('web3')
	var ethereum = require('ethereumjs-wallet')

	instance.on('data', function(flowdata) {
		var keys = generateKey()
		flowdata.data = keys
		if (instance.options.downstream) {
			flowdata.set(instance.name, flowdata.data);
		}
		instance.send(flowdata)
		
	});

	function generateKey() {
		var ethereumWallet = ethereum.generate()
			var ethereumKey = ethereumWallet.privKey.toString('hex')
			var ethereumAddress = ethereumWallet.getAddress().toString('hex')
			return {key: ethereumKey, address: ethereumAddress, type: 'ethereum'}
	}
};
