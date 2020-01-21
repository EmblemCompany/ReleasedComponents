exports.id = 'shamirjoin';
exports.title = 'Shamir Secret Join';
exports.group = 'Emblem Services';
exports.color = '#37BC9B';
exports.input = true;
exports.output = 1;
exports.version = '0.0.1';
exports.author = 'Shannon Code';
exports.icon = 'puzzle-piece';
exports.options = {  };
exports.npm = [];

exports.readme = '60000403769';

exports.html = `
<div class="padding">
	<div class="row">
		<div class="col-md-12 m">
			<div data-jc="textboxlist" data-jc-path="shares" data-placeholder="@(Type shares to join here)">@(Shares)</div>
			<div class="help">@(Insert each share and press enter)</div>
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
		if (instance.options.shares || flowdata.data) {
			var shares = replaceTokenizedString(flowdata, instance.options.shares || flowdata.data)
			var combined = serverObject.CombineShares(shares);
			flowdata.data = {shares: shares, combined: combined};
			if (instance.options.downstream) {
				flowdata.set(instance.name, flowdata.data);
			}
			instance.send(flowdata)
		} else {
			instance.send({error:"you need to specify some shares to join"})
		}
	});

	function replaceTokenizedString(response, myString) {
		var tokenRegex = /[^{\}]+(?=})/g
		console.log(typeof(myString))
		if (typeof(myString) === "object") {
			var arr = []
			myString.forEach(string=>{
				arr.push(replace(string));
			})
			return arr;
		} else {
			return replace(myString);
		}
		function replace(myString){
			var replaceArray = myString.match(tokenRegex);
			if (replaceArray) {
				replaceArray.forEach(item=>{
						objectPath = item.replace('msg.', 'response.data.')
						myString = myString.replace('{' + item + '}', eval(objectPath))
				})
			}
			return myString
		}        
    }
	
};
