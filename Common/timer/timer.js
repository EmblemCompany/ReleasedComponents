exports.id = 'timer';
exports.title = 'Timer';
exports.version = '1.0.1';
exports.group = 'ACTIONS TO START WITH';
exports.color = '#10bd27';
exports.output = 1;
exports.click = true;
exports.author = 'Peter Širka';
exports.icon = 'clock-o';
exports.options = { interval: 1000 };

exports.readme = '60000316159';

exports.html = `<div class="padding">
	<div class="row">
		<div class="col-md-3 m">
			<div data-jc="textbox" data-jc-path="interval" data-jc-config="placeholder:1000;increment:true;type:number;required:true;align:center">@(Interval in milliseconds)</div>
		</div>
	</div>
	<section>
		<label><i class="fa fa-random"></i>@(Output data)</label>
		<div class="padding">
			<div data-jc="dropdown" data-jc-path="datatype" data-jc-config="items:,String|string,Integer|integer,Float|float,Boolean|boolean,Date|date,Object|object,Base64 as Buffer|buffer" class="m">@(Data type (String by default))</div>
			<div data-jc="textbox" data-jc-path="data" data-jc-config="placeholder:@(e.g. Hello world or { hello: 'world'} or ['hello', 'world'])">@(Data)</div>
		</div>
	</section>
</div>`;

exports.install = function(instance) {

	var value;
	var id;

	instance.on('click', () => value && instance.send2(value));

	instance.reconfigure = function() {
		var options = instance.options;

		if (!options.interval) {
			instance.status('Configure me before you use me!', 'red');
			return;
		}

		value = null;
		switch (options.datatype) {
			case 'string':
				value = options.data;
				break;
			case 'integer':
				value = U.parseInt(options.data);
				break;
			case 'float':
				value = U.parseFloat(options.data);
				break;
			case 'date':
				var num = U.parseInt(options.data);
				value = num ? new Date(num) : options.data.parseDate();
				break;
			case 'object':
				try {
					value = (new Function('return ' + options.data))();
				} catch (e) {
					instance.error(e);
				}
				break;
			case 'boolean':
				value = options.data.parseBoolean();
				break;
			case 'buffer':
				try {
					value = U.createBuffer(options.data);
				} catch (e) {
					instance.error(e);
				}
				break;
		}
		clearInterval(id);
		options.interval && (id = setInterval(() => instance.send2(value), options.interval));
		instance.status('');
	};

	instance.on('close', () => clearInterval(id));
	instance.on('options', instance.reconfigure);
	instance.reconfigure();
};
