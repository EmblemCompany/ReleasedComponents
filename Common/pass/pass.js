exports.id = 'pass';
exports.title = 'Pass';
exports.version = '1.0.0';
exports.author = 'Martin Smola';
exports.color = '#656D78';
exports.icon = 'arrow-right';
exports.input = 2;
exports.output = 1;
exports.options = { enabled: true, inputs: 1, passallinputs: false, values: [] };

exports.readme = '60000316070';

exports.html = `<div class="padding">
	<div class="row">
		<div class="col-md-6 m">
			<div data-jc="textbox" data-jc-path="inputs" data-jc-config="type:number;increment:true">@(Number of inputs)</div>
			<div class="help m">@(This doesn't include the first input for data.)</div>
			<div data-jc="checkbox" data-jc-path="passallinputs" data-jc-config="placeholder:path.to.value">@(Pass data from all inputs to output?)</div>
			<div class="help m">@(Only the data from first input are passed by default.)</div>
		</div>
	</div>
</div>
<script>
ON('save.pass', function(component, options) {
    component.input = options.inputs + 1;
});
</script>`;

exports.install = function(instance) {

	instance.custom.status = function() {
		instance.status(instance.options.enabled ? 'enabled' : 'disabled');
	};

	instance.custom.enabled = function() {
		var enabled = true;
		for (let i = 0; i < instance.options.inputs; i++)
			!instance.options.values[i] && (enabled = false);
		instance.options.enabled = enabled;
	};

	instance.custom.reconfigure = function (newopts, oldopts) {
		var options = instance.options;

		if (newopts && oldopts) {
			if (newopts.inputs === oldopts.inputs)
				return;

			if (newopts.inputs < oldopts.inputs) {
				options.values = options.values.splice(0, newopts.inputs - 1);
			} else {
				var n = newopts.inputs - oldopts.inputs;
				for (let i = 0; i < n; i++)
					options.values.push(false);
			}
		}

		instance.custom.enabled();
		instance.custom.status();
	};

	instance.on('data', function(flowdata) {
		var index = flowdata.index;
		if (index === 0)
			return;

		var temp = flowdata.data;
		var enabled = false;
		if (temp === 'on' || temp === true || temp === 1)
			enabled = true;

		instance.options.values[index - 1] = enabled;
		instance.custom.enabled();
		if (instance.options.downstream) {
			flowdata.set(instance.name, flowdata.data);
		}
		instance.options.enabled && instance.options.passallinputs && instance.send(flowdata);
		instance.custom.status();
	});

	instance.on('0', function(flowdata) {
		if (instance.options.downstream) {
			flowdata.set(instance.name, flowdata.data);
		}
		instance.options.enabled && instance.send(flowdata);
	});

	instance.on('click', function() {
		instance.options.enabled = instance.options.enabled;
		instance.custom.status();
	});

	instance.on('options', instance.custom.reconfigure);

	instance.custom.reconfigure();
	instance.custom.status();
};
