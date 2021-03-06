exports.id = 'nosql2';
exports.title = 'NoSQL 2';
exports.version = '1.0.0';
exports.group = 'Files and Data I/O';
exports.author = 'Martin Smola';
exports.color = '#D770AD';
exports.icon = 'database';
exports.input = true;
exports.output = 1;
exports.options = {};

exports.readme = '60000316055';

exports.html = `
<div class="padding">
	<div data-jc="textbox" data-jc-path="collection" class="m mt10">DB collection name</div>
	<div data-jc="dropdown" data-jc-path="method" data-jc-config="required:true;items:insert,update,read,query,remove" class="m">@(Method)</div>
	<div data-jc="visible" data-jc-path="method" data-jc-config="if:value === 'insert'">
		<div data-jc="checkbox" data-jc-path="addid">Add unique ID to data before insert</div>
	</div>
	<div data-jc="visible" data-jc-path="method" data-jc-config="if:value === 'update'">
		<div data-jc="checkbox" data-jc-path="upsert">Insert document if it doesn't exist</div>
		<div data-jc="checkbox" data-jc-path="upsertid">Add unique ID to data before insert (only if it doesn't exist)</div>
	</div>
</div>`;

exports.install = function(instance) {

	instance.on('data', function(flowdata, next) {
		if (instance.options.downstream) {
			flowdata.set(instance.name, flowdata.data);
		}
		instance.send2(1, flowdata.clone());

		var data = flowdata.data;
		var id = data.idname || 'id';
		var options = instance.options;

		var collection = data.collection || options.collection;
		if (!collection)
			return next(0, flowdata.rewrite({ success: false, err: '[DB] No collection specified' }));

		var nosql = NOSQL(collection);
		var method = flowdata.data.method || options.method;

		if (!method)
			return next(0, flowdata.rewrite({ success: false, err: '[DB] No method specified' }));

		if (method === 'read') {

			if (!data[id])
				return next(0, flowdata.rewrite({ success: false, err: '[DB] Cannot get record by id: `undefined`' }));

			nosql.find().make(function(builder) {
				builder.where(id, data[id]);
				builder.first();
				builder.callback(function(err, response) {
					next(0, flowdata.rewrite({ success: err ? false : true, result: response }));
				});
			});

		} else if (method === 'insert') {

			options.addid && (data[id] = UID());
			nosql.insert(data).callback(function(err) {
				next(0, flowdata.rewrite({ success: err ? false : true, result: data[id] }));
			});

		} else if (method === 'query') {

			var query = data;
			nosql.find().make(function(builder) {
				query && query instanceof Array && query.forEach(function(q) {
					if (q instanceof Array) {
						var m = q[0];
						var args = q.splice(1);
						builder[m] && (builder[m].apply(builder, args));
					}
				});
				builder.callback(function(err, response) {
					next(0, flowdata.rewrite({ success: err ? false : true, result: response || [] }));
				});
			});

		} else if (method === 'update') {

			if (!options.upsert && !data[id]) {
				next(0, flowdata.rewrite({ success: false, err: '[DB] Cannot update record by id: `undefined`' }));
			}

			if (options.upsert && (options.upsertid && !data[id]))
				data[id] = UID();

			nosql.modify(data, options.upsert).make(function(builder) {
				builder.where(id, data[id]);
				builder.callback(function(err, count) {
					next(0, flowdata.rewrite({ success: err ? false : true, result: count || 0 }));
				});
			});

		} else if (method === 'remove') {

			if (!data[id])
				return next(0, flowdata.rewrite({ success: false, err: '[DB] Cannot remove record by id: `undefined`' }));

			nosql.remove().make(function(builder) {
				builder.where(id, data[id]);
				builder.callback(function(err, count) {
					next(0, flowdata.rewrite({ success: err ? false : true, result: count || 0 }));
				});
			});
		}
	});
};
