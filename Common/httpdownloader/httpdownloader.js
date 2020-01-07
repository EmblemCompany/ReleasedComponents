exports.id = 'downloader';
exports.title = 'HTTP Downloader';
exports.group = 'HTTP';
exports.color = '#5D9CEC';
exports.icon = 'cloud-download';
exports.input = true;
exports.output = 1;
exports.version = '1.0.1';
exports.author = 'Peter Širka';
exports.readme = `# A content downloader

This component downloads a buffer in chunks. Input of this component expects object in the form \`{ url: 'URL address' }\` or \`String\` as URL address.`;

exports.html = `
<div class="padding">
    <div class="row">
        <div class="col-md-12">
            <div data-jc="textbox" data-jc-path="url" data-jc-config="placeholder:http://github.com/arepo/file.ext">@(url) </div>
            <div class="help"></div>
        </div>
    </div>
</div>`;

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
		url && U.download(url, FLAGS, function(err, response) {
			response.on('data', (chunk) => instance.send2(chunk));
		});
	});
};