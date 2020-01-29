exports.id = 'shamirsplit';
exports.title = 'Shamir Secret Split';
exports.group = 'Emblem Services';
exports.color = '#61affe';
exports.input = true;
exports.output = 1;
exports.version = '0.0.3';
exports.author = 'Shannon Code';
exports.icon = 'puzzle-piece';
exports.options = {  };
exports.npm = [];

exports.readme = '60000403711';

exports.html = `
<div class="padding">
	<div class="row">
		<div class="col-md-6">
			<div data-jc="textarea" data-jc-path="data" data-jc-config="placeholder:some data (hex)">@(Secret to split) (optional) </div>
			<div class="help">@(If none is provided a key will be generated)</div>
		</div>
		<div class="col-md-3">
			<div data-jc="textbox" data-jc-path="shares" data-jc-config="increment:true;type:number;align:center;minimum:2">@(Number of shares to make) </div>
			<div class="help">@(How many secret pieces will be created)</div>
		</div>
		<div class="col-md-3">
			<div data-jc="textbox" data-jc-path="threshold" data-jc-config="increment:true;type:number;align:center;minimum:2">@(Shares required to recover) </div>
			<div class="help">@(How many pieces are required to recreate the key)</div>
		</div>
	</div>
</div>`;

exports.install = function(instance) {
	var Mnemonic = require('coval.js/build/secure/Mnemonic').Mnemonic
	var Coval = require('coval.js/build/Coval').Coval
	Coval = new Coval()
	var Shamir = Coval.Secure.Shamir
	

	instance.on('data', function(flowdata) {
		var serverObject = new Shamir.Key()
		if (instance.options.data || flowdata.data) {
			serverObject.SetKey(replaceTokenizedString(flowdata, instance.options.data || flowdata.data));
		}
		var shares = serverObject.CreateShares(instance.options.shares ? instance.options.shares : 2, instance.options.threshold ? instance.options.threshold : 2).GetValue()
		var combined = serverObject.CombineShares(shares)
		flowdata.data = {shares: shares, combined: combined};
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
