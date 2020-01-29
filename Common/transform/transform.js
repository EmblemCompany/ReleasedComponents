exports.id = 'transform';
exports.title = 'Data Transform';
exports.group = 'Data Manipulation';
exports.color = '#764f78';
exports.version = '1.0.0';
exports.input = true;
exports.output = 1;
exports.author = 'Peter Širka';
exports.icon = 'random';
exports.options = { fn: 'next(value.toUpperCase())' };

exports.readme = '60000316160';

exports.html = `<div class="padding">
	<div data-jc="dropdown" data-jc-path="parser" class="m" data-jc-config="items:,@(XML to Object)|xml,@(Line to Array)|array,@(JSON to Object)|json,@(Custom)|custom;required:true">@(From which data-type)</div>
	<div data-jc="visible" data-jc-path="parser" data-jc-config="if:value === 'custom'">
		<div data-jc="codemirror" data-jc-path="fn" data-jc-config="type:javascript;tabs:true;trim:true">@(Custom function)</div>
	</div>
</div>`;

exports.install = function(instance) {
	var fn;
	instance.on('data', function(response) {

		if (!response.data)
			return;

		if (instance.options.parser !== 'custom' && typeof(response.data) !== 'string')
			response.data = response.data.toString();

		switch (instance.options.parser) {
			case 'xml':
				response.data = response.data.parseXML();
				if (instance.options.downstream) {
					response.set(instance.name, response.data);
				}
				response.data && instance.send2(response);
				return;
			case 'json':
				response.data = response.data.parseJSON(true);
				if (instance.options.downstream) {
					response.set(instance.name, response.data);
				}
				response.data && instance.send2(response);
				return;
			case 'newline':
				response.data = response.data.split(',').trim();
				if (instance.options.downstream) {
					response.set(instance.name, response.data);
				}
				response.data && instance.send2(response);
				return;
			case 'custom':
				fn(response.data, function(err, value) {
					if (err) {
						instance.error(err, response);
					} else {
						response.data = value;
						if (instance.options.downstream) {
							response.set(instance.name, response.data);
						}
						instance.send2(response);
					}
				});
				return;
		}
	});

	instance.reconfigure = function() {
		var options = instance.options;
		options.parser === 'custom' && options.fn && (fn = SCRIPT(options.fn));
	};

	instance.on('options', instance.reconfigure);
	instance.reconfigure();
};