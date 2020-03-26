const Fs = require('fs');

exports.id = 'filewriter';
exports.title = 'File Writer';
exports.group = 'Files and Data I/O';
exports.color = '#ffa500';
exports.icon = 'file-text-o';
exports.input = true;
exports.version = '1.0.2';
exports.author = 'Peter Širka';
exports.options = { filename: '', append: true, delimiter: '\\n' };

exports.html = `<div class="padding">
	<div data-jc="textbox" data-jc-path="filename" data-jc-config="placeholder:@(Type a filename with extension, e.g. output.txt);maxlength:100">@(Filename)</div>
	<div class="help m">@(The file will be stored in the public directory.</div>
	<div class="m">
		<div data-jc="checkbox" data-jc-path="append">Append mode</div>
	</div>
	<div class="row">
		<div class="col-lg-2 col-md-3 m">
			<div data-jc="textbox" data-jc-path="delimiter" data-jc-config="placeholder:@(\\n);maxlength:10;align:center">@(Delimiter)</div>
		</div>
	</div>
</div>`;

exports.readme = '60000315588';

exports.install = function(instance) {

	var filename;
	var delimiter = '';

	instance.on('data', function(response) {
		if (response.data.data) {
			if (response.data.filename) {
				// console.log("Got upstream filename")
				ensurePath(response.data.filename.split('/'), ()=>{
					// console.log("Did it make folders?");
					filename = F.path.public(response.data.filename)
					filename && Fs.mkdir(F.path.public(), NOOP);
				})
			}
			response = instance.make(response.data.data)
		}
		filename && instance.custom.write(response.data);
	});
	function ensurePath(pieces, cb) {
		var newPath = ""
		pieces.forEach((piece, index)=>{
			
			if (index + 1 === pieces.length) {
				return cb()
			} else {
				newPath = newPath + "/" + piece;
				console.log(index, piece, newPath, F.path.public(newPath));
				Fs.mkdir(F.path.public(newPath), NOOP);
			}
		})
	}
	instance.custom.write = function(data) {
		
		U.queue(instance.id, 1, function(next) {
			var line = data instanceof Buffer ? data : typeof(data) === 'string' ? data + delimiter : JSON.stringify(data) + delimiter;
			if (instance.options.append)
				Fs.appendFile(filename, line, function(err) {
					err && instance.throw(err);
					next();
				});
			else
				Fs.writeFile(filename, line, function(err) {
					err && instance.throw(err);
					next();
				});
			F.touch('/' + instance.options.filename);
		});
	};

	instance.custom.reconfigure = function() {
		filename = instance.options.filename ? F.path.public(instance.options.filename) : null;
		delimiter = (instance.options.delimiter || '').replace(/\\n/g, '\n');
		// instance.status(filename ? instance.options.filename : 'Configure me before you use me!', filename ? undefined : 'red');
		filename && Fs.mkdir(F.path.public(), NOOP);
	};

	instance.custom.reconfigure();
	instance.on('options', instance.custom.reconfigure);
};