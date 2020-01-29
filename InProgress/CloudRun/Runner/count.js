const ID = 'count';
exports.id = 'count';
exports.title = 'Count';
exports.group = 'Logic';
exports.version = '1.0.0';
exports.author = 'John Graves';
exports.color = '#656D78';
exports.icon = 'plus-square';
exports.input = 2;
exports.output = 1;
exports.options = { increment: 1, initialvalue: 1 };

exports.readme = '60000315456';

exports.html = `<div class="padding">
<div data-jc="textbox" data-jc-path="initialvalue" data-jc-config="placeholder:1;increment:true;type:number;align:center">@(Initial Value)</div>
<div data-jc="textbox" data-jc-path="increment" data-jc-config="placeholder:1;increment:true;type:number;align:center">@(Increment)</div>
<p><a href="https://youtu.be/NuUbTm1oRE0" target="_blank">Example Video</a></p>
</div>`

exports.install = function(instance) {

	var count = 0;
	var initialCall = true;

	instance.on('data', function(flowdata) {
		var index = flowdata.index;
 		if(index === 0) { // First bubble, increment by value.

			// If this is the first time, set the value to 'initial value'
			if(initialCall) {
 				initialCall = false;
				count = instance.options.initialvalue;
 			} else {
				count = count+instance.options.increment;
			}
			if (instance.options.downstream) {
				flowdata.set(instance.name, count);
			}
			flowdata.data = count;
			instance.status('Count:' + count);
 			instance.send2(flowdata);
		} else { // Second bubble, reset counter.
 			instance.debug('Reset Count.');
			count = instance.options.initialvalue;
 			initialCall = true;
		}
	});

	instance.on('options', function() {
		count = instance.options.initialvalue;
		initialCall = true;
	});

};
