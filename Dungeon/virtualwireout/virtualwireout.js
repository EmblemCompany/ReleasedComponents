exports.id = 'virtualwireout';
exports.title = 'Virtual wire out';
exports.version = '1.0.1';
exports.author = 'Martin Smola';
exports.color = '#303E4D';
exports.icon = 'sign-out';
exports.input = true;
exports.output = 1;
exports.options = {};
exports.readme = `# Virtual wire out

When the wires between the components are mess it's time to use Virtual wire.`;

exports.html = `<div class="padding">
	<div data-jc="textbox" data-jc-path="wirename" class="m" data-jc-config="required:true;placeholder:@(some identifier)">@(Wire name)</div>
</div>
<script>
	ON('save.virtualwireout', function(component, options) {
		!component.name && (component.name = options.wirename);
	});
	WATCH('settings.virtualwireout.wirename', function(path, value, type){
		if (type === 2) {
			console.log('path', path, 'value', value);
			SET('settings.virtualwireout.wirename', value.slug());
		}
	});
</script>`;

exports.install = function(instance) {

	instance.custom.reconfigure = function(){
		if (instance.options.wirename) {
			instance.status(instance.options.wirename);
		} else
			instance.status('Configure me before you use me!', 'red');
	};

	instance.on('data', function(flowdata) {
		EMIT('virtualwire', instance.options.wirename, flowdata, Object.keys(instance.connections).length > 0 ? true: false);
	});

	ON('virtualwire.callback', function(wirename, flowdata){
		if (instance.options.wirename && instance.options.wirename === wirename){
			if (instance.options.downstream) {
				flowdata.set(instance.name, flowdata.data);
			}
			instance.send(flowdata);
		}
	});

	instance.on('options', instance.custom.reconfigure);
	instance.custom.reconfigure();
};
