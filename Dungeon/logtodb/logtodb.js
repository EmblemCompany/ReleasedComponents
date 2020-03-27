exports.id = 'logtodb';
exports.title = 'Log to DB';
exports.group = 'Files and Data I/O';
exports.color = '#B0C4DE';
exports.author = 'Martin Smola';
exports.icon = 'database';
exports.version = '1.0.0';
exports.input = true;
exports.output = true;
exports.options = { dbname: '', template: ''};
exports.html = `<div class="padding">
	<div class="row">
		<div class="col-md-3">
			<div data-jc="textbox" data-jc-path="dbname" data-jc-config="">@(DB name)</div>
		</div>
		<div class="col-md-9">
			<div data-jc="textbox" data-jc-path="template" data-jc-config="">@(Template)</div>
		</div>
	</div>
</div>`;
exports.readme = '60000315802';

exports.install = function(instance) {

	instance.custom.reconfigure = function() {
		if (!instance.options.dbname || !instance.options.template)
			return instance.status('Configure me before you use me!', 'red');
		instance.status('');
	};

	instance.on('data', function(flowdata) {
		if (instance.options.downstream) {
			flowdata.set(instance.name, flowdata.data);
		}
		instance.send(flowdata);
		if (!instance.options.dbname || !instance.options.template)
			return;
		var str = F.viewCompile(instance.options.template, flowdata.data, '', { time: new Date().getTime() });
		NOSQL(instance.options.dbname).insert({ dt: new Date().getTime(), body: str });
	});

	instance.on('options', instance.custom.reconfigure);
	instance.custom.reconfigure();
};
