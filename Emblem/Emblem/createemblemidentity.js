exports.id = 'createemblemidentity';
exports.title = 'Create Emblem Identity';
exports.group = 'Emblem Services';
exports.color = '#61affe';
exports.input = true;
exports.output = 1;
exports.version = '0.0.10';
exports.author = 'Shannon Code';
exports.icon = 'fingerprint';
exports.options = {  };
exports.npm = [];

exports.readme = '60000314999';

exports.html = ``;

exports.install = function(instance) {
	var CovalLib = require('coval.js')
	var Coval =  new CovalLib.Coval()
	var hdkey = new Coval.Secure.HDKey()

	instance.on('data', function(flowdata) {
		var keys = generateKey()
		instance.status(keys.address, 'green');
		flowdata.data = keys
		if (instance.options.downstream) {
			flowdata.set(instance.name, flowdata.data);
		}
		instance.send(flowdata)
	
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
