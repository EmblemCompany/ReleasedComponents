exports.id = 'email_vault_createvault';
exports.title = 'Create Emblem Vault';
exports.group = 'Emblem';
exports.color = '#37BC9B';
exports.input = true;
exports.output = 1;
exports.version = '0.0.1';
exports.author = 'Shannon Code';
exports.icon = 'piggy-bank';
exports.options = {  };
exports.npm = [];
exports.html = ``;

exports.readme = `# Create Vault

This creates an Emblem Vault.

## No Fields Here!

## Stuff You Need to Know

This component creates an emblem vault, and by default, a new identity to store the Emblem Vault into.  In case you are working with a locally saved identity where you want to store multiple vaults, it first checks to see if you have a specific identity saved locally. 

## Response

The response object is a large, complex data object that represents both the keys for the identity that stores the vault that created, and all of the information contained in a vault.

Read more about Emblem Vaults here.
`;

exports.install = function(instance) {
	
	instance.on('data', function(response) {
		// instance.send(response)
		var keys = FLOW.get('keys')
		var identity = getInputs(response, keys,'address')
		if (!identity) {
			// console.log("no keys", keys)
			keys = createIdentity()
			// console.log("got keys now", keys)
			identity = getInputs(response, keys,'address')
			makeVault()
		} else {
			makeVault()
		}
		
		function makeVault() {
			RESTBuilder.make(function(builder) {
				var url = 'https://api.emblemvault.io/create?skip_unloq=true&pvt=&address=' + identity 
				// instance.send({url: url})
				url = url + '&name='
				// instance.send({url: url})
				url = url + '&unloq_id=' + getUnloq(response, keys, 'unloq_id')
				// instance.send({url: url})
				url = url + '&unloq_key=' + getUnloq(response, keys, 'unloq_key')
				// instance.send({url: url})
				builder.url(url);
				builder.header('service', 'sandbox-beta')
				builder.method('get')
				builder.exec(function(err, response) {
					// console.log(err, response)
					instance.status(response.payload.import_response.name, 'green');
					instance.send({response: response, err: err, url: url, keys: keys})
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
		}
		
	});

	function createIdentity() {
		instance.status("No identity found, generating one", 'green');
		var CovalLib = require('coval.js')
		var Coval =  new CovalLib.Coval()
		var hdkey = new Coval.Secure.HDKey()
		return generateKey()
		function generateKey() {
			return hdkey.StandardHDKey('0', function(address, key){
				var accessToken = {}
				accessToken.method="mock"
				accessToken.unloq_id = randomString(6, '#')
				accessToken.unloq_key = randomString(64, 'hex')
				return keys = {accessToken: accessToken, address: address, keyType: 'wallet', keyOriginator: 'CircuitBuilder', key: key.privateKey.toString()}
			})
		}
		function randomString(length, chars) {
			let mask = '';
			if (chars.indexOf('a') > -1) { mask += 'abcdefghijklmnopqrstuvwxyz'; }
			if (chars.indexOf('A') > -1) { mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; }
			if (chars.indexOf('hex') > -1) { mask += '0123456789abcdefABCDEF'; }
			if (chars.indexOf('#') > -1) { mask += '0123456789'; }
			if (chars.indexOf('!') > -1) { mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\'; }
			let result = '';
			for (let i = length; i > 0; --i) { result += mask[Math.floor(Math.random() * mask.length)]; }
			return result;
		}
	}

	

	function getUnloq(response, keys, name) {
		if (keys) {
			return keys.accessToken[name]
		} else {
			if (instance.options[name]) {
				return instance.options[name]
			} else if(FLOW.variables[name]) {
				return FLOW.variables[name]
			} else if(response.data.accessToken && response.data.accessToken[name]){
				return response.data.accessToken[name]
			} else {
				return ''
			}
		}
	}

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
