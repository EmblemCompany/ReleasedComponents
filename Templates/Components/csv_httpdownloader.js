exports.id = 'csv_httpdownloader';
exports.title = 'CSV Template HTTP Downloader';
exports.group = 'Template Components';
exports.color = '#ffa500';
exports.icon = 'cloud-download';
exports.input = true;
exports.output = 1;
exports.version = '1.0.2';
exports.author = 'Peter Širka';
exports.readme = '60000317989';

exports.html = `
<div class="padding">
    <div class="row">
        <div class="col-md-9">
            <div data-jc="textbox" data-jc-path="url" data-jc-config="placeholder:http://github.com/arepo/file.ext">@(url) </div>
            <div class="help"></div>
		</div>
		<div class="col-md-3 m">
			<div data-jc="checkbox" data-jc-path="chunks">Download in chunks?</div>
			<div class="help">Helpful if downloading a binary file</div>
		</div>
    </div>
</div>
`;

exports.install = function(instance) {
	const FLAGS = ['get'];
	instance.on('data', function(response) {
		var url;
		if (instance.options.url) {
			url = instance.options.url;
		} else {
			if (typeof(response.data) === 'string') {
				url = response.data;
			} else if (response.data && response.data.url) {
				url = response.data.url;
			}
		}
		if (instance.options.chunks) {
			url && U.download(url, FLAGS, function(err, response) {
				response.on('data', (chunk) => {
					instance.send2(chunk)
				});
			});
		} else {
            url && U.request(url, FLAGS, {}, function(err, data, status, headers, host) {
                if (response && !err) {
					response.data = data;
					if (instance.options.downstream) {
						response.set(instance.name, response.data);
					}
                    instance.send2(response);
                } else if (err)
                    instance.error(err, response);
            });
        }		
	});
};