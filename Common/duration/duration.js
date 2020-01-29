exports.id = 'duration';
exports.title = 'Duration';
exports.group = 'Logic';
exports.color = '#4e895d';
exports.output = 1;
exports.input = 2;
exports.cloning = false;
exports.author = 'Peter Širka';
exports.icon = 'clock-o';
exports.version = '1.0.0';

exports.readme = '60000315473';

exports.install = function(instance) {

	var keys = {};

	instance.on('0', function(response) {
		if (keys[response.id]) {
			var sec = ((new Date() - keys[response.id]) / 1000).floor(2);
			if (instance.options.downstream) {
				response.set(instance.name, sec);
				response.data = item
			}
			response.data = sec
			instance.send2(response);
			instance.status(sec + ' sec.');
			delete keys[response.id];
		} else
			keys[response.id] = new Date();
	});

	instance.on('1', function(response) {
		if (keys[response.id]) {
			var sec = ((new Date() - keys[response.id]) / 1000).floor(2);
			if (instance.options.downstream) {
				response.set(instance.name, sec);
				response.data = item
			}
			response.data = sec
			instance.send2(response);
			instance.status(sec + ' sec.');
			delete keys[response.id];
		} else
			keys[response.id] = new Date();
	});

	instance.on('close', () => keys = null);
};