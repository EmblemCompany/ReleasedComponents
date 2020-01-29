exports.id = 'split';
exports.title = 'Split';
exports.group = 'Logic';
exports.version = '1.1.2';
exports.color = '#4e895d';
exports.input = true;
exports.output = 1;
exports.options = {};
exports.author = 'Jiří Travěnec';
exports.icon = 'code-fork';

exports.readme = '60000316157';

exports.html = `
<div class="padding">
	<div class="row">
		<div class="col-md-12">
			<div data-jc="textbox" data-jc-path="path" data-jc-config="type:text;placeholder:{msg.myAarray}">Path to property to split (optional)</div>
			<div class="help m"></div>
		</div>
	</div>
</div>
`

exports.install = function(instance) {
	instance.on('data', function (response) {
		// console.log('response', response)
		var data = response.data
		if (instance.options.path) {
			data = replaceTokenizedString(response, instance.options.path || response.data);
		}
		// console.log('data', data)
		if (data instanceof Array) {
			// console.log("Array!")
			for (var i = 0; i < data.length; i++) {
				// console.log('item', data[i], i)
				if (data[i] != null) {
					var msg = instance.make(data[i], 0);
					msg.repository = response.repository;
					if (instance.options.downstream) {
						response.set(instance.name, msg.data);
					}
					instance.send2(msg);
				}
			}
		}
	});
	function replaceTokenizedString(response, myString) {
		var tokenRegex = /[^{\}]+(?=})/g
		return replace(myString);
		function replace(myString){
			var replaceArray = myString.match(tokenRegex);
			if (replaceArray) {
				replaceArray.forEach(item=>{
						objectPath = item.replace('msg.', 'response.data.')
						//console.log('objectPath', objectPath, eval( objectPath), 'myString', myString)
						//myString = myString.replace('{' + item + '}', eval(objectPath))
						myString = eval( objectPath);
				})
			}
			return myString
		}        
    }
};
