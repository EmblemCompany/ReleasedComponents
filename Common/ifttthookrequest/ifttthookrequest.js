exports.id = 'ifttthookrequest';
exports.title = 'IFTTT hook request';
exports.group = 'Third-party Providers';
exports.version = '1.0.0';
exports.author = 'Martin Smola';
exports.icon = 'exchange';
exports.color = '#3f99ff';
exports.input = true;
exports.output = 1;
exports.cloning = false;
exports.options = { url: '', parser: '// value is a flowdata instance, value.data is the data send by previous component\n\nnext({\n\tvalue1: \'\',\n\tvalue2: \'\',\n\tvalue3: \'\'\n});' };

exports.readme = '60000315787';

exports.html = `<div class="padding">
	<div class="row">
		<div class="col-md-6 m">
			<div data-jc="textbox" data-jc-path="event">@(Event)</div>
			<div data-jc="textbox" data-jc-path="key" data-jc-config="type:password">@(Key)</div>
		</div>
	</div>
	<div data-jc="codemirror" data-jc-path="parser" data-jc-config="type:javascript;height:200;required:true">@(Data)</div>
	<div class="help hidden">@()</div>
	<p><a href="https://ifttt.com/maker_webhooks" target="_blank">IFTTT Maker Webhooks Documentation</a></p>
</div>`;

exports.install = function(instance) {

	var fn = null;

	var url = 'https://maker.ifttt.com/trigger/{0}/with/key/{1}';

	instance.on('data', function(response) {
		if (typeof(response.data) !== 'object')
			return;
		fn && fn(response.data, function(err, data) {
			!err && post(data, response);
		}, response);
	});

	instance.custom.reconfigure = function() {
		if (instance.options.parser)
			fn = SCRIPT(instance.options.parser);
		else
			fn = null;
	};

	instance.on('options', instance.custom.reconfigure);
	instance.custom.reconfigure();

	function post(data, response) {

		var event = instance.options.event;
		var key = instance.options.key;
		var d;

		if (data.event && data.key && data.body) {
			d = data.body;
			event = data.event;
			key = data.key;
		} else
			d = data;

		if (!event || ! key)
			return instance.status('No config to use', 'red');

		U.request(url.format(event, key), ['post', 'json'], d || EMPTYOBJECT, function(err, data, status) {
			if (instance.options.downstream) {
				response.set(instance.name, status);
			}
			response.data = status
			instance.send2(response);
		});
	}
};
