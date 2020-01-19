exports.id ="transformobject";
exports.title ="Transform Object";
exports.group = "Data Manipulation";
exports.color ="#37BC9B";
exports.input =true;
exports.output =1;
exports.version ="0.0.1";
exports.author ="Shannon Code";
exports.icon ="map-signs";

exports.readme = '60000315222';

exports.html = `
<div class="padding">
	<div class="row">
		<div class="col-md-6 m">
			<div data-jc="textboxlist" data-jc-path="properties" data-placeholder="@(Type properties to include here)">@(Property)</div>
		</div>
		<div class="col-md-6 m">
			<div data-jc="textboxlist" data-jc-path="name" data-placeholder="@(Type name of this property)">@(Name)</div>
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
			response.data = newObject
			if (instance.options.downstream) {
				response.set(instance.name, response.data);
			}
			instance.send(response)
		} else {
			instance.status("Please configure first", 'red');
		}
	});
};