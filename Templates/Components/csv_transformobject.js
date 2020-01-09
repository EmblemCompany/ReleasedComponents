exports.id ="csv_transformobject";
exports.title ="CSV Template Transform Object";
exports.group = "Template Components";
exports.color ="#37BC9B";
exports.input =true;
exports.output =1;
exports.version ="0.0.1";
exports.author ="Shannon Code";
exports.icon ="map-signs";

exports.readme = `# Transform Object

This component allows you to create a new object, specifying which properties to include

## No Fields Here!

## Stuff you need to know

Learn more about using upstream data [here](https://unspecifiedsupport.freshdesk.com/support/solutions/articles/60000182172-using-a-component-s-response-data)!

This template is using this component to map data properties into friendly names, so the output will be easily readable.
`;

exports.html = `
<div class="padding">
	<div class="row">
		<div class="col-md-6 m">
			<div data-jc="textboxlist" data-jc-path="name" data-placeholder="@(Type name of this property)">@(name)</div>
		</div>
		<div class="col-md-6 m">
			<div data-jc="textboxlist" data-jc-path="properties" data-placeholder="@(Type properties to include here)">@(properties)</div>
		</div>
	</div>
</div>`;

exports.install = function(instance) {

	instance.on('data', function(response) {
		if(instance.options.properties) {
			var newObject = {};
			instance.options.properties.forEach((prop, index)=>{
				var toEval = 'response.data.' + prop.replace('msg.', '')
				newObject[instance.options.name[index]] = eval(toEval)
			})
			instance.send(newObject)
		} else {
			instance.status("Please configure first", 'red');
		}
	});
};