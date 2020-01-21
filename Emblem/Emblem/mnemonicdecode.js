exports.id = 'mnemonicdecode';
exports.title = 'Decode Mnemonic Phrase';
exports.group = 'Emblem Services';
exports.color = '#F76605';
exports.input = true;
exports.output = 1;
exports.version = '0.0.1';
exports.author = 'Shannon Code';
exports.icon = 'comment-dots';
exports.options = {  };
exports.npm = [];

exports.readme = '00000000';

exports.html = `
<div class="padding">
	<div class="row">
		<div class="col-md-6">
			<div data-jc="textarea" data-jc-path="data" data-jc-config="placeholder:some data">@(phrase) </div>
			<div class="help">@(Phrase to decode)</div>
		</div>
	</div>
</div>`;

exports.install = function(instance) {
	var Mnemonic = require('coval.js/build/secure/Mnemonic').Mnemonic
	

	instance.on('data', function(flowdata) {
		var mnemonic = new Mnemonic();
		var phrase = replaceTokenizedString(flowdata, instance.options.data || flowdata.data);
		var seedHex = mnemonic.ToSeedHex(phrase);
		var entropy = mnemonic.ToEntropy(phrase);
		flowdata.data = {phrase: phrase, seedHex: seedHex, entropy: entropy};	
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
            });
        }
        return myString;
    };
};
