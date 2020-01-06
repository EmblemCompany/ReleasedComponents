exports.id = 'getemblembalance';
exports.title = 'List Vaults for address';
exports.group = 'Emblem';
exports.color = '#37BC9B';
exports.input = true;
exports.output = 1;
exports.version = '0.0.1';
exports.author = 'Shannon Code';
exports.icon = 'money-check-alt';
exports.options = {  };
exports.npm = [];
exports.html = `
<div class="padding">
	
</div>
`

exports.readme = `# Get Emblem Balance

This gets a list of Embem Vaults for a given identity.`;

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
				if (instance.options.persistVault) {
					if (keys) {
						if (!keys.emblems) {
							keys.emblems = [response]
						} else {
							keys.emblems.push(response)
						}
						FLOW.set('keys', keys)
					}
				}
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
