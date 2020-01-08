exports.id = 'code';
exports.title = 'Code';
exports.group = 'Common';
exports.color = '#656D78';
exports.input = true;
exports.output = 1;
exports.author = 'Peter Širka';
exports.icon = 'code';
exports.version = '1.2.0';
exports.options = { outputs: 1, code: 'send(0, value);', keepmessage: true };

exports.html = `<div class="padding">
	<div class="row">
		<div class="col-md-3">
			<div data-jc="textbox" data-jc-path="outputs" data-jc-config="type:number;validation:value > 0;increment:true;maxlength:3">@(Number of outputs)</div>
			<div class="help m">@(Minimum is 1)</div>
		</div>
	</div>
	<div data-jc="codemirror" data-jc-path="code" data-jc-config="type:javascript;required:true;height:500;tabs:true;trim:true" class="m">@(Code)</div>
	<div data-jc="checkbox" data-jc-path="keepmessage">@(Keep message instance)</div>
</div>
<script>
	var code_outputs_count;

	ON('open.code', function(component, options) {
		code_outputs_count = options.outputs = options.outputs || 1;
	});

	ON('save.code', function(component, options) {
		if (code_outputs_count !== options.outputs) {
			if (flow.version < 511) {
				component.connections = {};
				setState(MESSAGES.apply);
			}
			component.output = options.outputs || 1;
		}
	});
</script>`;

exports.readme = `# Code

This component executes custom JavaScript code. Note that it executes whatever is entered and doesn't contain any security measures or scoping.

\`\`\`javascript
// 'value' is an {Object} that contains received data
// 'send(outputIndex, newValue) sends 'newValue' to the output at 'outputIndex'
//   'send can be used multiple times
// 'error(value)' sends an error
// 'instance' is an {Object} that represents the current component instance
// 'flowdata' is an {Object} that contains current flowdata
// 'repository' is an {Object} that contains a current repository of flowdata

// Example:

send(0, value);
\`\`\``;

exports.install = function(instance) {

	var fn;

	instance.on('data', function(response) {
		if (fn) {
			try {
				fn(response.data, instance, response, instance.options, response.repository, require);
			} catch (e) {
				response.data = e;
				instance.throw(response);
			}
		}
	});

	instance.reconfigure = function() {
		try {
			if (instance.options.code) {
				instance.status('');
				var code = 'var send = function(index, value) { if (options.keepmessage) { flowdata.data = value; instance.send2(index, flowdata); } else instance.send2(index, value);}; var error = function(err) { instance.throw(err); }; ' + instance.options.code;
				fn = new Function('value', 'instance', 'flowdata', 'options', 'repository', 'require', code);
			} else {
				instance.status('Not configured', 'red');
				fn = null;
			}
		} catch (e) {
			fn = null;
			instance.error('Code: ' + e.message);
		}
	};

	instance.on('options', instance.reconfigure);
	instance.reconfigure();
};