exports.id = 'scheduler';
exports.title = 'Scheduler';
exports.group = 'ACTIONS TO START WITH';
exports.version = '1.0.1';
exports.color = '#10bd27';
exports.output = 1;
exports.click = true;
exports.author = 'Peter Širka';
exports.icon = 'calendar';
exports.options = { time: '', repeat: '', noweeks: false, start: '' };

exports.readme = '60000316114';

exports.html = `<div class="padding">
	<div class="row">
		<div class="col-md-3 col-sm-4 m">
			<div data-jc="textbox" data-jc-path="time" data-jc-config="placeholder:12:00;required:true;align:center">@(Time)</div>
			<div class="help">@(24 hours time of the day the flow will be triggered.)</div>
		</div>
		<div class="col-md-3 col-sm-4 m">
			<div data-jc="textbox" data-jc-path="repeat" data-jc-config="placeholder:1 week;required:true;align:center">@(Frequency)</div>
			<div class="help">@(Set to '1 week' for the scheduler to run every week)</div>
		</div>
		<div class="col-md-3 col-sm-4 m">
			<div data-jc="textbox" data-jc-path="start" data-jc-config="placeholder:2 days;align:center">@(Start)</div>
			<div class="help">@(When to start this scheduler. e.g. for tommorow set to '1 day')</div>
		</div>
	</div>
	<hr class="nmt" />
	<section>
		<label><i class="fa fa-random"></i>@(Output data)</label>
		<div class="padding">
			<div data-jc="dropdown" data-jc-path="datatype" data-jc-config="items:,String|string,Integer|integer,Float|float,Boolean|boolean,Date|date,Object|object,Base64 as Buffer|buffer" class="m">@(Data type (String by default))</div>
			<div data-jc="textbox" data-jc-path="data" data-jc-config="placeholder:@(e.g. Hello world or { hello: 'world'} or ['hello', 'world'])">@(Data)</div>
		</div>
	</section>
</div>`;

exports.install = function(instance) {

	var value, id;

	instance.on('click', () => value && instance.send2(value));

	instance.reconfigure = function() {
		var options = instance.options;

		if (!options.time) {
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

		F.clearSchedule(id);
		id = F.schedule(options.start ? options.time.parseDate().add(options.start) : options.time, options.repeat, function() {
			if (instance.options.noweeks) {
				F.datetime = new Date();
				var day = F.datetime.getDate();
				if (day === 0 || day === 6)
					return;
			}
			instance.send(value);
		});

		instance.status('');
	};

	instance.on('close', () => F.clearSchedule(id));
	instance.on('options', instance.reconfigure);
	instance.reconfigure();
};