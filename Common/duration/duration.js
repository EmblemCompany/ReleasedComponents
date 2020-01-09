exports.id = 'duration';
exports.title = 'Duration';
exports.group = 'Time';
exports.color = '#656D78';
exports.output = 1;
exports.input = 2;
exports.cloning = false;
exports.author = 'Peter Širka';
exports.icon = 'clock-o';
exports.version = '1.0.0';

exports.readme = `# Duration

This component measures the duration of time a circuit takes to process between 2 components. You may want to measure how long an entire circuit takes, or just sub-sections of a circuit.

## Fields

- first input: beginning component
- second input: ending component

## Response

Output contains the number of *seconds* from beginning component to ending component.

`;

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