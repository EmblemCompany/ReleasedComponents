exports.id = 'createemblemidentity';
exports.title = 'Create Emblem Identity';
exports.group = 'Emblem';
exports.color = '#37BC9B';
exports.input = true;
exports.output = 1;
exports.version = '0.0.9';
exports.author = 'Shannon Code';
exports.icon = 'fingerprint';
exports.options = {  };
exports.npm = [];
exports.html = `
<div class="padding">
	<div class="row">
		<div class="col-md-3 m">
			<div data-jc="checkbox" data-jc-path="persistKey">Save this identity in memory for use in this circuit?</div>
		</div>
		<div class="col-md-3 m">
			<div data-jc="checkbox" data-jc-path="removeKey">Remove previously saved identity?</div>
		</div>
	</div>
</div>
`

exports.readme = `# Create Emblem Identity

Create a new identity to store Emblem Vaults. Once you have created this identity, you can begin creating Emblem Vaults and storing them in this identity.`;

exports.install = function(instance) {
	var CovalLib = require('coval.js')
	var Coval =  new CovalLib.Coval()
	var hdkey = new Coval.Secure.HDKey()

	instance.on('data', function(flowdata) {
		var keys = ""
		if (instance.options.removeKey) {
			FLOW.rem('keys')
		}
		if (instance.options.persistKey){
			keys = FLOW.get('keys') || "";		
			// if (!keys) {
				keys = generateKey()
				FLOW.set("keys",keys)				
				// flowdata.set('keys', keys)
				instance.status(keys.address, 'green');
				instance.send(flowdata.keys = keys)
			// } else {
			// 	// flowdata.set('keys', keys)
			// 	instance.status(keys.address, 'green');
			// 	instance.send(flowdata.keys = keys)
			// }
		} else {
			keys = generateKey()
			// flowdata.set('keys', keys)
			instance.status(keys.address, 'green');
			instance.send(flowdata.keys = keys)
		}
	});
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
};
