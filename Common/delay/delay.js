exports.id = 'delay';
exports.title = 'Delay';
exports.color = '#656D78';
exports.icon = 'clock-o';
exports.group = 'Time';
exports.input = true;
exports.output = 1;
exports.version = '1.0.1';
exports.author = 'Peter Širka';
exports.options = { delay: 1000 };

exports.readme = '60000315472';

exports.html = `<div class="padding">
	<div class="row">
		<div class="col-md-3">
			<div data-jc="textbox" data-jc-path="delay" data-jc-config="placeholder:@(In milliseconds);maxlength:10;type:number;increment:true;align:center">@(Delay)</div>
		</div>
	</div>
</div>`;

exports.install = function(instance) {

	var queue = [];
	var timeout;

	instance.on('data', function(response) {
		queue.push(response);
		instance.custom.send();
	});

	instance.custom.send = function() {
		if (timeout)
			return;
		var item = queue.shift();
		item && (timeout = setTimeout(function() {
			timeout = null;
			
			instance.send2(item);
			instance.custom.send();
			if (queue.length)
				instance.status(queue.length + 'x pending', 'red');
			else
				instance.status('');
		}, instance.options.delay || 1000));
	};

	instance.on('close', () => timeout && clearTimeout(timeout));
};