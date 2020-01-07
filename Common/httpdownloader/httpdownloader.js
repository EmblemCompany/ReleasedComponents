exports.id = 'downloader';
exports.title = 'HTTP Downloader';
exports.group = 'HTTP';
exports.color = '#5D9CEC';
exports.icon = 'cloud-download';
exports.input = true;
exports.output = 1;
exports.version = '1.0.0';
exports.author = 'Peter Širka';
exports.readme = `# A content downloader

This component downloads a buffer in chunks. Input of this component expects object in the form \`{ url: 'URL address' }\` or \`String\` as URL address.`;

exports.install = function(instance) {
	const FLAGS = ['get'];
	instance.on('data', function(response) {
		var url;
		if (typeof(response.data) === 'string')
			url = response.data;
		else if (response.data && response.data.url)
			url = response.data.url;
		url && U.download(url, FLAGS, function(err, response) {
			response.on('data', (chunk) => instance.send2(chunk));
		});
	});
};