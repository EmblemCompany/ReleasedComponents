exports.id = 'getemblemvaultsbyidentity';
exports.title = 'Get Emblem Vaults by Identity';
exports.group = 'Emblem Services';
exports.color = '#61affe';
exports.input = true;
exports.output = 1;
exports.version = '0.0.2';
exports.author = 'Shannon Code';
exports.icon = 'list-alt';
exports.options = {  };
exports.npm = [];

exports.readme = '60000315174';

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
		var keys = FLOW.get('keys')
		RESTBuilder.make(function(builder) {
			var url = 'https://api.emblemvault.io/balance?address=' + getInputs(response, keys,'address') 
            builder.url(url);
            builder.header('service', 'sandbox-beta')
            builder.method('get')
            builder.exec(function(err, api_response) {
				response.data = api_response
				if (instance.options.downstream) {
                    response.set(instance.name, response.data);
                }
				instance.send(response)
			});
		});
	});

	function getInputs(response, keys, name, path) {
		if (keys) {
			if (path) {
				var toEvaluate = 'keys.'+path+'["'+name+'"]'
				return eval(toEvaluate)
			} else {
				return keys[name]
			}
		}
		else if (path) {
			var toEvaluate = 'instance.options["'+name+'"] || FLOW.variables.'+path+'["'+name+'"] || response.data.'+path+'["'+name+'"] || ""'
			return eval(toEvaluate)
		} else {
			return instance.options[name] || FLOW.variables[name] || response.data[name] || ''
		}
	}
};
