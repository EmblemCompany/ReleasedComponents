exports.id = 'csv2json';
exports.title = 'CSV 2 JSON';
exports.group = 'Data Manipulation';
exports.color = '#764f78';
exports.input = true;
exports.output = 1;
exports.author = 'Shannon code';
exports.icon = 'file-csv';
exports.version = '0.0.2';
exports.npm = []
exports.options = { outputs: 1 };

exports.readme = '60000315205';

exports.html = `<div class="padding">
	<div class="row">
		<div class="col-md-12">
			<div data-jc="textbox" data-jc-path="filename" data-jc-config="type:text;value:user-sample.csv">filename</div>
			<div class="help m"></div>
		</div>
	</div>
</div>`;

exports.install = function(instance) {
	var chunk = 0;
	var lastChunk;
	instance.on('data', function(response) {
		const csv = require("csvtojson");
		if (response.data && !response.data.filename) {
			csv().fromString(response.data).then((jsonObj)=>{
				if (instance.options.downstream) {
					response.set(instance.name, jsonObj);
				}
				pushItems(0, jsonObj, ()=>{
					instance.status("Processing Complete", 'green');
				})
			})
		} else {
			var file = instance.options.filename || FLOW.variables.filename || response.data.filename;
			csv().fromFile('./' + file).then((jsonObj)=>{
				if (instance.options.downstream) {
					response.set(instance.name, jsonObj);
				}
				pushItems(0, jsonObj, ()=>{
					instance.status("Processing Complete", 'green');
				})
			})
		}
		
		function pushItems(index, items, cb) {
			var item = items[index];
			setTimeout(()=>{
				if (items.length < index +1) {
					return cb();
				}
				response.set('item', item)
				response.data = {item: item}
				instance.send(response);
				instance.status("Processing Item number "+ (index+1) + " of " + items.length, 'green');
				return pushItems(index +1, items, cb);
				
			}, 3000);
		}
	});
};