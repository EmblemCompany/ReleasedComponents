exports.id ="mergeupstream";
exports.title ="Merge Upstream";
exports.group = "IO";
exports.color ="#ffa824";
exports.input =true;
exports.output =1;
exports.version ="0.0.2";
exports.author ="Shannon Code";
exports.icon ="compress-arrows-alt";

exports.readme = `# Merge Upstream

This component Merges all upstream results into a single object

## NO FIELDS HERE!

## Stuff you need to know

Learn more [here](https://unspecifiedsupport.freshdesk.com/support/solutions/articles/60000182172-using-a-component-s-response-data)!
`;

exports.html = ``;

exports.install = function(instance) {

	instance.on('data', function(response) {
		response.data = response.repository
		instance.send(response)
	});
};