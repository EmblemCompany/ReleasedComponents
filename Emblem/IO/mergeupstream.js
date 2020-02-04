exports.id ="mergeupstream";
exports.title ="Merge Upstream";
exports.group = "Data Manipulation";
exports.color ="#764f78";
exports.input =true;
exports.output =1;
exports.version ="0.0.3";
exports.author ="Shannon Code";
exports.icon ="compress-arrows-alt";

exports.readme = '60000315220';

exports.html = ``;

exports.install = function(instance) {

	instance.on('data', function(response) {
		var tmp = {data: response.data}
		tmp.upstream = response.repository
		response.data = tmp
		if (instance.options.downstream) {
			response.set(instance.name, response);
		}
		instance.send(response)
	});
};