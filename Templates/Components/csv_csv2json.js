exports.id = 'csv_csv2json';
exports.title = 'CSV Template CSV 2 JSON';
exports.group = 'Template Components';
exports.color = '#656D78';
exports.input = true;
exports.output = 1;
exports.author = 'Shannon code';
exports.icon = 'file-csv';
exports.version = '0.0.2';
exports.npm = []
exports.options = { outputs: 1 };

exports.readme = '60000317959';

exports.html = `<div class="padding">
	<div class="row">
		<div class="col-md-12">
			<div data-jc="textbox" data-jc-path="filename" data-jc-config="type:text;value:user-sample.csv">filename</div>
			<div class="help m"></div>
		</div>
	</div>
</div>`;

exports.install = function(instance) {
	instance.on('data', function(response) {
		const csv = require("csvtojson");
		if (response.data && !response.data.filename) {
			csv().fromString(response.data).then((jsonObj)=>{
				pushItems(0, jsonObj, ()=>{
					instance.status("Processing Complete", 'green');
				})
			})
		} else {
			var file = instance.options.filename || FLOW.variables.filename || response.data.filename;
			csv().fromFile('./' + file).then((jsonObj)=>{
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
				if (instance.options.downstream) {
					response.set(instance.name, response.data);
				}
				instance.send(response);
				instance.status("Processing Item number "+ (index+1) + " of " + items.length, 'green');
				return pushItems(index +1, items, cb);
				
			}, 3000);
		}
	});
};