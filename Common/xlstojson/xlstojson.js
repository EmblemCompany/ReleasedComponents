exports.id = 'xlstojson';
exports.title = 'XLS to JSON';
exports.group = 'Parsers';
exports.color = '#37BC9B';
exports.input = true;
exports.output = 1;
exports.version = '1.0.1';
exports.author = 'Martin Smola';
exports.icon = 'random';
exports.options = {  };
exports.npm = ['xlsx'];

exports.readme = '60000316238';

exports.html = `<div class="padding">
	<div class="row">
		<div class="col-md-6">
			<div data-jc="textbox" data-jc-path="filename" data-jc-config="placeholder:/path/to/file/name.xls">@(Filename) (@(optional))</div>
			<div class="help">@(Ignored if a 'buffer' property is in the incomming object.)</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-6">
			<div data-jc="textbox" data-jc-path="sheetname" data-jc-config="placeholder:Sheet1">@(Sheet name) (@(optional, default sheet at index 0))</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-6">
			<div data-jc="textbox" data-jc-path="range" data-jc-config="placeholder:Sheet1">@(Range) (@(optional))</div>
			<div class="help">@(Use number to set start row or string like A3:B6.)</div>
		</div>
	</div>
</div>`;

exports.install = function(instance) {

	const XLSX = require('xlsx');
	const Fs = require('fs');

	instance.custom.process = function(err, buf, response) {

		var wb = XLSX.read(buf, {type:'buffer'});
		var ws = wb.Sheets[instance.options.sheetname || wb.SheetNames[0]];

		var opts = {};

		var r = instance.options.range;
		if (r)
			opts.range = isNaN(r) ? r : parseInt(r);

		var arr = XLSX.utils.sheet_to_json(ws, opts);

		response.data = arr;
		if (instance.options.downstream) {
			response.set(instance.name, arr);
		}

		instance.send2(response);
	};

	instance.on('data', function(flowdata) {

		if (flowdata.data && flowdata.data.buffer) {
			instance.custom.process(null, flowdata.data.buffer, flowdata);
		} else if (instance.options.filename) {
			Fs.readFile(F.path.root(instance.options.filename), instance.custom.process);
		}

	});
};
