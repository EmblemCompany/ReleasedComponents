exports.id = 'getemblemwallet';
exports.title = 'Get Saved Emblem Wallet';
exports.group = 'Emblem';
exports.color = '#37BC9B';
exports.input = true;
exports.output = 1;
exports.version = '0.0.1';
exports.author = 'Shannon Code';
exports.icon = 'random';
exports.options = {  };
exports.npm = [];
exports.html = `
<div class="padding">
	
</div>
`

exports.readme = `Reads Emblem Wallet`;

exports.install = function(instance) {
	

	instance.on('data', function(flowdata) {
		var keys =  FLOW.get('keys')
		if (!keys) {
			instance.status('No Emblem Wallet Found', 'red');
		} else {
			instance.status(keys.address, 'green');
			instance.send(keys)
		}
	});
	
};
