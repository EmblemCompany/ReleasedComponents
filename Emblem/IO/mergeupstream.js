exports.id ="mergeupstream";
exports.title ="Merge Upstream";
exports.group = "IO";
exports.color ="#ffa824";
exports.input =true;
exports.output =1;
exports.version ="0.0.2";
exports.author ="Shannon Code";
exports.icon ="compress-arrows-alt";

exports.readme = '60000315220';

exports.html = ``;

exports.install = function(instance) {

	instance.on('data', function(response) {
		response.data = response.repository
		if (instance.options.downstream) {
			response.set(instance.name, response);
		}
		instance.send(response)
	});
};