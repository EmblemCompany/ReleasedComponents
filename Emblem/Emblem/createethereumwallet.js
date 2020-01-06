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
exports.html = `
<div class="padding">
	<div class="row">
		<div class="col-md-3 m">
			<div data-jc="checkbox" data-jc-path="persistKey">Save wallet?</div>
		</div>
		<div class="col-md-3 m">
			<div data-jc="checkbox" data-jc-path="removeKey">Remove saved wallet?</div>
		</div>
	</div>
</div>
`;

exports.readme = `Ethereum Wallet Functionality`;

exports.install = function(instance) {

	const Web3 = require('web3')
	var ethereum = require('ethereumjs-wallet')

	instance.on('data', function(flowdata) {
		var keys = ""
		if (instance.options.removeKey) {
			FLOW.rem('eth-keys')
		}
		if (instance.options.persistKey) {
			keys = FLOW.get('eth-keys') || "";
			if (!keys) {
				keys = generateKey()
				FLOW.set("eth-keys",keys)				
				flowdata.set('eth-keys', keys)
				instance.send(flowdata.keys = keys)
			} else {
				flowdata.set('eth-keys', keys)
				instance.send(flowdata.keys = keys)
			}
		} else {
			keys = generateKey()
			flowdata.set('keys', keys)
			instance.send(flowdata.keys = keys)
		}
	});

	function generateKey() {
		var ethereumWallet = ethereum.generate()
			var ethereumKey = ethereumWallet.privKey.toString('hex')
			var ethereumAddress = ethereumWallet.getAddress().toString('hex')
			return {key: ethereumKey, address: ethereumAddress, type: 'ethereum'}
	}
};
