exports.id = 'modified';
exports.title = 'Modified';
exports.group = 'Logic';
exports.color = '#656D78';
exports.version = '1.0.0';
exports.input = true;
exports.output = 1;
exports.author = 'Peter Širka';
exports.icon = 'refresh';

exports.readme = '60000315847';

exports.install = function(instance) {
	var backup = undefined;
	var counter = 0;
	instance.on('data', function(response) {
		var data = response.data;
		if (data instanceof Buffer)
			data = data.toString('base64');
		else if (typeof(data) === 'object' || data instanceof Date)
			data = JSON.stringify(data);
		if (backup !== data) {
			backup = data;
			if (instance.options.downstream) {
				response.set(instance.name, response.data);
			}
			instance.send2(response);
		} else {
			counter++;
			instance.status('Not modified: {0}x'.format(counter));
		}
	});
};