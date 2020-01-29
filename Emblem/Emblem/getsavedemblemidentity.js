exports.id = 'getsavedemblemidentity';
exports.title = 'Get Saved Emblem Identity';
exports.group = 'Emblem Services';
exports.color = '#61affe';
exports.input = true;
exports.output = 1;
exports.version = '0.0.2';
exports.author = 'Shannon Code';
exports.icon = 'fingerprint';
exports.options = {  };
exports.npm = [];

exports.readme = '60000315183';

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
