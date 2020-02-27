exports.id = 'virtualwirecallback';
exports.title = 'Virtual wire callback';
exports.version = '1.0.0';
exports.author = 'Shannon code';
exports.color = '#303E4D';
exports.icon = 'recycle';
exports.input = true;
exports.options = {};
exports.readme = `# Virtual wire callback

When the wires between the components are mess it's time to use Virtual wire.`;

exports.html = `<div class="padding">
	<div data-jc="textbox" data-jc-path="wirename" class="m" data-jc-config="required:true;placeholder:@(some identifier)">@(Wire name)</div>
</div>
<script>
	ON('save.virtualwirecallback', function(component, options) {
		!component.name && (component.name = options.wirename);
	});
	WATCH('settings.virtualwirecallback.wirename', function(path, value, type){
		if (type === 2) {
			console.log('path', path, 'value', value);
			SET('settings.virtualwirecallback.wirename', value.slug());
		}
	});
</script>`;

exports.install = function(instance) {

	instance.custom.reconfigure = function(){
		if (instance.options.wirename) {
			instance.status(instance.options.wirename);
		} 
	};

	instance.on('data', function(flowdata) {
		var callbacks = flowdata.get('callbacks');
		if (callbacks && callbacks.length > 0) {
				instance.options.wirename = callbacks.pop();
				flowdata.set('callbacks', callbacks);
				instance.status(instance.options.wirename);
		}
		EMIT('virtualwire.callback', instance.options.wirename, flowdata);
	});

	instance.on('options', instance.custom.reconfigure);
	instance.custom.reconfigure();
};
