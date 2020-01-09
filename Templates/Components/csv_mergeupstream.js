exports.id ="csv_mergeupstream";
exports.title ="CSV Template Merge Upstream";
exports.group = "Template Components";
exports.color ="#ffa824";
exports.input =true;
exports.output =1;
exports.version ="0.0.2";
exports.author ="Shannon Code";
exports.icon ="object-group";

exports.readme = `# Merge Upstream

This component Merges all upstream results into a single object

## NO FIELDS HERE!

## Stuff you need to know

In this template, we are combining each user in the CSV with the Emblem Vaults just created for them into a single object that can be used downstream.
`;

exports.html = ``;

exports.install = function(instance) {

	instance.on('data', function(response) {
		response.data = response.repository
		instance.send(response)
	});
};