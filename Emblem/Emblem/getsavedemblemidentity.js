exports.id = 'getsavedemblemidentity';
exports.title = 'Get Saved Emblem Identity';
exports.group = 'Emblem';
exports.color = '#37BC9B';
exports.input = true;
exports.output = 1;
exports.version = '0.0.1';
exports.author = 'Shannon Code';
exports.icon = 'fingerprint';
exports.options = {  };
exports.npm = [];

exports.readme = `# Get Saved Emblem Identity

Retrieves the Emblem Identity created earlier within a circuit. Requires you have previously used the *Create Emblem Identity* component.
`;

exports.html = ``;

exports.install = function(instance) {
	

	instance.on('data', function(flowdata) {
		var keys =  FLOW.get('keys')
		if (!keys) {
			instance.status('No Emblem Identities Found', 'red');
		} else {
			instance.status(keys.address, 'green');
			instance.send(keys)
		}
	});
	
};
