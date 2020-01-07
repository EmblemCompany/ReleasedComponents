exports.id = 'getemblemvaultsbyidentity';
exports.title = 'Get Emblem Vaults by Identity';
exports.group = 'Emblem';
exports.color = '#37BC9B';
exports.input = true;
exports.output = 1;
exports.version = '0.0.1';
exports.author = 'Shannon Code';
exports.icon = 'list-alt';
exports.options = {  };
exports.npm = [];

exports.readme = `# Get Emblem Vaults by Identity
This gets a list of Embem Vaults for a given identity.

## Fields

*Address* (optional): Leave blank if using the saved identity created earlier in this circuit. Or, enter the address of a specific Emblem Identity in this field to get a list of Emblem Vaults stored in that identity.
`;

exports.html = `
<div class="padding">
	<div class="row">
		<div class="col-md-12">
			<div data-jc="textbox" data-jc-path="address" data-jc-config="placeholder:Emblem Identity Address">@(address) (@(optional))</div>
			<div class="help">(optional) Enter the address of an Emblem Identity to retrieve a list of Emblem Vaults for that identity. Leave blank if using saved identity from this circuit.</div>
		</div>
	</div>
</div>
`;

exports.install = function(instance) {
	
	instance.on('data', function(response) {
		// instance.send(response)
		var keys = FLOW.get('keys')
		RESTBuilder.make(function(builder) {
			var url = 'https://api.emblemvault.io/balance?address=' + getInputs(response, keys,'address') 
            builder.url(url);
            builder.header('service', 'sandbox-beta')
            builder.method('get')
            builder.exec(function(err, response) {
				// instance.status(response.payload.import_response.name, 'green');
				instance.send({response: response, err: err, url: url})
			});
		});
	});

	function getInputs(response, keys, name, path) {
		if (keys) {
			if (path) {
				var toEvaluate = 'keys.'+path+'["'+name+'"]'
				instance.send(toEvaluate)
				return eval(toEvaluate)
			} else {
				return keys[name]
			}
		}
		else if (path) {
			var toEvaluate = 'instance.options["'+name+'"] || FLOW.variables.'+path+'["'+name+'"] || response.data.'+path+'["'+name+'"] || ""'
			instance.send(toEvaluate)
			return eval(toEvaluate)
		} else {
			return instance.options[name] || FLOW.variables[name] || response.data[name] || ''
		}
	}
};
