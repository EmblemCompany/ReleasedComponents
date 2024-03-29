exports.id = 'csv_trigger';
exports.title = 'CSV Template Trigger';
exports.group = 'Template Components';
exports.color = '#10bd27';
exports.click = true;
exports.output =  1;
exports.version = '0.0.1';
exports.author = 'Martin Smola';
exports.icon = 'play';

exports.readme = '60000318078';


exports.html = `<div class="padding">
	<div data-jc="dropdown__datatype__items:,String|string,Integer|integer,Float|float,Boolean|boolean,Date|date,Object|object,Base64 as Buffer|buffer" class="m">@(Data type (String by default))</div>
	<div data-jc="textbox__data__placeholder:@(e.g. Hello world or { hello: 'world'} or ['hello', 'world']))" class="m">@(Data)</div>
	<div data-jc="checkbox__restart">Trigger 5s after initialization.</div>
	<div class="help">@(Useful when there's a need to run certain flow when the app restarts, etc.)</div>
</div>`;

exports.install = function(instance) {

	var value;

	instance.on('click', () => instance.send2(value));

	instance.reconfigure = function() {
		var options = instance.options;
		value = null;
		switch (options.datatype) {
			case 'integer':
				value = options.data.parseInt2('error');
				value = value === 'error' ? NaN : value;
				break;
			case 'float':
				value = options.data.parseFloat2('error');
				value = value === 'error' ? NaN : value;
				break;
			case 'date':
				options.data = options.data.toString();
				var num = options.data.parseInt('error');
				num === 'error' && (num = options.data.parseDate('error'));
				num === 'error' && (num = null);
				value = num ? new Date(num).toUTCString() : num;
				break;
			case 'object':
				try {
					value = (new Function('return ' + options.data))();
				} catch (e) {
					instance.error(e);
				}
				break;
			case 'boolean':
				value = options.data.parseBoolean();
				break;
			case 'buffer':
				try {
					value = U.createBuffer(options.data);
				} catch (e) {
					instance.error(e);
				}
				break;
			case 'string':
			default:
				value = '' + (options.data || '');
				break;
		}
	};

	instance.on('options', instance.reconfigure);
	instance.reconfigure();

	if (instance.options.restart)
		setTimeout(function(){
			instance.send2(value);
		}, 5000);
};
