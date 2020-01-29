exports.id = 'mnemonicgenerate';
exports.title = 'Generate Mnemonic Phrase';
exports.group = 'Emblem Services';
exports.color = '#61affe';
exports.input = true;
exports.output = 1;
exports.version = '0.0.2';
exports.author = 'Shannon Code';
exports.icon = 'key';
exports.options = {  };
exports.npm = [];

exports.readme = '60000401696';

exports.html = `
<div class="padding">
	<div class="row">
		<div class="col-md-6">
			<div data-jc="textarea" data-jc-path="data" data-jc-config="placeholder:some data (hex)">@(Hex String) </div>
			<div class="help">@(This is the 32-bit or 64-bit hex data to encode)</div>
		</div>
	</div>
</div>`;

exports.install = function(instance) {
	var Mnemonic = require('coval.js/build/secure/Mnemonic').Mnemonic;
	

	instance.on('data', function(flowdata) {
		var mnemonic;
		if (!instance.options.split) {
			mnemonic = new Mnemonic(replaceTokenizedString(flowdata, instance.options.data || flowdata.data));
		} else {
			mnemonic = new Mnemonic();
		}
		var phrase = mnemonic.Generate();
		var shares;
		if (instance.options.split) {
			shares = mnemonic.Split();
		}
		var seedHex = mnemonic.ToSeedHex(phrase);
		var entropy = mnemonic.ToEntropy(phrase)
		flowdata.data = {phrase: phrase, seedHex: seedHex, entropy: entropy, shares: shares};
		if (instance.options.downstream) {
			flowdata.set(instance.name, flowdata.data);
		}
		instance.send(flowdata)
	
	});

	function replaceTokenizedString(response, myString) {
        var tokenRegex = /[^{\}]+(?=})/g
        var replaceArray = myString.match(tokenRegex);
        if (replaceArray) {
            replaceArray.forEach(item=>{
                    objectPath = item.replace('msg.', 'response.data.')
                    myString = myString.replace('{' + item + '}', eval(objectPath))
            })
        }
        return myString
    }
};
